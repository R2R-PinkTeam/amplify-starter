//! Type definitions for the Gum Wall Calculator MCP Server

use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use validator::Validate;

/// Default gum diameter in centimeters
fn default_gum_diameter() -> f64 {
    2.0
}

// ============================================================================
// Gum Type (from DynamoDB via GraphQL)
// ============================================================================

/// A type of gum with its color and price
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct GumType {
    /// Unique identifier (e.g., "dubble_bubble_pink")
    pub gum_id: String,
    /// Display name (e.g., "Dubble Bubble Original")
    pub name: String,
    /// Hex color code (e.g., "#FF69B4")
    pub hex_color: String,
    /// Price per piece in USD
    pub price_per_piece: f64,
    /// Brand name
    #[serde(skip_serializing_if = "Option::is_none")]
    pub brand: Option<String>,
    /// Flavor description
    #[serde(skip_serializing_if = "Option::is_none")]
    pub flavor: Option<String>,
    /// Whether this gum type is available for purchase
    #[serde(default = "default_true")]
    pub is_available: bool,
}

fn default_true() -> bool {
    true
}

/// RGB color representation
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Rgb {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

impl GumType {
    /// Parse hex color to RGB
    pub fn to_rgb(&self) -> Option<Rgb> {
        let hex = self.hex_color.trim_start_matches('#');
        if hex.len() != 6 {
            return None;
        }
        let r = u8::from_str_radix(&hex[0..2], 16).ok()?;
        let g = u8::from_str_radix(&hex[2..4], 16).ok()?;
        let b = u8::from_str_radix(&hex[4..6], 16).ok()?;
        Some(Rgb { r, g, b })
    }
}

// ============================================================================
// Analyze Image Tool
// ============================================================================

/// Input for the analyze_image_for_gum_wall tool
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema, Validate)]
#[schemars(deny_unknown_fields)]
pub struct AnalyzeImageInput {
    /// S3 URI to the image (e.g., "s3://bucket/path/to/image.jpg")
    #[schemars(description = "S3 URI to the image (format: s3://bucket/key)")]
    pub s3_uri: String,

    /// Wall width in centimeters
    #[validate(range(min = 10.0, max = 10000.0))]
    #[schemars(description = "Wall width in centimeters (10-10000)")]
    pub wall_width_cm: f64,

    /// Wall height in centimeters
    #[validate(range(min = 10.0, max = 10000.0))]
    #[schemars(description = "Wall height in centimeters (10-10000)")]
    pub wall_height_cm: f64,

    /// Gum diameter in centimeters (default: 2.0)
    #[validate(range(min = 0.5, max = 5.0))]
    #[schemars(description = "Diameter of each gum piece in centimeters (0.5-5.0, default: 2.0)")]
    #[serde(default = "default_gum_diameter")]
    pub gum_diameter_cm: f64,
}

/// Grid dimensions
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct GridDimensions {
    /// Number of rows (gums vertically)
    pub rows: u32,
    /// Number of columns (gums horizontally)
    pub cols: u32,
    /// Total number of gum positions
    pub total_positions: u32,
}

/// Encode a row of color indices using run-length encoding
/// Returns pairs of [count, color_index]
pub fn rle_encode_row(row: &[u8]) -> Vec<[u32; 2]> {
    if row.is_empty() {
        return Vec::new();
    }

    let mut result = Vec::new();
    let mut current_color = row[0];
    let mut count: u32 = 1;

    for &color in row.iter().skip(1) {
        if color == current_color {
            count += 1;
        } else {
            result.push([count, current_color as u32]);
            current_color = color;
            count = 1;
        }
    }
    result.push([count, current_color as u32]);

    result
}

/// Encode an entire grid using run-length encoding
pub fn rle_encode_grid(grid: &[Vec<u8>]) -> Vec<Vec<[u32; 2]>> {
    grid.iter().map(|row| rle_encode_row(row)).collect()
}

/// Output from the analyze_image_for_gum_wall tool
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct AnalyzeImageOutput {
    /// RLE grid: each row is [[count, color_index], ...]. Use legend to map color_index to gum type.
    pub grid_rle: Vec<Vec<[u32; 2]>>,
    /// Legend mapping color indices to gum types
    pub legend: HashMap<String, GumType>,
    /// Grid dimensions
    pub dimensions: GridDimensions,
    /// Count of each gum type needed
    pub gum_counts: HashMap<String, u32>,
    /// Total number of gums needed
    pub total_gums: u32,
    /// Description of the image from vision model
    pub image_description: String,
    /// SVG representation of the paint-by-number design
    pub svg: String,
}

// ============================================================================
// Calculate Cost Tool
// ============================================================================

/// Empty input for tools that don't require parameters
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema, Default)]
#[schemars(deny_unknown_fields)]
pub struct EmptyInput {}

/// Input for the calculate_gum_cost tool
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema, Validate)]
#[schemars(deny_unknown_fields)]
pub struct CalculateCostInput {
    /// Map of gum_id to count needed
    #[schemars(description = "Map of gum type ID to count needed (e.g., {\"dubble_bubble_pink\": 500})")]
    pub gum_counts: HashMap<String, u32>,
}

/// Cost breakdown for a single gum type
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct CostBreakdownItem {
    /// Gum type ID
    pub gum_id: String,
    /// Display name
    pub name: String,
    /// Hex color
    pub hex_color: String,
    /// Number of pieces needed
    pub count: u32,
    /// Price per piece
    pub unit_price: f64,
    /// Subtotal for this gum type
    pub subtotal: f64,
}

/// Output from the calculate_gum_cost tool
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct CalculateCostOutput {
    /// Detailed breakdown by gum type
    pub breakdown: Vec<CostBreakdownItem>,
    /// Total number of gum pieces
    pub total_pieces: u32,
    /// Total cost in USD
    pub total_cost: f64,
    /// Currency code
    pub currency: String,
    /// Fun statistics
    pub fun_stats: FunStats,
}

/// Fun statistics about the gum wall project
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct FunStats {
    /// Estimated chewing time in hours (assuming 5 minutes per piece)
    pub chewing_time_hours: f64,
    /// Estimated calories burned chewing
    pub calories_burned: u32,
    /// Number of packs needed (assuming 5 pieces per pack)
    pub packs_needed: u32,
    /// Weight of gum in kilograms (assuming 3g per piece)
    pub weight_kg: f64,
}

// ============================================================================
// GraphQL Response Types
// ============================================================================

/// GraphQL response wrapper for listGumTypes query
#[derive(Debug, Deserialize)]
pub struct GraphQLResponse<T> {
    pub data: Option<T>,
    pub errors: Option<Vec<GraphQLError>>,
}

#[derive(Debug, Deserialize)]
pub struct GraphQLError {
    pub message: String,
}

#[derive(Debug, Deserialize)]
pub struct ListGumTypesData {
    #[serde(rename = "listGumTypes")]
    pub list_gum_types: ListGumTypesResult,
}

#[derive(Debug, Deserialize)]
pub struct ListGumTypesResult {
    pub items: Vec<GumTypeRecord>,
}

/// DynamoDB record from AppSync (matches Amplify schema field names)
#[derive(Debug, Deserialize)]
pub struct GumTypeRecord {
    pub id: String,
    #[serde(rename = "gumId")]
    pub gum_id: String,
    pub name: String,
    #[serde(rename = "hexColor")]
    pub hex_color: String,
    #[serde(rename = "pricePerPiece")]
    pub price_per_piece: f64,
    pub brand: Option<String>,
    pub flavor: Option<String>,
    #[serde(rename = "isAvailable", default = "default_true")]
    pub is_available: bool,
}

impl From<GumTypeRecord> for GumType {
    fn from(record: GumTypeRecord) -> Self {
        GumType {
            gum_id: record.gum_id,
            name: record.name,
            hex_color: record.hex_color,
            price_per_piece: record.price_per_piece,
            brand: record.brand,
            flavor: record.flavor,
            is_available: record.is_available,
        }
    }
}

// ============================================================================
// Vision API Types
// ============================================================================

/// OpenAI Vision API request
#[derive(Debug, Serialize)]
pub struct VisionRequest {
    pub model: String,
    pub messages: Vec<VisionMessage>,
    pub max_tokens: u32,
}

#[derive(Debug, Serialize)]
pub struct VisionMessage {
    pub role: String,
    pub content: Vec<VisionContent>,
}

#[derive(Debug, Serialize)]
#[serde(tag = "type")]
pub enum VisionContent {
    #[serde(rename = "text")]
    Text { text: String },
    #[serde(rename = "image_url")]
    ImageUrl { image_url: ImageUrl },
}

#[derive(Debug, Serialize)]
pub struct ImageUrl {
    pub url: String,
}

/// OpenAI Vision API response
#[derive(Debug, Deserialize)]
pub struct VisionResponse {
    pub choices: Vec<VisionChoice>,
}

#[derive(Debug, Deserialize)]
pub struct VisionChoice {
    pub message: VisionResponseMessage,
}

#[derive(Debug, Deserialize)]
pub struct VisionResponseMessage {
    pub content: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_hex_to_rgb() {
        let gum = GumType {
            gum_id: "test".to_string(),
            name: "Test".to_string(),
            hex_color: "#FF69B4".to_string(),
            price_per_piece: 0.05,
            brand: None,
            flavor: None,
            is_available: true,
        };
        let rgb = gum.to_rgb().unwrap();
        assert_eq!(rgb.r, 255);
        assert_eq!(rgb.g, 105);
        assert_eq!(rgb.b, 180);
    }

    #[test]
    fn test_analyze_input_validation() {
        let input = AnalyzeImageInput {
            s3_uri: "s3://bucket/key.jpg".to_string(),
            wall_width_cm: 200.0,
            wall_height_cm: 150.0,
            gum_diameter_cm: 2.0,
        };
        assert!(input.validate().is_ok());
    }

    #[test]
    fn test_invalid_wall_dimensions() {
        let input = AnalyzeImageInput {
            s3_uri: "s3://bucket/key.jpg".to_string(),
            wall_width_cm: 5.0, // Too small
            wall_height_cm: 150.0,
            gum_diameter_cm: 2.0,
        };
        assert!(input.validate().is_err());
    }
}
