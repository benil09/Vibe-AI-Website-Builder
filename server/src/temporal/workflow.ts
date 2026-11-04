import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "./activities";

const { createSandbox, saveResult } = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute",
});

export interface CodeAgentInput {
  projectId: string;
  prompt: string;
}

// -> workflow coordinating code generation and sandbox tasks for a project
export async function codeAgentWorkflow(input: CodeAgentInput): Promise<void> {
  await createSandbox(input.projectId);
  void saveResult;
}

export async function pingWorkflow(name: string): Promise<string> {
  return `Hello ${name} from temporal`;
}
 