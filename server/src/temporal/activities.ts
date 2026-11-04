import { saveResult as saveMessageResult, SaveResultInput } from "../repositories/message.repository";

export async function createSandbox(projectId: string): Promise<string> {
  return "Sandbox created for project " + projectId;
}

export async function saveResult(input: SaveResultInput) {
  return saveMessageResult(input);
}
