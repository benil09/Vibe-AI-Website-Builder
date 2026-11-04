export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  backoffFactor?: number;
  label?: string;
}

export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// -> executes an async operation with exponential backoff retries and returns its resolved value
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 5;
  const initialDelayMs = options.initialDelayMs ?? 1000;
  const backoffFactor = options.backoffFactor ?? 2;
  const label = options.label ?? "Operation";

  let currentDelay = initialDelayMs;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      console.warn(
        `${label} attempt ${attempt}/${maxAttempts} failed, retrying in ${currentDelay}ms...`
      );
      await wait(currentDelay);
      currentDelay *= backoffFactor;
    }
  }

  throw new Error(`${label} failed after ${maxAttempts} attempts`);
}

