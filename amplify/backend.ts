import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { getGumPacks } from './functions/gum-packs/get-gum-packs/resource';
import { getGumPack } from './functions/gum-packs/get-gum-pack/resource';
import { createGumPack } from './functions/gum-packs/create-gum-pack/resource';
import { updateGumPackStock } from './functions/gum-packs/update-gum-pack-stock/resource';
import { getGumProducts } from './functions/gum-products/get-gum-products/resource';
import { getGumProduct } from './functions/gum-products/get-gum-product/resource';
import { createGumProduct } from './functions/gum-products/create-gum-product/resource';
import { RestApi, LambdaIntegration, Cors } from 'aws-cdk-lib/aws-apigateway';
import { Duration } from 'aws-cdk-lib';

/**
 * Gum Rating Interface Backend
 * AWS Amplify Gen 2 backend configuration
 */
const backend = defineBackend({
  auth,
  data,
  storage,
  getGumPacks,
  getGumPack,
  createGumPack,
  updateGumPackStock,
  getGumProducts,
  getGumProduct,
  createGumProduct,
});

// Get the DynamoDB table names from the data resource
const gumPacksTableName = backend.data.resources.tables['GumPack'].tableName;
const gumProductsTableName = backend.data.resources.tables['GumProduct'].tableName;

// Add environment variables to Lambda functions - GumPack
backend.getGumPacks.addEnvironment('GUM_PACKS_TABLE_NAME', gumPacksTableName);
backend.getGumPack.addEnvironment('GUM_PACKS_TABLE_NAME', gumPacksTableName);
backend.createGumPack.addEnvironment('GUM_PACKS_TABLE_NAME', gumPacksTableName);
backend.updateGumPackStock.addEnvironment('GUM_PACKS_TABLE_NAME', gumPacksTableName);

// Add environment variables to Lambda functions - GumProduct
backend.getGumProducts.addEnvironment('GUM_PRODUCTS_TABLE_NAME', gumProductsTableName);
backend.getGumProduct.addEnvironment('GUM_PRODUCTS_TABLE_NAME', gumProductsTableName);
backend.createGumProduct.addEnvironment('GUM_PRODUCTS_TABLE_NAME', gumProductsTableName);

// Grant read/write permissions to the GumPack table
backend.data.resources.tables['GumPack'].grantReadData(backend.getGumPacks.resources.lambda);
backend.data.resources.tables['GumPack'].grantReadData(backend.getGumPack.resources.lambda);
backend.data.resources.tables['GumPack'].grantReadWriteData(backend.createGumPack.resources.lambda);
backend.data.resources.tables['GumPack'].grantReadWriteData(backend.updateGumPackStock.resources.lambda);

// Grant read/write permissions to the GumProduct table
backend.data.resources.tables['GumProduct'].grantReadData(backend.getGumProducts.resources.lambda);
backend.data.resources.tables['GumProduct'].grantReadData(backend.getGumProduct.resources.lambda);
backend.data.resources.tables['GumProduct'].grantReadWriteData(backend.createGumProduct.resources.lambda);

// Create API Gateway for Gum Products
const gumProductsApiStack = backend.createStack('gum-products-api');

// Create REST API with CORS configuration
const gumProductsApi = new RestApi(gumProductsApiStack, 'GumProductsApi', {
  restApiName: 'Gum Products API',
  description: 'REST API for managing gum product catalog',
  deployOptions: {
    stageName: 'prod',
    description: 'Production stage for Gum Products API',
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
    allowMethods: Cors.ALL_METHODS,
    allowHeaders: [
      'Content-Type',
      'X-Amz-Date',
      'Authorization',
      'X-Api-Key',
      'X-Amz-Security-Token',
    ],
    maxAge: Duration.hours(1),
  },
});

// Create Lambda integrations
const getGumProductsIntegration = new LambdaIntegration(backend.getGumProducts.resources.lambda);
const getGumProductIntegration = new LambdaIntegration(backend.getGumProduct.resources.lambda);
const createGumProductIntegration = new LambdaIntegration(backend.createGumProduct.resources.lambda);

// Create /gum-products resource
const gumProductsResource = gumProductsApi.root.addResource('gum-products');

// GET /gum-products - Get all products
gumProductsResource.addMethod('GET', getGumProductsIntegration);

// POST /gum-products - Create a product
gumProductsResource.addMethod('POST', createGumProductIntegration);

// GET /gum-products/{productId} - Get a specific product
const gumProductResource = gumProductsResource.addResource('{productId}');
gumProductResource.addMethod('GET', getGumProductIntegration);

// Add outputs for API endpoint
backend.addOutput({
  custom: {
    GumProductsApiUrl: gumProductsApi.url,
    GumProductsApiId: gumProductsApi.restApiId,
  },
});
