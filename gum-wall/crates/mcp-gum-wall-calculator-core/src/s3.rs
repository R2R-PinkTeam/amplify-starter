//! S3 image fetching utilities

use anyhow::{anyhow, Context, Result};
use aws_sdk_s3::Client as S3Client;

/// Parse an S3 URI into bucket and key components
///
/// # Examples
/// ```ignore
/// let (bucket, key) = parse_s3_uri("s3://my-bucket/path/to/image.jpg")?;
/// assert_eq!(bucket, "my-bucket");
/// assert_eq!(key, "path/to/image.jpg");
/// ```
pub fn parse_s3_uri(uri: &str) -> Result<(String, String)> {
    let uri = uri.trim();

    if !uri.starts_with("s3://") {
        return Err(anyhow!("Invalid S3 URI: must start with 's3://'"));
    }

    let path = &uri[5..]; // Remove "s3://"
    let parts: Vec<&str> = path.splitn(2, '/').collect();

    if parts.len() != 2 || parts[0].is_empty() || parts[1].is_empty() {
        return Err(anyhow!("Invalid S3 URI format. Expected: s3://bucket/key"));
    }

    Ok((parts[0].to_string(), parts[1].to_string()))
}

/// Fetch an image from S3 and return its bytes along with content type
pub async fn fetch_image_from_s3(
    client: &S3Client,
    bucket: &str,
    key: &str,
) -> Result<(Vec<u8>, String)> {
    tracing::info!("Fetching S3 object: bucket='{}', key='{}'", bucket, key);

    let response = client
        .get_object()
        .bucket(bucket)
        .key(key)
        .send()
        .await
        .map_err(|e| {
            tracing::error!("S3 GetObject failed: {:?}", e);
            anyhow!("S3 GetObject failed for s3://{}/{}: {}", bucket, key, e)
        })?;

    let content_type = response
        .content_type()
        .unwrap_or("image/jpeg")
        .to_string();

    let bytes = response
        .body
        .collect()
        .await
        .context("Failed to read S3 object body")?
        .into_bytes()
        .to_vec();

    Ok((bytes, content_type))
}

/// Determine MIME type from file extension or content type
pub fn get_mime_type(key: &str, content_type: &str) -> String {
    // If content type is specific, use it
    if content_type != "application/octet-stream" && content_type.starts_with("image/") {
        return content_type.to_string();
    }

    // Otherwise, infer from extension
    let extension = key.rsplit('.').next().unwrap_or("").to_lowercase();
    match extension.as_str() {
        "jpg" | "jpeg" => "image/jpeg".to_string(),
        "png" => "image/png".to_string(),
        "gif" => "image/gif".to_string(),
        "webp" => "image/webp".to_string(),
        "bmp" => "image/bmp".to_string(),
        _ => "image/jpeg".to_string(), // Default to JPEG
    }
}

/// Create an S3 client with default configuration
pub async fn create_s3_client() -> Result<S3Client> {
    let config = aws_config::load_defaults(aws_config::BehaviorVersion::latest()).await;
    Ok(S3Client::new(&config))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_s3_uri_valid() {
        let (bucket, key) = parse_s3_uri("s3://my-bucket/path/to/image.jpg").unwrap();
        assert_eq!(bucket, "my-bucket");
        assert_eq!(key, "path/to/image.jpg");
    }

    #[test]
    fn test_parse_s3_uri_simple_key() {
        let (bucket, key) = parse_s3_uri("s3://bucket/file.png").unwrap();
        assert_eq!(bucket, "bucket");
        assert_eq!(key, "file.png");
    }

    #[test]
    fn test_parse_s3_uri_invalid_scheme() {
        let result = parse_s3_uri("http://bucket/key");
        assert!(result.is_err());
    }

    #[test]
    fn test_parse_s3_uri_no_key() {
        let result = parse_s3_uri("s3://bucket/");
        assert!(result.is_err());
    }

    #[test]
    fn test_get_mime_type_from_extension() {
        assert_eq!(get_mime_type("image.png", "application/octet-stream"), "image/png");
        assert_eq!(get_mime_type("photo.jpg", "application/octet-stream"), "image/jpeg");
        assert_eq!(get_mime_type("photo.JPEG", "application/octet-stream"), "image/jpeg");
    }

    #[test]
    fn test_get_mime_type_from_content_type() {
        assert_eq!(get_mime_type("file", "image/webp"), "image/webp");
    }
}
