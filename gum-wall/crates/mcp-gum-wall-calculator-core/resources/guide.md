# Gum Wall Calculator MCP Server Guide

## Overview

The Gum Wall Calculator helps you plan a gum wall art installation - turning any image into a paint-by-number mosaic made of chewing gum pieces! This is a delightfully useless but technically impressive application.

## Available Tools

### analyze_image_for_gum_wall

Analyzes an image from S3 and creates a paint-by-number gum wall design.

**Parameters:**
- `s3_uri` (string, required): S3 URI to the image (format: `s3://bucket/key`)
- `wall_width_cm` (number, required): Wall width in centimeters (10-10000)
- `wall_height_cm` (number, required): Wall height in centimeters (10-10000)
- `gum_diameter_cm` (number, optional): Diameter of each gum piece in centimeters (0.5-5.0, default: 2.0)

**Example Request:**
```json
{
  "s3_uri": "s3://my-bucket/images/sunset.jpg",
  "wall_width_cm": 200,
  "wall_height_cm": 150,
  "gum_diameter_cm": 2.0
}
```

**Response:**
```json
{
  "grid": [[1, 2, 1, 3], [2, 1, 3, 2], ...],
  "legend": {
    "1": {"gum_id": "dubble_bubble_pink", "name": "Dubble Bubble Original", "hex_color": "#FF69B4", ...},
    "2": {"gum_id": "juicy_fruit_yellow", "name": "Juicy Fruit", "hex_color": "#FFD700", ...}
  },
  "dimensions": {"rows": 75, "cols": 100, "total_positions": 7500},
  "gum_counts": {"dubble_bubble_pink": 2500, "juicy_fruit_yellow": 1800, ...},
  "total_gums": 7500,
  "image_description": "A vibrant sunset over mountains with orange, pink, and purple hues...",
  "svg": "<svg>...</svg>"
}
```

### calculate_gum_cost

Calculates the total cost of gum needed for a gum wall project.

**Parameters:**
- `gum_counts` (object, required): Map of gum type ID to count needed

**Example Request:**
```json
{
  "gum_counts": {
    "dubble_bubble_pink": 2500,
    "juicy_fruit_yellow": 1800,
    "big_red": 1200
  }
}
```

**Response:**
```json
{
  "breakdown": [
    {"gum_id": "dubble_bubble_pink", "name": "Dubble Bubble Original", "hex_color": "#FF69B4", "count": 2500, "unit_price": 0.05, "subtotal": 125.00},
    {"gum_id": "juicy_fruit_yellow", "name": "Juicy Fruit", "hex_color": "#FFD700", "count": 1800, "unit_price": 0.07, "subtotal": 126.00},
    {"gum_id": "big_red", "name": "Big Red", "hex_color": "#DC143C", "count": 1200, "unit_price": 0.08, "subtotal": 96.00}
  ],
  "total_pieces": 5500,
  "total_cost": 347.00,
  "currency": "USD",
  "fun_stats": {
    "chewing_time_hours": 458.33,
    "calories_burned": 60500,
    "packs_needed": 1100,
    "weight_kg": 16.5
  }
}
```

### list_gum_types

Lists all available gum types with their colors and prices.

**Parameters:** None

**Example Response:**
```json
{
  "gum_types": [
    {"gum_id": "dubble_bubble_pink", "name": "Dubble Bubble Original", "hex_color": "#FF69B4", "price_per_piece": 0.05, "brand": "Dubble Bubble", "flavor": "Original"},
    {"gum_id": "juicy_fruit_yellow", "name": "Juicy Fruit", "hex_color": "#FFD700", "price_per_piece": 0.07, "brand": "Wrigley's", "flavor": "Juicy Fruit"},
    ...
  ],
  "count": 12,
  "source": "appsync"
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | API key for GPT-4o-mini vision analysis |
| `APPSYNC_API_URL` | No | AppSync GraphQL endpoint for gum prices |
| `APPSYNC_API_KEY` | No | AppSync API key |
| `AWS_REGION` | Yes | AWS region for S3 access |
| `PORT` or `MCP_HTTP_PORT` | No | HTTP port (default: 3000) |

## How It Works

1. **Image Analysis**: Upload your target image to S3. The tool fetches it and uses GPT-4o-mini vision to understand the image content.

2. **Color Quantization**: The image is resized to a grid based on your wall dimensions and gum size. Each pixel is mapped to the nearest available gum color using Euclidean distance in RGB color space.

3. **Paint-by-Number Generation**: A numbered grid is created where each number corresponds to a specific gum color. An SVG visualization is generated showing the design with a legend.

4. **Cost Calculation**: Based on the gum counts, the tool calculates the total cost using prices from DynamoDB (via AppSync) and includes fun statistics like total chewing time.

## Available Gum Colors

The system supports 12 gum colors by default:
- Dubble Bubble Original (Hot Pink)
- Hubba Bubba Strawberry (Deep Pink)
- Bazooka Original (Light Pink)
- Juicy Fruit (Gold/Yellow)
- Big League Chew Green Apple (Lime Green)
- Trident Spearmint (Pale Green)
- Orbit Bubblemint (Sky Blue)
- Extra Polar Ice (White/Off-white)
- Big Red (Crimson)
- Eclipse Winterfrost (Light Cyan)
- Hubba Bubba Grape (Dark Magenta)
- Trident Orange (Orange)

## Tips for Best Results

1. **Simple images work best**: High-contrast images with distinct color regions translate better to gum art.
2. **Consider your palette**: The limited gum colors mean complex gradients may not reproduce well.
3. **Size matters**: A 2m x 1.5m wall with 2cm gum pieces = 7,500 pieces of gum!
4. **Budget accordingly**: At $0.05-0.15 per piece, costs add up quickly.

## Error Handling

- **Validation errors**: Invalid dimensions or S3 URIs return detailed error messages
- **S3 errors**: Permission issues or missing files are reported clearly
- **Vision API errors**: If GPT-4o-mini is unavailable, image description defaults to a placeholder
- **Price data**: Falls back to hardcoded prices if AppSync is unavailable
