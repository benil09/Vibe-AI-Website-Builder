import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { sandboxRoot, SKIP_DIRS, SKIP_FILES, MAX_TRCKED_BYTE_SIZE } from "../config/constants";

export type fileCollection = Record<string, string>;

export const ensureSandbox = async (sandbox: string): Promise<string> => {
  const sandboxPath = path.isAbsolute(sandbox)
    ? sandbox
    : path.resolve(sandboxRoot, sandbox);

  await fs.mkdir(sandboxPath, { recursive: true });

  return sandboxPath;
};


// -> null if path is empty or escapes sandbox, otherwise returns cleaned relative path
const sanitizeFilePath = (filePath: string): string | null => {
  const stripped = filePath.replace(/^[/\\]+/, "");

  const segments = stripped
    .split(/[/\\]/)
    .filter((seg) => seg.length > 0 && seg !== ".." && seg !== ".");

  if (segments.length === 0) return null;

  return path.join(...segments);
};


//Writes a collection of files into a sandbox directory, returns sandbox dir.
export const writeSandboxFiles = async (
  sandboxId: string,
  files: fileCollection
): Promise<string> => {
  const sandboxDir = await ensureSandbox(sandboxId);

  await Promise.all(
    Object.entries(files).map(async ([rawPath, content]) => {
      const cleanedRelPath = sanitizeFilePath(rawPath);

      if (cleanedRelPath === null) {
        console.warn(`[sandbox] Skipping unsafe or empty path: "${rawPath}"`);
        return;
      }

      const absoluteFilePath = path.join(sandboxDir, cleanedRelPath);
      const parentDir = path.dirname(absoluteFilePath);

      await fs.mkdir(parentDir, { recursive: true });
      await fs.writeFile(absoluteFilePath, content, "utf-8");
    })
  );

  return sandboxDir;
};

export type SandboxFileEntry = { path: string; content: string };

// -> reads filePaths from sandbox, returns { path, content }[] skipping unsafe or unreadable paths
export const readSandboxFiles = async (
  sandboxId: string,
  filePaths: string[]
): Promise<SandboxFileEntry[]> => {
  const sandboxDir = await ensureSandbox(sandboxId);

  const results = await Promise.all(
    filePaths.map(async (rawPath): Promise<SandboxFileEntry | null> => {
      const cleanedRelPath = sanitizeFilePath(rawPath);

      if (cleanedRelPath === null) {
        console.warn(`[sandbox] readSandboxFiles: skipping unsafe or empty path "${rawPath}"`);
        return null;
      }

      try {
        const content = await fs.readFile(path.join(sandboxDir, cleanedRelPath), "utf-8");
        return { path: cleanedRelPath, content };
      } catch (err) {
        console.warn(
          `[sandbox] readSandboxFiles: could not read "${cleanedRelPath}" —`,
          (err as NodeJS.ErrnoException).code ?? err
        );
        return null;
      }
    })
  );

  return results.filter((entry): entry is SandboxFileEntry => entry !== null);
};

//Synchronous variant to ensure a sandbox directory exists under sandboxRoot.
export const ensureSandboxSync = (sandbox: string): string => {
  const sandboxPath = path.isAbsolute(sandbox)
    ? sandbox
    : path.resolve(sandboxRoot, sandbox);

  if (!fsSync.existsSync(sandboxPath)) {
    fsSync.mkdirSync(sandboxPath, { recursive: true });
  }

  return sandboxPath;
};


export async function readSandboxTree(sandboxId: string): Promise<fileCollection> {
  const root = path.join(sandboxRoot, sandboxId);
  const files: fileCollection = {};

  const walk = async (curr: string) => {
    let entries = [];

    try {
      entries = await fs.readdir(curr, { withFileTypes: true });
    } catch {
      return
    }

    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const fullPath = path.join(curr, entry.name)
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        await walk(fullPath);
      }

      if (!entry.isFile() || SKIP_FILES.has(entry.name)) {
        continue;
      }

      try {
        const stat = await fs.stat(fullPath);
        if (stat.size > MAX_TRCKED_BYTE_SIZE) continue

        files[path.relative(root, fullPath)] = await fs.readFile(fullPath, "utf-8")
      } catch {

      }
    }

  }
  await walk(root)

  return files;
}

const execAsync = promisify(exec);

const COMMAND_TIMEOUT_MS = 60_000;
const COMMAND_MAX_OUTPUT_BYTES = 1024 * 1024; // 1 MB

// -> runs a shell command inside the sandbox dir; never throws — returns stdout on success, descriptive error string on failure
export const runSandboxCommand = async (
  sandboxId: string,
  command: string
): Promise<string> => {
  const sandboxDir = await ensureSandbox(sandboxId);

  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: sandboxDir,
      timeout: COMMAND_TIMEOUT_MS,
      maxBuffer: COMMAND_MAX_OUTPUT_BYTES,
    });

    return stdout.trim() || stderr.trim();
  } catch (err) {
    const e = err as NodeJS.ErrnoException & { stdout?: string; stderr?: string };
    const parts = [
      `[error] ${e.message}`,
      e.stdout?.trim() && `[stdout] ${e.stdout.trim()}`,
      e.stderr?.trim() && `[stderr] ${e.stderr.trim()}`,
    ].filter(Boolean);

    return parts.join("\n");
  }
};

