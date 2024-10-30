import type { Schema } from "./resource";
import {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseCommandInput,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient();

export const handler: Schema["generateChatResponse"]["functionHandler"] = async (
  event
) => {

  const messages = event.arguments.conversation;

  const input = {
    modelId: process.env.CHAT_MODEL_ID,
    messages: messages,
    inferenceConfig: {
      maxTokens: 1000,
      temperature: 0.9,
    }
  } as ConverseCommandInput;

  console.log("input", input);

  const command = new ConverseCommand(input);
  const response = await client.send(command);

  const jsonResponse = JSON.stringify(response.output?.message);

  console.log("jsonResponse", jsonResponse);

  return jsonResponse;
};