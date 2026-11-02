import path from "node:path";

export const sandboxRoot = path.resolve(__dirname, "../../../data/sandbox");
export const LOCAL_USER_ID = "local-user-id";


export const SKIP_DIRS = new Set([
  // Package managers / dependencies
  "node_modules",
  ".pnp",
  ".yarn",
  "bower_components",
  "vendor",           // PHP / Go deps

  // Version control
  ".git",
  ".svn",
  ".hg",

  // IDE / editor internals
  ".idea",
  ".vscode",
  ".cursor",
  ".agent",

  // Build / output artifacts
  "dist",
  "build",
  "out",
  ".next",
  ".nuxt",
  ".svelte-kit",
  ".turbo",
  ".cache",
  "coverage",
  ".nyc_output",
  "storybook-static",

  // OS / system
  ".DS_Store",
  "__MACOSX",

  // Misc tooling
  ".vercel",
  ".netlify",
  "tmp",
  "temp",
]);
export const SKIP_FILES = new Set([
  // Lock files (large, machine-generated)
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lockb",
  "composer.lock",
  "Gemfile.lock",
  "poetry.lock",
  "Cargo.lock",

  // Secrets / environment
  ".env",
  ".env.local",
  ".env.development",
  ".env.development.local",
  ".env.test",
  ".env.test.local",
  ".env.production",
  ".env.production.local",
  ".env.staging",

  // Compiled / binary outputs
  ".DS_Store",
  "Thumbs.db",
  "desktop.ini",

  // TypeScript / JS build info
  "tsconfig.tsbuildinfo",

  // Editor state files
  ".eslintcache",
  ".stylelintcache",
  ".prettiercache",
]);
export const SKIP_EXTENSIONS = new Set([
  // Images
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".ico", ".svg", ".tiff",
  // Video / audio
  ".mp4", ".mov", ".avi", ".mkv", ".mp3", ".wav", ".ogg", ".flac",
  // Archives
  ".zip", ".tar", ".gz", ".bz2", ".7z", ".rar",
  // Compiled binaries
  ".exe", ".dll", ".so", ".dylib", ".bin", ".o", ".a",
  // Documents
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
  // Database / blobs
  ".sqlite", ".db", ".wasm",
  // Fonts
  ".ttf", ".otf", ".woff", ".woff2", ".eot",
]);
export const MAX_TRCKED_BYTE_SIZE = 1024 * 1024 * 10; // 10 MB