#!/usr/bin/env node

/**
 * Seed script for populating GumProduct table directly via DynamoDB
 * Usage: node scripts/seed-gum-products-dynamodb.mjs <TABLE_NAME>
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const client = new DynamoDBClient({ region: 'us-west-2' });
const docClient = DynamoDBDocumentClient.from(client);

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

async function seedProducts(tableName) {
  console.log(`Seeding ${sampleProducts.length} gum products to table: ${tableName}...`);

  let successCount = 0;
  let errorCount = 0;

  for (const product of sampleProducts) {
    try {
      const now = new Date().toISOString();
      const item = {
        productId: randomUUID(),
        ...product,
        createdAt: now,
        updatedAt: now,
      };

      const command = new PutCommand({
        TableName: tableName,
        Item: item,
      });

      await docClient.send(command);
      console.log(`✓ Created: ${product.brandName} - ${product.color} ${product.flavor} (${item.productId})`);
      successCount++;
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

// Get table name from command line argument or environment variable
const tableName = process.argv[2] || process.env.GUM_PRODUCTS_TABLE_NAME;

if (!tableName) {
  console.error('Usage: node scripts/seed-gum-products-dynamodb.mjs <TABLE_NAME>');
  console.error('Or set GUM_PRODUCTS_TABLE_NAME environment variable');
  console.error('\nExample: node scripts/seed-gum-products-dynamodb.mjs GumProduct-abc123');
  process.exit(1);
}

seedProducts(tableName);
