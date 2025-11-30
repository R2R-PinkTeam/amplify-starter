//! SVG generation for paint-by-number gum wall designs

use crate::types::GumType;
use std::collections::HashMap;

/// Configuration for SVG generation
pub struct SvgConfig {
    /// Size of each cell in pixels
    pub cell_size: u32,
    /// Whether to show numbers in cells
    pub show_numbers: bool,
    /// Whether to show grid lines
    pub show_grid: bool,
    /// Font size for numbers (relative to cell size)
    pub font_size_ratio: f32,
}

impl Default for SvgConfig {
    fn default() -> Self {
        SvgConfig {
            cell_size: 20,
            show_numbers: true,
            show_grid: true,
            font_size_ratio: 0.5,
        }
    }
}

/// Generate an SVG representation of the paint-by-number grid
///
/// # Arguments
/// * `grid` - The paint-by-number grid (row-major, values are indices into legend)
/// * `legend` - Map of index (as string) to GumType
/// * `config` - SVG generation configuration
pub fn generate_svg(
    grid: &[Vec<u8>],
    legend: &HashMap<String, GumType>,
    config: &SvgConfig,
) -> String {
    if grid.is_empty() || grid[0].is_empty() {
        return r#"<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="10" y="50">No data</text></svg>"#.to_string();
    }

    let rows = grid.len();
    let cols = grid[0].len();
    let width = cols as u32 * config.cell_size;
    let height = rows as u32 * config.cell_size;
    let legend_width = 250;
    let total_width = width + legend_width;

    let font_size = (config.cell_size as f32 * config.font_size_ratio) as u32;

    let mut svg = format!(
        r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {} {}" width="{}" height="{}">"#,
        total_width, height.max(400), total_width, height.max(400)
    );

    // Add styles
    svg.push_str(r#"
<style>
    .cell { stroke: #ddd; stroke-width: 0.5; }
    .number { font-family: Arial, sans-serif; text-anchor: middle; dominant-baseline: central; fill: #333; }
    .legend-text { font-family: Arial, sans-serif; font-size: 12px; fill: #333; }
    .legend-title { font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; fill: #333; }
    .gum-circle { stroke: #999; stroke-width: 1; }
</style>
"#);

    // Draw grid cells as circles (gum pieces!)
    for (row_idx, row) in grid.iter().enumerate() {
        for (col_idx, &cell_value) in row.iter().enumerate() {
            let cx = col_idx as u32 * config.cell_size + config.cell_size / 2;
            let cy = row_idx as u32 * config.cell_size + config.cell_size / 2;
            let radius = config.cell_size / 2 - 1;

            // Get color from legend
            let color = legend
                .get(&cell_value.to_string())
                .map(|g| g.hex_color.as_str())
                .unwrap_or("#CCCCCC");

            // Draw circle (gum piece)
            svg.push_str(&format!(
                r#"<circle class="gum-circle" cx="{}" cy="{}" r="{}" fill="{}"/>"#,
                cx, cy, radius, color
            ));

            // Add number if enabled
            if config.show_numbers {
                // Determine text color based on background brightness
                let text_color = get_contrast_color(color);
                svg.push_str(&format!(
                    r#"<text class="number" x="{}" y="{}" font-size="{}" fill="{}">{}</text>"#,
                    cx, cy, font_size, text_color, cell_value
                ));
            }
        }
    }

    // Draw legend
    let legend_x = width + 20;
    svg.push_str(&format!(
        r#"<text class="legend-title" x="{}" y="25">Legend</text>"#,
        legend_x
    ));

    // Sort legend entries by index for consistent ordering
    let mut legend_entries: Vec<_> = legend.iter().collect();
    legend_entries.sort_by_key(|(k, _)| k.parse::<u8>().unwrap_or(255));

    for (i, (index, gum_type)) in legend_entries.iter().enumerate() {
        let y = 50 + i as u32 * 30;

        // Color circle
        svg.push_str(&format!(
            r##"<circle cx="{}" cy="{}" r="10" fill="{}" stroke="#666" stroke-width="1"/>"##,
            legend_x + 10, y, gum_type.hex_color
        ));

        // Index number inside circle
        let text_color = get_contrast_color(&gum_type.hex_color);
        svg.push_str(&format!(
            r#"<text class="number" x="{}" y="{}" font-size="10" fill="{}">{}</text>"#,
            legend_x + 10, y, text_color, index
        ));

        // Gum name
        svg.push_str(&format!(
            r#"<text class="legend-text" x="{}" y="{}">{}</text>"#,
            legend_x + 30, y + 4, escape_xml(&gum_type.name)
        ));
    }

    // Add summary at bottom of legend
    let summary_y = 50 + legend_entries.len() as u32 * 30 + 20;
    let total_cells = rows * cols;
    svg.push_str(&format!(
        r#"<text class="legend-text" x="{}" y="{}">Total gums: {}</text>"#,
        legend_x, summary_y, total_cells
    ));
    svg.push_str(&format!(
        r#"<text class="legend-text" x="{}" y="{}">Grid: {} x {}</text>"#,
        legend_x, summary_y + 20, cols, rows
    ));

    svg.push_str("</svg>");
    svg
}

/// Get a contrasting text color (black or white) based on background color
fn get_contrast_color(hex_color: &str) -> &'static str {
    let hex = hex_color.trim_start_matches('#');
    if hex.len() != 6 {
        return "#000000";
    }

    let r = u8::from_str_radix(&hex[0..2], 16).unwrap_or(128);
    let g = u8::from_str_radix(&hex[2..4], 16).unwrap_or(128);
    let b = u8::from_str_radix(&hex[4..6], 16).unwrap_or(128);

    // Calculate relative luminance
    let luminance = 0.299 * r as f32 + 0.587 * g as f32 + 0.114 * b as f32;

    if luminance > 150.0 {
        "#333333" // Dark text on light background
    } else {
        "#FFFFFF" // Light text on dark background
    }
}

/// Escape special XML characters
fn escape_xml(s: &str) -> String {
    s.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
        .replace('\'', "&apos;")
}

/// Generate a compact SVG suitable for embedding (no legend, smaller size)
pub fn generate_compact_svg(
    grid: &[Vec<u8>],
    legend: &HashMap<String, GumType>,
    cell_size: u32,
) -> String {
    if grid.is_empty() || grid[0].is_empty() {
        return r#"<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"></svg>"#.to_string();
    }

    let rows = grid.len();
    let cols = grid[0].len();
    let width = cols as u32 * cell_size;
    let height = rows as u32 * cell_size;

    let mut svg = format!(
        r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {} {}" width="{}" height="{}">"#,
        width, height, width, height
    );

    // Draw cells as circles
    for (row_idx, row) in grid.iter().enumerate() {
        for (col_idx, &cell_value) in row.iter().enumerate() {
            let cx = col_idx as u32 * cell_size + cell_size / 2;
            let cy = row_idx as u32 * cell_size + cell_size / 2;
            let radius = cell_size / 2 - 1;

            let color = legend
                .get(&cell_value.to_string())
                .map(|g| g.hex_color.as_str())
                .unwrap_or("#CCCCCC");

            svg.push_str(&format!(
                r#"<circle cx="{}" cy="{}" r="{}" fill="{}"/>"#,
                cx, cy, radius, color
            ));
        }
    }

    svg.push_str("</svg>");
    svg
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_legend() -> HashMap<String, GumType> {
        let mut legend = HashMap::new();
        legend.insert("1".to_string(), GumType {
            gum_id: "red".to_string(),
            name: "Red Gum".to_string(),
            hex_color: "#FF0000".to_string(),
            price_per_piece: 0.05,
            brand: None,
            flavor: None,
            is_available: true,
        });
        legend.insert("2".to_string(), GumType {
            gum_id: "blue".to_string(),
            name: "Blue Gum".to_string(),
            hex_color: "#0000FF".to_string(),
            price_per_piece: 0.05,
            brand: None,
            flavor: None,
            is_available: true,
        });
        legend
    }

    #[test]
    fn test_generate_svg() {
        let grid = vec![
            vec![1, 2, 1],
            vec![2, 1, 2],
        ];
        let legend = create_test_legend();
        let config = SvgConfig::default();

        let svg = generate_svg(&grid, &legend, &config);

        assert!(svg.starts_with("<svg"));
        assert!(svg.ends_with("</svg>"));
        assert!(svg.contains("#FF0000")); // Red color
        assert!(svg.contains("#0000FF")); // Blue color
        assert!(svg.contains("Red Gum")); // Legend text
    }

    #[test]
    fn test_generate_compact_svg() {
        let grid = vec![
            vec![1, 2],
            vec![2, 1],
        ];
        let legend = create_test_legend();

        let svg = generate_compact_svg(&grid, &legend, 10);

        assert!(svg.starts_with("<svg"));
        assert!(svg.contains("circle"));
        // Compact SVG should not have legend
        assert!(!svg.contains("Red Gum"));
    }

    #[test]
    fn test_contrast_color() {
        assert_eq!(get_contrast_color("#FFFFFF"), "#333333"); // White -> dark text
        assert_eq!(get_contrast_color("#000000"), "#FFFFFF"); // Black -> light text
        assert_eq!(get_contrast_color("#FF0000"), "#FFFFFF"); // Red -> light text
        assert_eq!(get_contrast_color("#FFFF00"), "#333333"); // Yellow -> dark text
    }

    #[test]
    fn test_empty_grid() {
        let grid: Vec<Vec<u8>> = vec![];
        let legend = HashMap::new();
        let config = SvgConfig::default();

        let svg = generate_svg(&grid, &legend, &config);
        assert!(svg.contains("No data"));
    }
}
