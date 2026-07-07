import { chmodSync, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

// Baked default (set to the production URL at release; BUILD_SPEC §4).
// Resolution order: SQUIRREL_API_URL env > ~/.squirrel/config.json apiUrl > this.
export const DEFAULT_API_URL = "https://api.squirrelbrain.dev";

const CONFIG_DIR = join(homedir(), ".squirrel");
const CONFIG_PATH = join(CONFIG_DIR, "config.json");

export interface CliConfig {
  apiUrl?: string;
  token?: string;
  email?: string;
}

export function readConfig(): CliConfig {
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, "utf8")) as CliConfig;
  } catch {
    return {};
  }
}

export function writeConfig(config: CliConfig): void {
  mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n", { mode: 0o600 });
  chmodSync(CONFIG_PATH, 0o600);
}

export function clearConfig(): void {
  if (existsSync(CONFIG_PATH)) unlinkSync(CONFIG_PATH);
}

export function apiUrl(): string {
  return process.env.SQUIRREL_API_URL || readConfig().apiUrl || DEFAULT_API_URL;
}
