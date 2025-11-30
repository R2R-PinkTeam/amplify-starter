//! Gum Wall Calculator MCP Server Core
//!
//! This MCP server helps you plan a gum wall art installation by:
//! - Analyzing images and converting them to paint-by-number gum designs
//! - Calculating the cost of gum needed based on current prices
//! - Generating SVG visualizations of the design

mod graphql;
mod quantize;
mod s3;
mod svg;
mod types;
mod vision;

use pmcp::types::capabilities::ServerCapabilities;
use pmcp::{Server, TypedTool};
use serde_json::json;
use std::collections::HashMap;
use validator::Validate;

pub use types::*;

/// Build the Gum Wall Calculator MCP server
pub fn build_gum_wall_calculator_server() -> pmcp::Result<Server> {
    Server::builder()
        .name("gum-wall-calculator")
        .version("1.0.0")
        .capabilities(ServerCapabilities::tools_only())
        // Tool: Analyze an image and create a paint-by-number gum design
        .tool(
            "analyze_image_for_gum_wall",
            TypedTool::new(
                "analyze_image_for_gum_wall",
                |input: AnalyzeImageInput, _extra| {
                    Box::pin(async move {
                        // Log the input for debugging
                        tracing::info!(
                            "analyze_image_for_gum_wall called with: s3_uri='{}', wall_width_cm={}, wall_height_cm={}, gum_diameter_cm={}",
                            input.s3_uri,
                            input.wall_width_cm,
                            input.wall_height_cm,
                            input.gum_diameter_cm
                        );

                        // Validate input
                        input.validate().map_err(|e| {
                            pmcp::Error::validation(format!("Validation failed: {}", e))
                        })?;

                        // Parse S3 URI
                        let (bucket, key) = s3::parse_s3_uri(&input.s3_uri).map_err(|e| {
                            pmcp::Error::validation(format!("Invalid S3 URI: {}", e))
                        })?;

                        // Create S3 client
                        let s3_client = s3::create_s3_client().await.map_err(|e| {
                            pmcp::Error::internal(format!("Failed to create S3 client: {}", e))
                        })?;

                        // Fetch image from S3
                        let (image_bytes, content_type) =
                            s3::fetch_image_from_s3(&s3_client, &bucket, &key)
                                .await
                                .map_err(|e| {
                                    pmcp::Error::internal(format!(
                                        "Failed to fetch image from S3: {}",
                                        e
                                    ))
                                })?;

                        let mime_type = s3::get_mime_type(&key, &content_type);

                        // Encode image as base64 for vision API
                        let image_base64 = base64::Engine::encode(
                            &base64::engine::general_purpose::STANDARD,
                            &image_bytes,
                        );

                        // Analyze image with GPT-4o-mini vision
                        let image_description =
                            vision::analyze_image(&image_base64, &mime_type)
                                .await
                                .unwrap_or_else(|e| {
                                    format!("Could not analyze image: {}", e)
                                });

                        // Load image for processing
                        let image = quantize::load_image_from_bytes(&image_bytes).map_err(|e| {
                            pmcp::Error::internal(format!("Failed to load image: {}", e))
                        })?;

                        // Calculate grid dimensions
                        let grid_cols = (input.wall_width_cm / input.gum_diameter_cm).floor() as u32;
                        let grid_rows =
                            (input.wall_height_cm / input.gum_diameter_cm).floor() as u32;

                        // Fetch gum types from AppSync (with fallback)
                        let gum_types = graphql::fetch_gum_types_with_fallback().await;

                        // Quantize image to gum colors
                        let quantization_result =
                            quantize::quantize_image(&image, &gum_types, grid_cols, grid_rows);

                        // Generate SVG
                        let svg_config = svg::SvgConfig {
                            cell_size: 15,
                            show_numbers: true,
                            show_grid: true,
                            font_size_ratio: 0.4,
                        };
                        let svg_output =
                            svg::generate_svg(&quantization_result.grid, &quantization_result.legend, &svg_config);

                        // Build output
                        let total_gums: u32 = quantization_result.gum_counts.values().sum();

                        // Run-length encode the grid for compression
                        let grid_rle = types::rle_encode_grid(&quantization_result.grid);

                        let output = AnalyzeImageOutput {
                            grid_rle,
                            legend: quantization_result.legend,
                            dimensions: GridDimensions {
                                rows: quantization_result.rows,
                                cols: quantization_result.cols,
                                total_positions: quantization_result.rows
                                    * quantization_result.cols,
                            },
                            gum_counts: quantization_result.gum_counts,
                            total_gums,
                            image_description,
                            svg: svg_output,
                        };

                        Ok(serde_json::to_value(output).unwrap())
                    })
                },
            )
            .with_description(
                "Analyze an image from S3 and create a paint-by-number gum wall design. \
                Returns a grid of gum colors, SVG visualization, and counts of each gum type needed.",
            ),
        )
        // Tool: Calculate cost based on gum counts
        .tool(
            "calculate_gum_cost",
            TypedTool::new("calculate_gum_cost", |input: CalculateCostInput, _extra| {
                Box::pin(async move {
                    // Fetch gum types for pricing
                    let gum_types = graphql::fetch_gum_types_with_fallback().await;
                    let gum_map: HashMap<String, GumType> =
                        gum_types.into_iter().map(|g| (g.gum_id.clone(), g)).collect();

                    let mut breakdown: Vec<CostBreakdownItem> = Vec::new();
                    let mut total_pieces: u32 = 0;
                    let mut total_cost: f64 = 0.0;

                    for (gum_id, count) in &input.gum_counts {
                        if let Some(gum_type) = gum_map.get(gum_id) {
                            let subtotal = gum_type.price_per_piece * (*count as f64);
                            breakdown.push(CostBreakdownItem {
                                gum_id: gum_id.clone(),
                                name: gum_type.name.clone(),
                                hex_color: gum_type.hex_color.clone(),
                                count: *count,
                                unit_price: gum_type.price_per_piece,
                                subtotal,
                            });
                            total_pieces += count;
                            total_cost += subtotal;
                        } else {
                            // Unknown gum type - use default price
                            let default_price = 0.08;
                            let subtotal = default_price * (*count as f64);
                            breakdown.push(CostBreakdownItem {
                                gum_id: gum_id.clone(),
                                name: format!("Unknown ({})", gum_id),
                                hex_color: "#CCCCCC".to_string(),
                                count: *count,
                                unit_price: default_price,
                                subtotal,
                            });
                            total_pieces += count;
                            total_cost += subtotal;
                        }
                    }

                    // Sort by count (descending)
                    breakdown.sort_by(|a, b| b.count.cmp(&a.count));

                    // Calculate fun stats
                    let fun_stats = FunStats {
                        chewing_time_hours: (total_pieces as f64 * 5.0) / 60.0, // 5 min per piece
                        calories_burned: (total_pieces as f64 * 11.0) as u32, // ~11 cal per hour of chewing, assume 1 piece = 1 hour equivalent
                        packs_needed: (total_pieces as f64 / 5.0).ceil() as u32, // 5 pieces per pack
                        weight_kg: (total_pieces as f64 * 3.0) / 1000.0, // 3g per piece
                    };

                    let output = CalculateCostOutput {
                        breakdown,
                        total_pieces,
                        total_cost: (total_cost * 100.0).round() / 100.0, // Round to cents
                        currency: "USD".to_string(),
                        fun_stats,
                    };

                    Ok(serde_json::to_value(output).unwrap())
                })
            })
            .with_description(
                "Calculate the total cost of gum needed for a gum wall project. \
                Takes a map of gum type IDs to counts and returns a detailed cost breakdown with fun statistics.",
            ),
        )
        // Tool: Get available gum types
        .tool(
            "list_gum_types",
            TypedTool::new("list_gum_types", |_input: EmptyInput, _extra| {
                Box::pin(async move {
                    let gum_types = graphql::fetch_gum_types_with_fallback().await;

                    Ok(json!({
                        "gum_types": gum_types,
                        "count": gum_types.len(),
                        "source": if std::env::var("APPSYNC_API_URL").is_ok() {
                            "appsync"
                        } else {
                            "fallback"
                        }
                    }))
                })
            })
            .with_description(
                "List all available gum types with their colors and prices. \
                Returns gum types from DynamoDB via AppSync, or fallback data if unavailable.",
            ),
        )
        .build()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_server_builds() {
        let server = build_gum_wall_calculator_server();
        assert!(server.is_ok());
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
    fn test_cost_calculation_types() {
        let mut counts = HashMap::new();
        counts.insert("dubble_bubble_pink".to_string(), 100);
        counts.insert("juicy_fruit_yellow".to_string(), 50);

        let input = CalculateCostInput { gum_counts: counts };

        // Just verify the types compile correctly
        assert_eq!(input.gum_counts.len(), 2);
    }
}
