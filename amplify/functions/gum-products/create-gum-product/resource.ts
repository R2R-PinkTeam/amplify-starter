import { defineFunction } from '@aws-amplify/backend';

export const createGumProduct = defineFunction({
  name: 'create-gum-product',
  entry: './handler.mjs',
});
