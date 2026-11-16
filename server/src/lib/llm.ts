import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { OPENROUTER_API_KEY } from "../config/env";
import { getChatModel, hasLLM, openAIChatModel } from "./model";

// -> sends system and user prompts to the configured chat model and returns trimmed text content
export async function runPlainPrompt(
  userPrompt: string,
  systemPrompt?: string
): Promise<string> {
  if (!hasLLM()) {
    throw new Error("No valid LLM provider configured in environment variables");
  }

  const messages = systemPrompt
    ? [new SystemMessage(systemPrompt), new HumanMessage(userPrompt)]
    : [new HumanMessage(userPrompt)];

  try {
    const model = getChatModel();
    const response = await model.invoke(messages);

    if (typeof response.content === "string" && response.content.trim().length > 0) {
      return response.content.trim();
    }
  } catch (primaryError) {
    if (OPENROUTER_API_KEY) {
      const fallbackModel = openAIChatModel("google/gemini-2.5-flash");
      const fallbackResponse = await fallbackModel.invoke(messages);

      if (
        typeof fallbackResponse.content === "string" &&
        fallbackResponse.content.trim().length > 0
      ) {
        return fallbackResponse.content.trim();
      }
    }

    throw primaryError;
  }

  return "";
}

export const runplainprompt = runPlainPrompt;
