import { defineFunction } from '@aws-amplify/backend';

export const getGumPacks = defineFunction({
  name: 'get-gum-packs',
  entry: './index.mjs',
});
