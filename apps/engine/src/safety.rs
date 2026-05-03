use std::path::{Component, Path};

pub fn validate_download_root(path: &str) -> Result<(), String> {
    let trimmed = path.trim();
    if trimmed.is_empty() {
        return Err("download path is empty".to_string());
    }
    if trimmed.contains('\0') {
        return Err("download path contains a null byte".to_string());
    }
    Ok(())
}

pub fn validate_torrent_relative_path(path: &str) -> Result<(), String> {
    if path.trim().is_empty() {
        return Err("file path is empty".to_string());
    }
    if path.contains('\0') {
        return Err("file path contains a null byte".to_string());
    }
    let p = Path::new(path);
    if p.is_absolute() {
        return Err("absolute paths are not allowed".to_string());
    }
    for component in p.components() {
        match component {
            Component::ParentDir => return Err("parent traversal is not allowed".to_string()),
            Component::RootDir | Component::Prefix(_) => {
                return Err("root/prefix paths are not allowed".to_string())
            }
            _ => {}
        }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rejects_parent_traversal() {
        assert!(validate_torrent_relative_path("../secret.txt").is_err());
    }

    #[test]
    fn rejects_absolute_paths() {
        assert!(validate_torrent_relative_path("/etc/passwd").is_err());
    }

    #[test]
    fn accepts_normal_relative_paths() {
        assert!(validate_torrent_relative_path("folder/file.txt").is_ok());
    }
}
