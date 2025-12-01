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
