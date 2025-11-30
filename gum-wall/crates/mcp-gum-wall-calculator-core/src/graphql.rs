//! AppSync GraphQL client for fetching gum price list

use anyhow::{anyhow, Context, Result};
use crate::types::{GraphQLResponse, GumType, GumTypeRecord, ListGumTypesData};

/// GraphQL query to list all gum types
const LIST_GUM_TYPES_QUERY: &str = r#"
query ListGumTypes {
    listGumTypes {
        items {
            id
            gumId
            name
            hexColor
            pricePerPiece
            brand
            flavor
            isAvailable
        }
    }
}
"#;

// Hardcoded AppSync configuration for Lambda deployment simplicity
const HARDCODED_APPSYNC_API_URL: &str = "https://ckdu2l4upbhn5efpirlmursvvi.appsync-api.us-west-2.amazonaws.com/graphql";
const HARDCODED_APPSYNC_API_KEY: &str = "da2-jgugqfhsdrdytmngzf73ni2r4q";

/// Fetch all gum types from AppSync GraphQL API
pub async fn fetch_gum_types() -> Result<Vec<GumType>> {
    // Use environment variables if set, otherwise use hardcoded values
    let api_url = std::env::var("APPSYNC_API_URL")
        .unwrap_or_else(|_| HARDCODED_APPSYNC_API_URL.to_string());

    let api_key = std::env::var("APPSYNC_API_KEY")
        .unwrap_or_else(|_| HARDCODED_APPSYNC_API_KEY.to_string());

    let client = reqwest::Client::new();

    let response = client
        .post(&api_url)
        .header("x-api-key", &api_key)
        .header("Content-Type", "application/json")
        .json(&serde_json::json!({
            "query": LIST_GUM_TYPES_QUERY
        }))
        .send()
        .await
        .context("Failed to send GraphQL request")?;

    if !response.status().is_success() {
        let status = response.status();
        let error_body = response.text().await.unwrap_or_default();
        return Err(anyhow!("AppSync API error ({}): {}", status, error_body));
    }

    let graphql_response: GraphQLResponse<ListGumTypesData> = response
        .json()
        .await
        .context("Failed to parse GraphQL response")?;

    if let Some(errors) = graphql_response.errors {
        let error_messages: Vec<String> = errors.iter().map(|e| e.message.clone()).collect();
        return Err(anyhow!("GraphQL errors: {}", error_messages.join(", ")));
    }

    let data = graphql_response
        .data
        .ok_or_else(|| anyhow!("No data in GraphQL response"))?;

    let gum_types: Vec<GumType> = data
        .list_gum_types
        .items
        .into_iter()
        .filter(|g| g.is_available)
        .map(GumType::from)
        .collect();

    Ok(gum_types)
}

/// Get a map of gum_id to GumType for quick lookup
pub async fn fetch_gum_types_map() -> Result<std::collections::HashMap<String, GumType>> {
    let gum_types = fetch_gum_types().await?;
    Ok(gum_types.into_iter().map(|g| (g.gum_id.clone(), g)).collect())
}

/// Fallback gum types when AppSync is not available (for development/testing)
pub fn get_fallback_gum_types() -> Vec<GumType> {
    vec![
        GumType {
            gum_id: "dubble_bubble_pink".to_string(),
            name: "Dubble Bubble Original".to_string(),
            hex_color: "#FF69B4".to_string(),
            price_per_piece: 0.05,
            brand: Some("Dubble Bubble".to_string()),
            flavor: Some("Original".to_string()),
            is_available: true,
        },
        GumType {
            gum_id: "hubba_bubba_strawberry".to_string(),
            name: "Hubba Bubba Strawberry".to_string(),
            hex_color: "#FF1493".to_string(),
            price_per_piece: 0.08,
            brand: Some("Hubba Bubba".to_string()),
            flavor: Some("Strawberry".to_string()),
            is_available: true,
        },
        GumType {
            gum_id: "bazooka_classic".to_string(),
            name: "Bazooka Original".to_string(),
            hex_color: "#FFB6C1".to_string(),
            price_per_piece: 0.06,
            brand: Some("Bazooka".to_string()),
            flavor: Some("Classic".to_string()),
            is_available: true,
        },
        GumType {
            gum_id: "juicy_fruit_yellow".to_string(),
            name: "Juicy Fruit".to_string(),
            hex_color: "#FFD700".to_string(),
            price_per_piece: 0.07,
            brand: Some("Wrigley's".to_string()),
            flavor: Some("Juicy Fruit".to_string()),
            is_available: true,
        },
        GumType {
            gum_id: "big_league_green".to_string(),
            name: "Big League Chew Green Apple".to_string(),
            hex_color: "#32CD32".to_string(),
            price_per_piece: 0.09,
            brand: Some("Big League Chew".to_string()),
            flavor: Some("Green Apple".to_string()),
            is_available: true,
        },
        GumType {
            gum_id: "trident_spearmint".to_string(),
            name: "Trident Spearmint".to_string(),
            hex_color: "#98FB98".to_string(),
            price_per_piece: 0.10,
            brand: Some("Trident".to_string()),
            flavor: Some("Spearmint".to_string()),
            is_available: true,
        },
        GumType {
            gum_id: "orbit_blue".to_string(),
            name: "Orbit Bubblemint".to_string(),
            hex_color: "#87CEEB".to_string(),
            price_per_piece: 0.12,
            brand: Some("Orbit".to_string()),
            flavor: Some("Bubblemint".to_string()),
            is_available: true,
        },
        GumType {
            gum_id: "extra_white".to_string(),
            name: "Extra Polar Ice".to_string(),
            hex_color: "#F5F5F5".to_string(),
            price_per_piece: 0.11,
            brand: Some("Extra".to_string()),
            flavor: Some("Polar Ice".to_string()),
            is_available: true,
        },
        GumType {
            gum_id: "big_red".to_string(),
            name: "Big Red".to_string(),
            hex_color: "#DC143C".to_string(),
            price_per_piece: 0.08,
            brand: Some("Wrigley's".to_string()),
            flavor: Some("Cinnamon".to_string()),
            is_available: true,
        },
        GumType {
            gum_id: "eclipse_mint".to_string(),
            name: "Eclipse Winterfrost".to_string(),
            hex_color: "#E0FFFF".to_string(),
            price_per_piece: 0.15,
            brand: Some("Eclipse".to_string()),
            flavor: Some("Winterfrost".to_string()),
            is_available: true,
        },
        GumType {
            gum_id: "grape_hubba".to_string(),
            name: "Hubba Bubba Grape".to_string(),
            hex_color: "#8B008B".to_string(),
            price_per_piece: 0.08,
            brand: Some("Hubba Bubba".to_string()),
            flavor: Some("Grape".to_string()),
            is_available: true,
        },
        GumType {
            gum_id: "orange_trident".to_string(),
            name: "Trident Orange".to_string(),
            hex_color: "#FFA500".to_string(),
            price_per_piece: 0.10,
            brand: Some("Trident".to_string()),
            flavor: Some("Orange".to_string()),
            is_available: true,
        },
    ]
}

/// Try to fetch gum types from AppSync, fall back to hardcoded list if unavailable
pub async fn fetch_gum_types_with_fallback() -> Vec<GumType> {
    match fetch_gum_types().await {
        Ok(types) if !types.is_empty() => types,
        Ok(_) => {
            tracing::warn!("No gum types found in AppSync, using fallback");
            get_fallback_gum_types()
        }
        Err(e) => {
            tracing::warn!("Failed to fetch gum types from AppSync: {}. Using fallback.", e);
            get_fallback_gum_types()
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_fallback_gum_types() {
        let types = get_fallback_gum_types();
        assert!(!types.is_empty());
        assert!(types.len() >= 10);

        // Check that all have valid hex colors
        for gum in &types {
            assert!(gum.hex_color.starts_with('#'));
            assert_eq!(gum.hex_color.len(), 7);
        }
    }

    #[test]
    fn test_gum_type_record_conversion() {
        let record = GumTypeRecord {
            id: "123".to_string(),
            gum_id: "test_gum".to_string(),
            name: "Test Gum".to_string(),
            hex_color: "#FFFFFF".to_string(),
            price_per_piece: 0.10,
            brand: Some("Test Brand".to_string()),
            flavor: None,
            is_available: true,
        };

        let gum_type: GumType = record.into();
        assert_eq!(gum_type.gum_id, "test_gum");
        assert_eq!(gum_type.name, "Test Gum");
        assert!(gum_type.brand.is_some());
        assert!(gum_type.flavor.is_none());
    }
}
