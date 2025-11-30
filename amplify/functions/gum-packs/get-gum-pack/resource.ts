import { defineFunction } from '@aws-amplify/backend';

export const getGumPack = defineFunction({
  name: 'get-gum-pack',
  entry: './index.mjs',
});
