//! GPT-4o-mini Vision API integration

use anyhow::{anyhow, Context, Result};
use crate::types::{ImageUrl, VisionContent, VisionMessage, VisionRequest, VisionResponse};

const OPENAI_API_URL: &str = "https://api.openai.com/v1/chat/completions";
const VISION_MODEL: &str = "gpt-4o-mini";

/// Analyze an image using GPT-4o-mini vision capabilities
///
/// Returns a description of the image suitable for gum wall art conversion
pub async fn analyze_image(
    image_base64: &str,
    mime_type: &str,
) -> Result<String> {
    let api_key = std::env::var("OPENAI_API_KEY")
        .map_err(|_| anyhow!("OPENAI_API_KEY environment variable is not set"))?;

    let prompt = r#"Analyze this image for a gum wall art project. The image will be converted into a paint-by-number style mosaic made of colored chewing gum pieces.

Please describe:
1. The main subject or scene in the image (1-2 sentences)
2. The dominant colors that would work well with available gum colors (pink, red, yellow, green, blue, white, purple, orange)
3. Key visual elements that should be preserved in a low-resolution pixel art version

Keep your response concise (under 100 words) and focus on what would translate well to a gum mosaic."#;

    let data_url = format!("data:{};base64,{}", mime_type, image_base64);

    let request = VisionRequest {
        model: VISION_MODEL.to_string(),
        messages: vec![VisionMessage {
            role: "user".to_string(),
            content: vec![
                VisionContent::Text { text: prompt.to_string() },
                VisionContent::ImageUrl {
                    image_url: ImageUrl { url: data_url },
                },
            ],
        }],
        max_tokens: 300,
    };

    let client = reqwest::Client::new();
    let response = client
        .post(OPENAI_API_URL)
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .json(&request)
        .send()
        .await
        .context("Failed to send request to OpenAI API")?;

    if !response.status().is_success() {
        let status = response.status();
        let error_body = response.text().await.unwrap_or_default();
        return Err(anyhow!(
            "OpenAI API error ({}): {}",
            status,
            error_body
        ));
    }

    let vision_response: VisionResponse = response
        .json()
        .await
        .context("Failed to parse OpenAI API response")?;

    vision_response
        .choices
        .first()
        .map(|c| c.message.content.clone())
        .ok_or_else(|| anyhow!("No response from vision model"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_vision_request_serialization() {
        let request = VisionRequest {
            model: "gpt-4o-mini".to_string(),
            messages: vec![VisionMessage {
                role: "user".to_string(),
                content: vec![
                    VisionContent::Text { text: "Describe this image".to_string() },
                    VisionContent::ImageUrl {
                        image_url: ImageUrl {
                            url: "data:image/jpeg;base64,/9j/4AAQ...".to_string(),
                        },
                    },
                ],
            }],
            max_tokens: 300,
        };

        let json = serde_json::to_string(&request).unwrap();
        assert!(json.contains("gpt-4o-mini"));
        assert!(json.contains("image_url"));
    }
}
