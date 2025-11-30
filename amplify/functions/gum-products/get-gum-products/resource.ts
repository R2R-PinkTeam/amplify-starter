import { defineFunction } from '@aws-amplify/backend';

export const getGumProducts = defineFunction({
  name: 'get-gum-products',
  entry: './handler.mjs',
});
