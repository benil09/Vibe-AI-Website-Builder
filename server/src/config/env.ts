import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

export const PORT = Number(process.env.PORT) || 3000;
export const DATABASE_URL = process.env.DATABASE_URL!;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
export const TEMPORAL_ADDRESS = process.env.TEMPORAL_ADDRESS || "127.0.0.1:7233";
export const TEMPORAL_TASK_QUEUE =
  process.env.TEMPORAL_TASK_QUEUE || process.env.TEMPPRAL_TASK_QUEUE || "coding-agent";
