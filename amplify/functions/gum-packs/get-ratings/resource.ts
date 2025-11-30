import { defineFunction } from '@aws-amplify/backend';

export const getRatings = defineFunction({
  name: 'get-ratings',
  entry: './index.mjs',
  environment: {
    RATINGS_TABLE_NAME: 'Rating',
  },
});
