import { Connection, Client, WorkflowHandle } from "@temporalio/client";
import { TEMPORAL_ADDRESS, TEMPORAL_TASK_QUEUE } from "../config/env";
import { retryWithBackoff } from "../utils/retry";
import { pingWorkflow } from "./workflow";

let clientInstance: Client | null = null;

// -> connects to Temporal using Connection and returns a singleton Client instance with retry backoff
export async function connect(maxAttempts = 5): Promise<Client> {
  if (clientInstance) {
    return clientInstance;
  }

  const connection = await retryWithBackoff(
    () => Connection.connect({ address: TEMPORAL_ADDRESS }),
    { maxAttempts, label: "Temporal client connection" }
  );

  clientInstance = new Client({
    connection,
    namespace: "default",
  });

  return clientInstance;
}

// -> starts pingWorkflow on the task queue and returns the workflow handle
export async function startPing(name: string = "World"): Promise<WorkflowHandle<typeof pingWorkflow>> {
  const client = await connect();

  return client.workflow.start(pingWorkflow, {
    taskQueue: TEMPORAL_TASK_QUEUE,
    workflowId: `ping-${Date.now()}`,
    args: [name],
  });
}

if (require.main === module) {
  startPing("developer")
    .then(async (handle) => {
      console.log(`Started pingWorkflow with ID: ${handle.workflowId}`);
      const result = await handle.result();
      console.log(`Workflow result: ${result}`);
    })
    .catch((error) => {
      console.error("Failed to execute ping workflow:", error);
      process.exit(1);
    });
}
