#!/usr/bin/env node

/**
 * Seed script for populating GumProduct table with sample data
 * Usage: node scripts/seed-gum-products.mjs <API_URL>
 */

const sampleProducts = [
  // Dubble Bubble
  {
    brandName: 'Dubble Bubble',
    color: 'Pink',
    flavor: 'Original',
    packSize: 5,
    purchaseUrl: 'https://www.amazon.com/Dubble-Bubble-Original-Gum/dp/B000EMJBNQ'
  },
  {
    brandName: 'Dubble Bubble',
    color: 'Blue',
    flavor: 'Grape',
    packSize: 5,
    purchaseUrl: 'https://www.amazon.com/Dubble-Bubble-Grape-Gum/dp/B000EMJBOS'
  },
  {
    brandName: 'Dubble Bubble',
    color: 'Red',
    flavor: 'Cherry',
    packSize: 5,
    purchaseUrl: 'https://www.amazon.com/Dubble-Bubble-Cherry-Gum/dp/B000EMJBP2'
  },

  // Hubba Bubba
  {
    brandName: 'Hubba Bubba',
    color: 'Pink',
    flavor: 'Strawberry',
    packSize: 6,
    purchaseUrl: 'https://www.amazon.com/Hubba-Bubba-Strawberry-Bubble-Gum/dp/B000LQMB7K'
  },
  {
    brandName: 'Hubba Bubba',
    color: 'Green',
    flavor: 'Watermelon',
    packSize: 6,
    purchaseUrl: 'https://www.amazon.com/Hubba-Bubba-Watermelon-Bubble-Gum/dp/B000LQMB8E'
  },
  {
    brandName: 'Hubba Bubba',
    color: 'Blue',
    flavor: 'Grape',
    packSize: 6,
    purchaseUrl: 'https://www.amazon.com/Hubba-Bubba-Grape-Bubble-Gum/dp/B000LQMB98'
  },

  // Bazooka
  {
    brandName: 'Bazooka',
    color: 'Pink',
    flavor: 'Original',
    packSize: 1,
    purchaseUrl: 'https://www.amazon.com/Bazooka-Original-Bubble-Gum/dp/B000EMJBQG'
  },
  {
    brandName: 'Bazooka',
    color: 'Red',
    flavor: 'Cherry',
    packSize: 1,
    purchaseUrl: 'https://www.amazon.com/Bazooka-Cherry-Bubble-Gum/dp/B000EMJBRA'
  },
  {
    brandName: 'Bazooka',
    color: 'Blue',
    flavor: 'Grape',
    packSize: 1,
    purchaseUrl: 'https://www.amazon.com/Bazooka-Grape-Bubble-Gum/dp/B000EMJBS4'
  },

  // Trident
  {
    brandName: 'Trident',
    color: 'White',
    flavor: 'Mint',
    packSize: 14,
    purchaseUrl: 'https://www.amazon.com/Trident-Spearmint-Sugar-Free-Gum/dp/B000LQMB9S'
  },
  {
    brandName: 'Trident',
    color: 'Green',
    flavor: 'Mint',
    packSize: 14,
    purchaseUrl: 'https://www.amazon.com/Trident-Peppermint-Sugar-Free-Gum/dp/B000LQMBAM'
  },
  {
    brandName: 'Trident',
    color: 'Pink',
    flavor: 'Strawberry',
    packSize: 14,
    purchaseUrl: 'https://www.amazon.com/Trident-Strawberry-Sugar-Free-Gum/dp/B000LQMBBG'
  },

  // Extra
  {
    brandName: 'Extra',
    color: 'White',
    flavor: 'Mint',
    packSize: 15,
    purchaseUrl: 'https://www.amazon.com/Extra-Spearmint-Sugar-Free-Gum/dp/B000LQMBCA'
  },
  {
    brandName: 'Extra',
    color: 'Green',
    flavor: 'Mint',
    packSize: 15,
    purchaseUrl: 'https://www.amazon.com/Extra-Peppermint-Sugar-Free-Gum/dp/B000LQMBD4'
  },
  {
    brandName: 'Extra',
    color: 'Purple',
    flavor: 'Grape',
    packSize: 15,
    purchaseUrl: 'https://www.amazon.com/Extra-Grape-Sugar-Free-Gum/dp/B000LQMBEY'
  },
  {
    brandName: 'Extra',
    color: 'Yellow',
    flavor: 'Watermelon',
    packSize: 15,
    purchaseUrl: 'https://www.amazon.com/Extra-Watermelon-Sugar-Free-Gum/dp/B000LQMBFS'
  }
];

async function seedProducts(apiUrl) {
  console.log(`Seeding ${sampleProducts.length} gum products to ${apiUrl}...`);

  let successCount = 0;
  let errorCount = 0;

  for (const product of sampleProducts) {
    try {
      const response = await fetch(`${apiUrl}/gum-products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✓ Created: ${product.brandName} - ${product.color} ${product.flavor} (${data.productId})`);
        successCount++;
      } else {
        const error = await response.text();
        console.error(`✗ Failed: ${product.brandName} - ${product.color} ${product.flavor}`);
        console.error(`  Status: ${response.status}, Error: ${error}`);
        errorCount++;
      }
    } catch (error) {
      console.error(`✗ Failed: ${product.brandName} - ${product.color} ${product.flavor}`);
      console.error(`  Error: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\nSeeding complete: ${successCount} succeeded, ${errorCount} failed`);

  if (errorCount > 0) {
    process.exit(1);
  }
}

// Get API URL from command line argument
const apiUrl = process.argv[2];

if (!apiUrl) {
  console.error('Usage: node scripts/seed-gum-products.mjs <API_URL>');
  console.error('Example: node scripts/seed-gum-products.mjs https://abc123.execute-api.us-west-2.amazonaws.com/prod');
  process.exit(1);
}

seedProducts(apiUrl);
