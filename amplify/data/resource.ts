import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== Gum Rating Interface Data Schema ====================================
This schema defines the data models for the gum rating interface, including
gum packs, ratings, orders, and celebrity endorsement requests.
=========================================================================*/
const schema = a.schema({
  GumPack: a
    .model({
      packId: a.id().required(),
      name: a.string().required(),
      color: a.string().required(),
      flavor: a.string().required(),
      origin: a.string().required(),
      stock: a.integer().required().default(0),
      price: a.float().required(),
      averageRating: a.float().default(0),
      totalRatings: a.integer().default(0),
      description: a.string(),
      imageUrl: a.string(),
    })
    .identifier(['packId'])
    .authorization((allow) => [allow.publicApiKey()]),

  Rating: a
    .model({
      ratingId: a.id().required(),
      packId: a.string().required(),
      rating: a.integer().required(),
      comment: a.string(),
      userName: a.string(),
      createdAt: a.datetime().required(),
    })
    .identifier(['packId', 'ratingId'])
    .authorization((allow) => [allow.publicApiKey()]),

  Order: a
    .model({
      orderId: a.id().required(),
      items: a.json().required(),
      totalAmount: a.float().required(),
      status: a.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
      shippingAddress: a.json().required(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime(),
    })
    .identifier(['orderId'])
    .authorization((allow) => [allow.publicApiKey()]),

  CelebrityRequest: a
    .model({
      requestId: a.id().required(),
      celebrity: a.enum(['EMMA_WATSON', 'BRAD_PITT']),
      packId: a.string().required(),
      destination: a.string().required(),
      status: a.enum(['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED']),
      requestedBy: a.string(),
      notes: a.string(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime(),
    })
    .identifier(['requestId'])
    .authorization((allow) => [allow.publicApiKey()]),

  // Gum Wall Calculator - Price list for different gum types
  GumType: a
    .model({
      gumId: a.string().required(),      // Unique identifier (e.g., "dubble_bubble_pink")
      name: a.string().required(),        // Display name (e.g., "Dubble Bubble Original")
      hexColor: a.string().required(),    // Hex color code (e.g., "#FF69B4")
      pricePerPiece: a.float().required(), // Price in USD (e.g., 0.05)
      brand: a.string(),                  // Brand name (e.g., "Dubble Bubble")
      flavor: a.string(),                 // Flavor description
      isAvailable: a.boolean().default(true),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
