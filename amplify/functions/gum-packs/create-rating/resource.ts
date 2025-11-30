import { defineFunction } from '@aws-amplify/backend';

export const createRating = defineFunction({
  name: 'create-rating',
  entry: './index.mjs',
  environment: {
    RATINGS_TABLE_NAME: 'Rating',
    GUM_PACKS_TABLE_NAME: 'GumPack',
  },
});
