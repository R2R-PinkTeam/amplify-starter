import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== AWS re:Invent 2025 Pink Team Competition Platform ==================
This schema defines the data models for our competition platform, including
team challenges, submissions, and progress tracking.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      priority: a.enum(["LOW", "MEDIUM", "HIGH"]),
      category: a.string(),
      completed: a.boolean().default(false),
      assignedTo: a.string(),
      dueDate: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
    
  Challenge: a
    .model({
      title: a.string().required(),
      description: a.string(),
      points: a.integer().default(0),
      difficulty: a.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
      category: a.string(),
      isCompleted: a.boolean().default(false),
    })
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

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
