import { defineFunction } from '@aws-amplify/backend';

export const createGumPack = defineFunction({
  name: 'create-gum-pack',
  entry: './index.mjs',
});
