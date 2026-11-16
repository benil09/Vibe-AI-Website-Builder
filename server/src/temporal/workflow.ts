import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "./activities";

const {
  createSandbox,
  saveResult,
  loadSandboxFiles,
  generateTitle,
  generateMessageResponse,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute",
  retry: {
    maximumAttempts: 3,
  },
});

export interface CodeAgentInput {
  projectId: string;
  prompt: string;
}

// -> workflow coordinating code generation and sandbox tasks for a project
export async function codeAgentWorkflow(input: CodeAgentInput): Promise<void> {
  await createSandbox(input.projectId);

  const taskSummary =
    input.prompt ||
    "I need a react component that can fetch data from an API and display it in a table.";

  const [title, response, sandboxFiles] = await Promise.all([
    generateTitle(taskSummary),
    generateMessageResponse(taskSummary),
    loadSandboxFiles(input.projectId),
  ]);

  const files =
    Object.keys(sandboxFiles).length > 0
      ? sandboxFiles
      : { "src/App.tsx": response };

  await saveResult({
    projectId: input.projectId,
    files,
    sandboxUrl: `/api/preview/${input.projectId}`,
    title,
    content: response,
  });
}

export async function pingWorkflow(name: string): Promise<string> {
  return `Hello ${name} from temporal`;
}
