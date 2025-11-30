//! Color quantization - mapping image pixels to available gum colors

use crate::types::{GumType, Rgb};
use image::{DynamicImage, GenericImageView, imageops::FilterType};
use std::collections::HashMap;

/// Calculate squared Euclidean distance between two RGB colors
/// Using squared distance avoids sqrt and is fine for comparison
fn color_distance_squared(a: Rgb, b: Rgb) -> u32 {
    let dr = a.r as i32 - b.r as i32;
    let dg = a.g as i32 - b.g as i32;
    let db = a.b as i32 - b.b as i32;
    (dr * dr + dg * dg + db * db) as u32
}

/// Find the nearest gum color for a given RGB pixel
fn find_nearest_gum<'a>(pixel: Rgb, palette: &'a [(GumType, Rgb)]) -> &'a GumType {
    palette
        .iter()
        .min_by_key(|(_, gum_rgb)| color_distance_squared(pixel, *gum_rgb))
        .map(|(gum, _)| gum)
        .expect("Palette should not be empty")
}

/// Result of quantizing an image to gum colors
pub struct QuantizationResult {
    /// Paint-by-number grid (row-major)
    pub grid: Vec<Vec<u8>>,
    /// Legend mapping index (as string) to gum type
    pub legend: HashMap<String, GumType>,
    /// Count of each gum type needed
    pub gum_counts: HashMap<String, u32>,
    /// Grid dimensions
    pub rows: u32,
    pub cols: u32,
}

/// Quantize an image to the available gum color palette
///
/// # Arguments
/// * `image` - The source image
/// * `gum_types` - Available gum colors
/// * `grid_cols` - Number of columns in the output grid (gums horizontally)
/// * `grid_rows` - Number of rows in the output grid (gums vertically)
pub fn quantize_image(
    image: &DynamicImage,
    gum_types: &[GumType],
    grid_cols: u32,
    grid_rows: u32,
) -> QuantizationResult {
    // Build palette with pre-computed RGB values
    let palette: Vec<(GumType, Rgb)> = gum_types
        .iter()
        .filter_map(|g| g.to_rgb().map(|rgb| (g.clone(), rgb)))
        .collect();

    if palette.is_empty() {
        return QuantizationResult {
            grid: vec![],
            legend: HashMap::new(),
            gum_counts: HashMap::new(),
            rows: 0,
            cols: 0,
        };
    }

    // Resize image to grid dimensions using high-quality sampling
    let resized = image.resize_exact(grid_cols, grid_rows, FilterType::Lanczos3);

    // Track which gum types are used and their indices
    let mut gum_to_index: HashMap<String, u8> = HashMap::new();
    let mut legend: HashMap<String, GumType> = HashMap::new();
    let mut gum_counts: HashMap<String, u32> = HashMap::new();
    let mut next_index: u8 = 1;

    // Build the grid
    let mut grid: Vec<Vec<u8>> = Vec::with_capacity(grid_rows as usize);

    for y in 0..grid_rows {
        let mut row: Vec<u8> = Vec::with_capacity(grid_cols as usize);

        for x in 0..grid_cols {
            let pixel = resized.get_pixel(x, y);
            let pixel_rgb = Rgb {
                r: pixel[0],
                g: pixel[1],
                b: pixel[2],
            };

            // Find nearest gum color
            let nearest_gum = find_nearest_gum(pixel_rgb, &palette);

            // Get or assign index
            let index = *gum_to_index.entry(nearest_gum.gum_id.clone()).or_insert_with(|| {
                let idx = next_index;
                next_index = next_index.saturating_add(1);
                legend.insert(idx.to_string(), nearest_gum.clone());
                idx
            });

            // Update count
            *gum_counts.entry(nearest_gum.gum_id.clone()).or_insert(0) += 1;

            row.push(index);
        }

        grid.push(row);
    }

    QuantizationResult {
        grid,
        legend,
        gum_counts,
        rows: grid_rows,
        cols: grid_cols,
    }
}

/// Load an image from bytes
pub fn load_image_from_bytes(bytes: &[u8]) -> anyhow::Result<DynamicImage> {
    image::load_from_memory(bytes).map_err(|e| anyhow::anyhow!("Failed to load image: {}", e))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_palette() -> Vec<GumType> {
        vec![
            GumType {
                gum_id: "red".to_string(),
                name: "Red Gum".to_string(),
                hex_color: "#FF0000".to_string(),
                price_per_piece: 0.05,
                brand: None,
                flavor: None,
                is_available: true,
            },
            GumType {
                gum_id: "green".to_string(),
                name: "Green Gum".to_string(),
                hex_color: "#00FF00".to_string(),
                price_per_piece: 0.05,
                brand: None,
                flavor: None,
                is_available: true,
            },
            GumType {
                gum_id: "blue".to_string(),
                name: "Blue Gum".to_string(),
                hex_color: "#0000FF".to_string(),
                price_per_piece: 0.05,
                brand: None,
                flavor: None,
                is_available: true,
            },
        ]
    }

    #[test]
    fn test_color_distance() {
        let red = Rgb { r: 255, g: 0, b: 0 };
        let also_red = Rgb { r: 255, g: 0, b: 0 };
        let blue = Rgb { r: 0, g: 0, b: 255 };

        assert_eq!(color_distance_squared(red, also_red), 0);
        assert!(color_distance_squared(red, blue) > 0);
    }

    #[test]
    fn test_find_nearest_gum() {
        let palette = create_test_palette();
        let palette_with_rgb: Vec<(GumType, Rgb)> = palette
            .iter()
            .filter_map(|g| g.to_rgb().map(|rgb| (g.clone(), rgb)))
            .collect();

        // Pure red should match red gum
        let red_pixel = Rgb { r: 255, g: 0, b: 0 };
        let nearest = find_nearest_gum(red_pixel, &palette_with_rgb);
        assert_eq!(nearest.gum_id, "red");

        // Light red should still match red
        let light_red = Rgb { r: 200, g: 50, b: 50 };
        let nearest = find_nearest_gum(light_red, &palette_with_rgb);
        assert_eq!(nearest.gum_id, "red");
    }

    #[test]
    fn test_quantize_small_image() {
        let palette = create_test_palette();

        // Create a simple 2x2 test image
        let img = image::RgbImage::from_fn(2, 2, |x, y| {
            match (x, y) {
                (0, 0) => image::Rgb([255, 0, 0]),   // Red
                (1, 0) => image::Rgb([0, 255, 0]),   // Green
                (0, 1) => image::Rgb([0, 0, 255]),   // Blue
                (1, 1) => image::Rgb([255, 0, 0]),   // Red
                _ => image::Rgb([0, 0, 0]),
            }
        });
        let dynamic_img = DynamicImage::ImageRgb8(img);

        let result = quantize_image(&dynamic_img, &palette, 2, 2);

        assert_eq!(result.rows, 2);
        assert_eq!(result.cols, 2);
        assert_eq!(result.grid.len(), 2);
        assert_eq!(result.grid[0].len(), 2);

        // Check that we have entries in the legend
        assert!(!result.legend.is_empty());

        // Check counts - should have 2 red, 1 green, 1 blue
        let total: u32 = result.gum_counts.values().sum();
        assert_eq!(total, 4);
    }
}
