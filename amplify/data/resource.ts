import { type ClientSchema, a, defineData, defineFunction } from "@aws-amplify/backend";

export const CHAT_MODEL_ID = "amazon.titan-text-premier-v1:0";

export const generateChatResponseFunction = defineFunction({
  entry: "./generateChatResponse.ts",
  environment: {
    CHAT_MODEL_ID,
  },
  timeoutSeconds: 180,
  runtime: 20
});

const schema = a.schema({
  generateChatResponse: a
    .query()
    .arguments({ conversation: a.json().required() })
    .returns(a.string())
    .authorization((allow) => [allow.publicApiKey()])
    .handler(a.handler.function(generateChatResponseFunction)),
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
