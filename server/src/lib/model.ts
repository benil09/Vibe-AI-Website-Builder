import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import {
  GEMINI_API_KEY,
  OPENAI_API_KEY,
  OPENROUTER_API_KEY,
  REASONING_EFFORT,
  REASONING_MODEL,
} from "../config/env";

const thinkingBudgetByEffort: Record<string, number> = {
  low: 1024,
  medium: 8192,
  high: 24576,
};

// -> checks whether a model supports reasoning or thinking capabilities
export function checkReasoningSupport(modelName: string): boolean {
  if (!modelName) return false;
  const normalized = modelName.toLowerCase();
  if (REASONING_MODEL && normalized === REASONING_MODEL.toLowerCase()) {
    return true;
  }
  return (
    normalized.includes("thinking") ||
    normalized.includes("reasoning") ||
    normalized.includes("gemini-2.5") ||
    normalized.includes("gemini-3") ||
    normalized.startsWith("o1") ||
    normalized.startsWith("o3") ||
    normalized.startsWith("o4")
  );
}

export const checkReasoingSUpport = checkReasoningSupport;

// -> creates and returns a ChatGoogleGenerativeAI instance configured with or without reasoning
export function geminiChatModel(modelName: string, reasoning: boolean = false): ChatGoogleGenerativeAI {
  const hasReasoningSupport = checkReasoningSupport(modelName);
  const enableReasoning = reasoning && hasReasoningSupport;

  if (enableReasoning) {
    const effort = REASONING_EFFORT || "medium";
    const thinkingBudget = thinkingBudgetByEffort[effort] ?? 8192;

    return new ChatGoogleGenerativeAI({
      model: modelName,
      apiKey: GEMINI_API_KEY,
      thinkingConfig: {
        thinkingBudget,
      },
    });
  }

  return new ChatGoogleGenerativeAI({
    model: modelName,
    apiKey: GEMINI_API_KEY,
  });
}

export const geminichatmodel = geminiChatModel;

// -> creates and returns a ChatOpenAI instance configured with or without reasoning
export function openAIChatModel(modelName: string, reasoning: boolean = false): ChatOpenAI {
  const hasReasoningSupport = checkReasoningSupport(modelName);
  const enableReasoning = reasoning && hasReasoningSupport;
  const effort = REASONING_EFFORT || "medium";

  const isAvailableOpenRouter = Boolean(OPENROUTER_API_KEY && !OPENAI_API_KEY);
  const apiKey = OPENAI_API_KEY || OPENROUTER_API_KEY;

  return new ChatOpenAI({
    model: modelName,
    apiKey,
    ...(isAvailableOpenRouter
      ? { configuration: { baseURL: "https://openrouter.ai/api/v1" } }
      : {}),
    ...(enableReasoning ? { modelKwargs: { reasoning_effort: effort } } : {}),
  });
}

// export const openaichatmodel = openAIChatModel;

// -> returns a chat model instance based on available API keys (Gemini by default if key exists, otherwise OpenAI)
export function getChatModel(modelName: string, reasoning: boolean = false): BaseChatModel {
  if (GEMINI_API_KEY) {
    return geminiChatModel(modelName, reasoning);
  }

  return openAIChatModel(modelName, reasoning);
}

// export const getchatmodel = getChatModel;
