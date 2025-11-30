import { defineFunction } from '@aws-amplify/backend';

export const updateGumPackStock = defineFunction({
  name: 'update-gum-pack-stock',
  entry: './index.mjs',
});
