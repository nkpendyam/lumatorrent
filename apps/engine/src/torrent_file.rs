use crate::model::TorrentFileEntry;
use crate::safety::validate_torrent_relative_path;
use sha1::{Digest, Sha1};
use std::str;
use thiserror::Error;

#[derive(Debug, Clone)]
pub struct TorrentMetadata {
    pub name: String,
    pub info_hash: String,
    pub total_size_bytes: u64,
    pub files: Vec<TorrentFileEntry>,
    #[allow(dead_code)]
    pub private: bool,
}

#[derive(Debug, Error)]
pub enum TorrentParseError {
    #[error("torrent file is malformed")]
    Malformed,
    #[error("torrent file is missing required field: {0}")]
    MissingField(&'static str),
    #[error("torrent metadata contains invalid UTF-8")]
    InvalidUtf8,
    #[error("torrent file path is unsafe: {0}")]
    UnsafePath(String),
    #[error("torrent file size is invalid")]
    InvalidSize,
}

pub fn parse_torrent_metadata(bytes: &[u8]) -> Result<TorrentMetadata, TorrentParseError> {
    let mut parser = BencodeParser::new(bytes);
    let root = parser.parse_value()?;
    if parser.position != bytes.len() {
        return Err(TorrentParseError::Malformed);
    }

    let root_dict = root.as_dict()?;
    let info = root_dict
        .get(b"info")
        .ok_or(TorrentParseError::MissingField("info"))?;
    let info_dict = info.as_dict()?;
    let name = read_utf8(info_dict, b"name", "name")?;
    let private = info_dict
        .get(b"private")
        .and_then(|value| value.as_int().ok())
        .is_some_and(|value| value == 1);
    let info_hash = hex_sha1(&bytes[info.start..info.end]);

    let files = if let Some(files) = info_dict.get(b"files") {
        parse_multi_file_entries(&name, files)?
    } else {
        parse_single_file_entry(&name, info_dict)?
    };
    let total_size_bytes = files.iter().map(|file| file.size_bytes).sum();

    Ok(TorrentMetadata {
        name,
        info_hash,
        total_size_bytes,
        files,
        private,
    })
}

fn parse_single_file_entry(
    name: &str,
    info_dict: &BencodeDict,
) -> Result<Vec<TorrentFileEntry>, TorrentParseError> {
    let length = read_u64(info_dict, b"length", "length")?;
    validate_torrent_relative_path(name).map_err(TorrentParseError::UnsafePath)?;

    Ok(vec![TorrentFileEntry {
        id: "file-0".to_string(),
        relative_path: name.replace('\\', "/"),
        size_bytes: length,
    }])
}

fn parse_multi_file_entries(
    root_name: &str,
    files: &SpannedBencodeValue,
) -> Result<Vec<TorrentFileEntry>, TorrentParseError> {
    let file_values = files.as_list()?;
    let mut entries = Vec::with_capacity(file_values.len());

    for (index, file_value) in file_values.iter().enumerate() {
        let file_dict = file_value.as_dict()?;
        let length = read_u64(file_dict, b"length", "files.length")?;
        let path_value = file_dict
            .get(b"path")
            .ok_or(TorrentParseError::MissingField("files.path"))?;
        let segments = path_value.as_list()?;
        if segments.is_empty() {
            return Err(TorrentParseError::MissingField("files.path"));
        }

        let mut relative_path = root_name.to_string();
        for segment in segments {
            relative_path.push('/');
            relative_path.push_str(segment.as_utf8_bytes()?);
        }
        validate_torrent_relative_path(&relative_path).map_err(TorrentParseError::UnsafePath)?;

        entries.push(TorrentFileEntry {
            id: format!("file-{index}"),
            relative_path: relative_path.replace('\\', "/"),
            size_bytes: length,
        });
    }

    Ok(entries)
}

fn read_utf8(
    dict: &BencodeDict,
    key: &'static [u8],
    field: &'static str,
) -> Result<String, TorrentParseError> {
    Ok(dict
        .get(key)
        .ok_or(TorrentParseError::MissingField(field))?
        .as_utf8_bytes()?
        .to_string())
}

fn read_u64(
    dict: &BencodeDict,
    key: &'static [u8],
    field: &'static str,
) -> Result<u64, TorrentParseError> {
    let value = dict
        .get(key)
        .ok_or(TorrentParseError::MissingField(field))?
        .as_int()?;
    u64::try_from(value).map_err(|_| TorrentParseError::InvalidSize)
}

fn hex_sha1(bytes: &[u8]) -> String {
    let digest = Sha1::digest(bytes);
    digest.iter().map(|byte| format!("{byte:02x}")).collect()
}

#[derive(Debug, Clone)]
struct SpannedBencodeValue {
    value: BencodeValue,
    start: usize,
    end: usize,
}

#[derive(Debug, Clone)]
enum BencodeValue {
    Int(i64),
    Bytes(Vec<u8>),
    List(Vec<SpannedBencodeValue>),
    Dict(BencodeDict),
}

#[derive(Debug, Clone)]
struct BencodeDict(Vec<(Vec<u8>, SpannedBencodeValue)>);

impl BencodeDict {
    fn get(&self, key: &[u8]) -> Option<&SpannedBencodeValue> {
        self.0
            .iter()
            .find_map(|(candidate, value)| (candidate == key).then_some(value))
    }
}

impl SpannedBencodeValue {
    fn as_dict(&self) -> Result<&BencodeDict, TorrentParseError> {
        match &self.value {
            BencodeValue::Dict(value) => Ok(value),
            _ => Err(TorrentParseError::Malformed),
        }
    }

    fn as_list(&self) -> Result<&[SpannedBencodeValue], TorrentParseError> {
        match &self.value {
            BencodeValue::List(value) => Ok(value),
            _ => Err(TorrentParseError::Malformed),
        }
    }

    fn as_int(&self) -> Result<i64, TorrentParseError> {
        match self.value {
            BencodeValue::Int(value) => Ok(value),
            _ => Err(TorrentParseError::Malformed),
        }
    }

    fn as_utf8_bytes(&self) -> Result<&str, TorrentParseError> {
        match &self.value {
            BencodeValue::Bytes(value) => {
                str::from_utf8(value).map_err(|_| TorrentParseError::InvalidUtf8)
            }
            _ => Err(TorrentParseError::Malformed),
        }
    }
}

struct BencodeParser<'a> {
    bytes: &'a [u8],
    position: usize,
}

impl<'a> BencodeParser<'a> {
    fn new(bytes: &'a [u8]) -> Self {
        Self { bytes, position: 0 }
    }

    fn parse_value(&mut self) -> Result<SpannedBencodeValue, TorrentParseError> {
        let start = self.position;
        let value = match self.peek().ok_or(TorrentParseError::Malformed)? {
            b'i' => self.parse_int()?,
            b'l' => self.parse_list()?,
            b'd' => self.parse_dict()?,
            b'0'..=b'9' => self.parse_bytes()?,
            _ => return Err(TorrentParseError::Malformed),
        };
        Ok(SpannedBencodeValue {
            value,
            start,
            end: self.position,
        })
    }

    fn parse_int(&mut self) -> Result<BencodeValue, TorrentParseError> {
        self.expect(b'i')?;
        let start = self.position;
        while self.peek().is_some_and(|value| value != b'e') {
            self.position += 1;
        }
        let end = self.position;
        self.expect(b'e')?;
        let value = str::from_utf8(&self.bytes[start..end])
            .map_err(|_| TorrentParseError::Malformed)?
            .parse::<i64>()
            .map_err(|_| TorrentParseError::Malformed)?;
        Ok(BencodeValue::Int(value))
    }

    fn parse_list(&mut self) -> Result<BencodeValue, TorrentParseError> {
        self.expect(b'l')?;
        let mut values = Vec::new();
        while self.peek().is_some_and(|value| value != b'e') {
            values.push(self.parse_value()?);
        }
        self.expect(b'e')?;
        Ok(BencodeValue::List(values))
    }

    fn parse_dict(&mut self) -> Result<BencodeValue, TorrentParseError> {
        self.expect(b'd')?;
        let mut values = Vec::new();
        while self.peek().is_some_and(|value| value != b'e') {
            let key = match self.parse_bytes()? {
                BencodeValue::Bytes(value) => value,
                _ => return Err(TorrentParseError::Malformed),
            };
            values.push((key, self.parse_value()?));
        }
        self.expect(b'e')?;
        Ok(BencodeValue::Dict(BencodeDict(values)))
    }

    fn parse_bytes(&mut self) -> Result<BencodeValue, TorrentParseError> {
        let length_start = self.position;
        while self.peek().is_some_and(|value| value.is_ascii_digit()) {
            self.position += 1;
        }
        if self.position == length_start {
            return Err(TorrentParseError::Malformed);
        }
        self.expect(b':')?;
        let length = str::from_utf8(&self.bytes[length_start..self.position - 1])
            .map_err(|_| TorrentParseError::Malformed)?
            .parse::<usize>()
            .map_err(|_| TorrentParseError::Malformed)?;
        let end = self
            .position
            .checked_add(length)
            .filter(|end| *end <= self.bytes.len())
            .ok_or(TorrentParseError::Malformed)?;
        let value = self.bytes[self.position..end].to_vec();
        self.position = end;
        Ok(BencodeValue::Bytes(value))
    }

    fn expect(&mut self, value: u8) -> Result<(), TorrentParseError> {
        if self.peek() != Some(value) {
            return Err(TorrentParseError::Malformed);
        }
        self.position += 1;
        Ok(())
    }

    fn peek(&self) -> Option<u8> {
        self.bytes.get(self.position).copied()
    }
}

#[cfg(test)]
mod tests {
    #![allow(clippy::expect_used)]

    use super::*;

    #[test]
    fn parses_single_file_torrent_metadata() {
        let metadata = parse_torrent_metadata(
            b"d8:announce14:http://tracker4:infod6:lengthi123e4:name9:legal.iso7:privatei1eee",
        )
        .expect("torrent metadata");

        assert_eq!(metadata.name, "legal.iso");
        assert_eq!(metadata.total_size_bytes, 123);
        assert_eq!(metadata.files[0].relative_path, "legal.iso");
        assert!(metadata.private);
        assert_eq!(metadata.info_hash.len(), 40);
    }

    #[test]
    fn parses_multi_file_torrent_metadata() {
        let metadata = parse_torrent_metadata(
            b"d4:infod5:filesld6:lengthi10e4:pathl8:disc.isoeed6:lengthi5e4:pathl4:docs10:readme.txteee4:name7:releaseee",
        )
        .expect("torrent metadata");

        assert_eq!(metadata.name, "release");
        assert_eq!(metadata.total_size_bytes, 15);
        assert_eq!(metadata.files[0].relative_path, "release/disc.iso");
        assert_eq!(metadata.files[1].relative_path, "release/docs/readme.txt");
        assert!(!metadata.private);
    }

    #[test]
    fn rejects_unsafe_torrent_file_paths() {
        let error = parse_torrent_metadata(b"d4:infod6:lengthi1e4:name10:../bad.txtee")
            .expect_err("unsafe path");

        assert!(matches!(error, TorrentParseError::UnsafePath(_)));
    }
}
