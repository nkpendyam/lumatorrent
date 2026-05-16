use crate::model::TorrentFileEntry;
use crate::safety::validate_torrent_relative_path;
use std::collections::HashSet;
use std::fs;
use std::io;
use std::path::{Path, PathBuf};
use thiserror::Error;

#[derive(Debug, Clone)]
pub struct SafeDeletePlan {
    pub targets: Vec<SafeDeleteTarget>,
    pub missing_files: Vec<String>,
}

#[derive(Debug, Clone)]
pub struct SafeDeleteTarget {
    pub relative_path: String,
    pub target_path: PathBuf,
}

#[derive(Debug, Error)]
pub enum SafeDeleteError {
    #[error("download root is missing, unsafe, or unavailable")]
    InvalidDownloadRoot,
    #[error("download root must be a real directory, not a symlink")]
    DownloadRootIsSymlink,
    #[error("download root must be a directory")]
    DownloadRootNotDirectory,
    #[error("owned file manifest is empty, so file deletion is not available")]
    EmptyManifest,
    #[error("unsafe torrent file path: {0}")]
    UnsafeRelativePath(String),
    #[error("duplicate torrent file target: {0}")]
    DuplicateTarget(String),
    #[error("refusing to follow symlink while deleting: {0}")]
    SymlinkNotAllowed(String),
    #[error("refusing to move directory to trash from file manifest: {0}")]
    DirectoryNotAllowed(String),
    #[error("permission denied while checking file target: {0}")]
    PermissionDenied(String),
    #[error("trash operation failed: {0}")]
    TrashUnavailable(String),
}

pub fn build_safe_delete_plan(
    download_root: &str,
    files: &[TorrentFileEntry],
) -> Result<SafeDeletePlan, SafeDeleteError> {
    if files.is_empty() {
        return Err(SafeDeleteError::EmptyManifest);
    }

    let root = PathBuf::from(download_root.trim());
    let root_metadata =
        fs::symlink_metadata(&root).map_err(|_| SafeDeleteError::InvalidDownloadRoot)?;
    if root_metadata.file_type().is_symlink() {
        return Err(SafeDeleteError::DownloadRootIsSymlink);
    }
    if !root_metadata.is_dir() {
        return Err(SafeDeleteError::DownloadRootNotDirectory);
    }

    let mut seen_targets = HashSet::new();
    let mut targets = Vec::new();
    let mut missing_files = Vec::new();

    for file in files {
        validate_torrent_relative_path(&file.relative_path)
            .map_err(SafeDeleteError::UnsafeRelativePath)?;

        let target_path = root.join(normalize_relative_path(&file.relative_path));
        let target_key = comparable_path_key(&target_path);
        if !seen_targets.insert(target_key) {
            return Err(SafeDeleteError::DuplicateTarget(file.relative_path.clone()));
        }

        match inspect_manifest_target(&root, &file.relative_path)? {
            ManifestTargetState::PresentFile => targets.push(SafeDeleteTarget {
                relative_path: normalize_relative_path(&file.relative_path),
                target_path,
            }),
            ManifestTargetState::Missing => {
                missing_files.push(normalize_relative_path(&file.relative_path))
            }
        }
    }

    Ok(SafeDeletePlan {
        targets,
        missing_files,
    })
}

pub fn move_plan_to_trash(plan: &SafeDeletePlan) -> Result<Vec<String>, SafeDeleteError> {
    let mut trashed = Vec::new();
    for target in &plan.targets {
        trash::delete(&target.target_path)
            .map_err(|error| SafeDeleteError::TrashUnavailable(error.to_string()))?;
        trashed.push(target.relative_path.clone());
    }
    Ok(trashed)
}

enum ManifestTargetState {
    PresentFile,
    Missing,
}

fn inspect_manifest_target(
    root: &Path,
    relative_path: &str,
) -> Result<ManifestTargetState, SafeDeleteError> {
    let parts = normalize_relative_path(relative_path);
    let mut current = root.to_path_buf();
    let mut last_seen_missing = false;

    for part in parts.split('/') {
        current.push(part);
        match fs::symlink_metadata(&current) {
            Ok(metadata) => {
                if metadata.file_type().is_symlink() {
                    return Err(SafeDeleteError::SymlinkNotAllowed(parts));
                }
                last_seen_missing = false;
            }
            Err(error) if error.kind() == io::ErrorKind::NotFound => {
                last_seen_missing = true;
                break;
            }
            Err(error) if error.kind() == io::ErrorKind::PermissionDenied => {
                return Err(SafeDeleteError::PermissionDenied(parts));
            }
            Err(error) => return Err(SafeDeleteError::TrashUnavailable(error.to_string())),
        }
    }

    if last_seen_missing {
        return Ok(ManifestTargetState::Missing);
    }

    let metadata = fs::symlink_metadata(&current)
        .map_err(|error| SafeDeleteError::TrashUnavailable(error.to_string()))?;
    if metadata.is_dir() {
        return Err(SafeDeleteError::DirectoryNotAllowed(parts));
    }

    Ok(ManifestTargetState::PresentFile)
}

fn normalize_relative_path(path: &str) -> String {
    path.replace('\\', "/")
}

fn comparable_path_key(path: &Path) -> String {
    let value = path.to_string_lossy().replace('\\', "/");
    if cfg!(windows) {
        value.to_lowercase()
    } else {
        value
    }
}

#[cfg(test)]
mod tests {
    #![allow(clippy::expect_used)]

    use super::*;
    use std::fs;
    use tempfile::tempdir;

    fn file(relative_path: &str) -> TorrentFileEntry {
        TorrentFileEntry {
            id: relative_path.to_string(),
            relative_path: relative_path.to_string(),
            size_bytes: 1,
        }
    }

    #[test]
    fn plans_nested_files_without_parent_directory_targets() {
        let dir = tempdir().expect("tempdir");
        fs::create_dir_all(dir.path().join("disc/subtitles")).expect("nested dirs");
        fs::write(dir.path().join("disc/video.mp4"), b"video").expect("video");
        fs::write(dir.path().join("disc/subtitles/en.vtt"), b"subs").expect("subs");

        let plan = build_safe_delete_plan(
            &dir.path().to_string_lossy(),
            &[file("disc/video.mp4"), file("disc/subtitles/en.vtt")],
        )
        .expect("safe delete plan");

        assert_eq!(plan.targets.len(), 2);
        assert!(plan
            .targets
            .iter()
            .all(|target| target.target_path.is_file()));
    }

    #[test]
    fn allows_duplicate_filenames_in_distinct_folders() {
        let dir = tempdir().expect("tempdir");
        fs::create_dir_all(dir.path().join("a")).expect("a");
        fs::create_dir_all(dir.path().join("b")).expect("b");
        fs::write(dir.path().join("a/readme.txt"), b"a").expect("a file");
        fs::write(dir.path().join("b/readme.txt"), b"b").expect("b file");

        let plan = build_safe_delete_plan(
            &dir.path().to_string_lossy(),
            &[file("a/readme.txt"), file("b/readme.txt")],
        )
        .expect("safe delete plan");

        assert_eq!(plan.targets.len(), 2);
    }

    #[test]
    fn rejects_dangerous_paths_before_touching_disk() {
        let dir = tempdir().expect("tempdir");

        let error = build_safe_delete_plan(&dir.path().to_string_lossy(), &[file("../secret.txt")])
            .expect_err("dangerous path rejected");

        assert!(matches!(error, SafeDeleteError::UnsafeRelativePath(_)));
    }

    #[test]
    fn skips_missing_files_without_creating_delete_targets() {
        let dir = tempdir().expect("tempdir");
        fs::write(dir.path().join("present.iso"), b"iso").expect("present");

        let plan = build_safe_delete_plan(
            &dir.path().to_string_lossy(),
            &[file("present.iso"), file("missing.iso")],
        )
        .expect("safe delete plan");

        assert_eq!(plan.targets.len(), 1);
        assert_eq!(plan.missing_files, vec!["missing.iso"]);
    }

    #[test]
    fn rejects_duplicate_targets() {
        let dir = tempdir().expect("tempdir");
        fs::write(dir.path().join("same.bin"), b"same").expect("same");

        let error = build_safe_delete_plan(
            &dir.path().to_string_lossy(),
            &[file("same.bin"), file("same.bin")],
        )
        .expect_err("duplicate target rejected");

        assert!(matches!(error, SafeDeleteError::DuplicateTarget(_)));
    }

    #[test]
    fn rejects_directory_manifest_entries() {
        let dir = tempdir().expect("tempdir");
        fs::create_dir_all(dir.path().join("folder")).expect("folder");

        let error = build_safe_delete_plan(&dir.path().to_string_lossy(), &[file("folder")])
            .expect_err("directory target rejected");

        assert!(matches!(error, SafeDeleteError::DirectoryNotAllowed(_)));
    }

    #[cfg(unix)]
    #[test]
    fn rejects_symlinks_without_following_them() {
        use std::os::unix::fs::symlink;

        let dir = tempdir().expect("tempdir");
        fs::write(dir.path().join("outside.txt"), b"outside").expect("outside");
        symlink(dir.path().join("outside.txt"), dir.path().join("shortcut")).expect("symlink");

        let error = build_safe_delete_plan(&dir.path().to_string_lossy(), &[file("shortcut")])
            .expect_err("symlink rejected");

        assert!(matches!(error, SafeDeleteError::SymlinkNotAllowed(_)));
    }

    #[test]
    #[ignore = "moves a temporary file to the real OS trash/recycle bin; run only during local OS QA"]
    fn moves_owned_files_to_os_trash_smoke() {
        let dir = tempdir().expect("tempdir");
        let relative_path = format!("lumatorrent-os-trash-smoke-{}.txt", std::process::id());
        let target_path = dir.path().join(&relative_path);
        fs::write(&target_path, b"temporary LumaTorrent trash smoke file").expect("smoke file");

        let plan = build_safe_delete_plan(&dir.path().to_string_lossy(), &[file(&relative_path)])
            .expect("safe delete plan");
        let trashed = move_plan_to_trash(&plan).expect("move to OS trash");

        assert_eq!(trashed, vec![relative_path]);
        assert!(
            !target_path.exists(),
            "file should leave its original location"
        );
    }
}
