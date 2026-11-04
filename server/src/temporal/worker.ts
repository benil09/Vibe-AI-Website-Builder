import { NativeConnection, Worker } from "@temporalio/worker";
import { TEMPORAL_ADDRESS, TEMPORAL_TASK_QUEUE } from "../config/env";
import { retryWithBackoff } from "../utils/retry";

// -> establishes and returns a NativeConnection to the Temporal server with retry backoff
export async function connect(maxAttempts = 5): Promise<NativeConnection> {
  return retryWithBackoff(
    () => NativeConnection.connect({ address: TEMPORAL_ADDRESS }),
    { maxAttempts, label: "Temporal worker connection" }
  );
}

// -> connects to Temporal, initializes the worker with workflows, and starts listening
export async function main(): Promise<void> {
  const connection = await connect();

  const worker = await Worker.create({
    connection,
    namespace: "default",
    taskQueue: TEMPORAL_TASK_QUEUE,
    workflowsPath: require.resolve("./workflow"),
  });

  await worker.run();
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Worker failed to start:", error);
    process.exit(1);
  });
}
