/**
 * Loads optional `.grok/app-env.json` (VITE_* string keys only), merges it under
 * the real process.env (process wins), then runs the remaining argv as a child.
 */
import { spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const APP_ENV_REL_PATH = join(".grok", "app-env.json");

export function projectRoot() {
  return resolve(dirname(fileURLToPath(import.meta.url)), "..");
}

export function parseAppEnv(raw) {
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    const out = {};
    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith("VITE_") && typeof value === "string") {
        out[key] = value;
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function readAppEnv(root = projectRoot()) {
  const file = join(root, APP_ENV_REL_PATH);
  if (!existsSync(file)) return {};
  try {
    return parseAppEnv(readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

export function mergeAppEnv(fileEnv, processEnv) {
  return { ...fileEnv, ...processEnv };
}

function isMain() {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    const thisFile = resolve(fileURLToPath(import.meta.url));
    const invoked = resolve(entry);
    return thisFile === invoked || (thisFile.endsWith("with-app-env.mjs") && invoked.endsWith("with-app-env.mjs"));
  } catch {
    return false;
  }
}

function run() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("[with-app-env] usage: node scripts/with-app-env.mjs command [args...]");
    process.exit(1);
  }

  const root = projectRoot();
  const fileEnv = readAppEnv(root);
  const env = mergeAppEnv(fileEnv, process.env);

  const command = args[0];
  const commandArgs = args.slice(1);

  let cmd = command;
  let cmdArgs = commandArgs;
  const isWin = process.platform === "win32";

  if (command === "vite" || command.endsWith("\\vite") || command.endsWith("/vite")) {
    const localVite = join(root, "node_modules", ".bin", isWin ? "vite.cmd" : "vite");
    if (existsSync(localVite)) {
      cmd = localVite;
    } else {
      cmd = isWin ? "npx.cmd" : "npx";
      cmdArgs = ["vite", ...commandArgs];
    }
  }

  const child = spawn(cmd, cmdArgs, {
    env,
    cwd: root,
    stdio: "inherit",
    shell: isWin,
  });

  const forward = (signal) => {
    if (!child.killed) {
      try { child.kill(signal); } catch {}
    }
  };

  process.on("SIGINT", () => forward("SIGINT"));
  process.on("SIGTERM", () => forward("SIGTERM"));

  child.on("error", (err) => {
    console.error(`[with-app-env] failed to run ${command}:^`, err.message);
    process.exit(1);
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 1);
  });
}

if (isMain()) {
  run();
}

