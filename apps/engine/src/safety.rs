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
    let trimmed = path.trim();
    if trimmed.is_empty() {
        return Err("file path is empty".to_string());
    }
    if path != trimmed {
        return Err("file path cannot start or end with whitespace".to_string());
    }
    if trimmed.contains('\0') {
        return Err("file path contains a null byte".to_string());
    }
    let normalized = trimmed.replace('\\', "/");
    if normalized.starts_with('/') || has_windows_drive_prefix(&normalized) {
        return Err("absolute paths are not allowed".to_string());
    }
    if normalized.len() > 1024 {
        return Err("file path is too long".to_string());
    }

    for part in normalized.split('/') {
        if part.is_empty() || part == "." {
            return Err("empty path segment is not allowed".to_string());
        }
        if part == ".." {
            return Err("parent traversal is not allowed".to_string());
        }
        if part.ends_with(' ') || part.ends_with('.') {
            return Err("file path segment cannot end with a space or dot".to_string());
        }
        if part.contains(':') {
            return Err("file path segment cannot contain a colon".to_string());
        }
        if part.len() > 240 {
            return Err("file path segment is too long".to_string());
        }

        let base = part.split('.').next().unwrap_or("").to_ascii_uppercase();
        if is_windows_reserved_name(&base) {
            return Err(format!("reserved Windows filename detected: {base}"));
        }
    }

    Ok(())
}

fn has_windows_drive_prefix(path: &str) -> bool {
    let bytes = path.as_bytes();
    bytes.len() >= 3 && bytes[0].is_ascii_alphabetic() && bytes[1] == b':' && bytes[2] == b'/'
}

fn is_windows_reserved_name(name: &str) -> bool {
    matches!(
        name,
        "CON"
            | "PRN"
            | "AUX"
            | "NUL"
            | "COM1"
            | "COM2"
            | "COM3"
            | "COM4"
            | "COM5"
            | "COM6"
            | "COM7"
            | "COM8"
            | "COM9"
            | "LPT1"
            | "LPT2"
            | "LPT3"
            | "LPT4"
            | "LPT5"
            | "LPT6"
            | "LPT7"
            | "LPT8"
            | "LPT9"
    )
}

#[cfg(test)]
mod tests {
    #![allow(clippy::expect_used)]

    use super::*;
    use serde::Deserialize;

    #[derive(Deserialize)]
    #[serde(rename_all = "camelCase")]
    struct PathSafetyCases {
        valid: Vec<String>,
        invalid: Vec<String>,
    }

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

    #[test]
    fn accepts_valid_path_safety_fixtures() {
        let cases = path_safety_cases();

        for fixture in cases.valid {
            assert!(
                validate_torrent_relative_path(&fixture).is_ok(),
                "expected fixture to be accepted: {fixture}"
            );
        }
    }

    #[test]
    fn rejects_malicious_path_safety_fixtures() {
        let cases = path_safety_cases();

        for fixture in cases.invalid {
            assert!(
                validate_torrent_relative_path(&fixture).is_err(),
                "expected fixture to be rejected: {fixture}"
            );
        }
    }

    fn path_safety_cases() -> PathSafetyCases {
        serde_json::from_str(include_str!(
            "../../../tests/fixtures/path-safety-cases.json"
        ))
        .expect("path safety fixture JSON")
    }
}
