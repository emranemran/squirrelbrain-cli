import { spawn } from "node:child_process";
import { hostname, platform } from "node:os";
import { request } from "../api";
import { readConfig, writeConfig } from "../config";
import { emit, fail, note } from "../output";

interface StartResponse {
  device_code: string;
  user_code: string;
  verify_url: string;
  interval: number;
  expires_in: number;
}

function openBrowser(url: string): void {
  const cmd = platform() === "darwin" ? "open" : platform() === "win32" ? "start" : "xdg-open";
  try {
    spawn(cmd, [url], { stdio: "ignore", detached: true }).unref();
  } catch {
    // best-effort; the URL is printed either way
  }
}

export async function login(): Promise<void> {
  const start = await request<StartResponse>("/cli/auth/start", {
    method: "POST",
    auth: false,
    body: { label: `${hostname()} (${platform()})` },
  });

  note(`\nTo authorize this device, visit:\n\n  ${start.verify_url}\n\nand enter code: ${start.user_code}\n`);
  openBrowser(start.verify_url);
  note("Waiting for authorization…");

  const deadline = Date.now() + start.expires_in * 1000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, start.interval * 1000));
    const res = await fetch(
      `${(await import("../config")).apiUrl()}/cli/auth/poll?device_code=${start.device_code}`,
    );
    if (res.status === 202) continue;
    if (res.status === 200) {
      const { token } = (await res.json()) as { token: string };
      writeConfig({ ...readConfig(), token });
      const me = await request<{ user: { email: string; plan: string; bookmark_count: number } }>(
        "/auth/me",
      );
      writeConfig({ ...readConfig(), token, email: me.user.email });
      emit({ ok: true, email: me.user.email, plan: me.user.plan });
      return;
    }
    const err = (await res.json().catch(() => null)) as { message?: string } | null;
    fail("login_failed", err?.message ?? `Login failed (${res.status})`);
  }
  fail("expired", "Device code expired. Run `squirrel login` again.");
}
