import { defineFunction } from '@aws-amplify/backend';

export const getGumProduct = defineFunction({
  name: 'get-gum-product',
  entry: './handler.mjs',
});
