import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data, CHAT_MODEL_ID, generateChatResponseFunction } from './data/resource';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export const backend = defineBackend({
  auth,
  data,
  generateChatResponseFunction,
});

backend.generateChatResponseFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["bedrock:InvokeModel"],
    resources: [
      `arn:aws:bedrock:*::foundation-model/${CHAT_MODEL_ID}`,
    ],
  })
);
