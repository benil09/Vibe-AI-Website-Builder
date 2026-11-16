import { runPlainPrompt } from "../lib/llm";
import { FRAGMENT_TITLE_PROMPT, RESPONSE_PROMPT } from "../lib/prompt";
import { ensureSandbox, readSandboxTree } from "../lib/sandbox";
import {
  FileCollection,
  saveResult as saveMessageResult,
  SaveResultInput,
} from "../repositories/message.repository";

export async function createSandbox(projectId: string): Promise<string> {
  return ensureSandbox(projectId);
}

export async function saveResult(input: SaveResultInput) {
  return saveMessageResult(input);
}

export async function loadSandboxFiles(sandboxId: string): Promise<FileCollection> {
  return readSandboxTree(sandboxId);
}

export async function generateTitle(taskSummary: string): Promise<string> {
  const title = await runPlainPrompt(taskSummary, FRAGMENT_TITLE_PROMPT);
  return title.trim().replace(/^["']+|["']+$/g, "").trim().slice(0, 40) || "Untitled";
}

export async function generateMessageResponse(taskSummary: string): Promise<string> {
  const response = await runPlainPrompt(taskSummary, RESPONSE_PROMPT);
  return response.trim() || "";
}
