import { readSandboxTree } from "../lib/sandbox";
import { FileCollection, saveResult as saveMessageResult, SaveResultInput } from "../repositories/message.repository";

export async function createSandbox(projectId: string): Promise<string> {
  return "Sandbox created for project " + projectId;
}

export async function saveResult(input: SaveResultInput) {
  return saveMessageResult(input);
}


export async function loadSandboxFiles(sandboxId : string) : Promise<FileCollection>{
  return readSandboxTree(sandboxId)
}