import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

/**
 * Gum Rating Interface Backend
 * AWS Amplify Gen 2 backend configuration
 */
const backend = defineBackend({
  auth,
  data,
  storage,
});

// Access the data stack for custom configurations if needed
const { cfnResources } = backend.data;

// Note: Amplify Gen 2 automatically creates optimized DynamoDB tables
// Additional customizations can be added here using CDK constructs
