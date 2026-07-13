// All read/query commands — thin translations of CLI args to API calls.
import { request } from "../api";
import { clearConfig, readConfig } from "../config";
import { emit } from "../output";
import type { Bookmark } from "../types";

export async function logout(): Promise<void> {
  clearConfig();
  emit({ ok: true, message: "Logged out; local token removed." });
}

export async function whoami(): Promise<void> {
  const res = await request<{ user: { email: string; plan: string; bookmark_count: number } }>(
    "/auth/me",
  );
  emit({ email: res.user.email, plan: res.user.plan, bookmark_count: res.user.bookmark_count });
}

export async function capabilities(): Promise<void> {
  emit(await request("/capabilities"));
}

export async function categories(): Promise<void> {
  emit(await request("/bookmarks/categories"));
}

export async function search(query: string, limit?: number, full?: boolean): Promise<void> {
  const params = new URLSearchParams({ q: query });
  if (limit) params.set("limit", String(limit));
  if (full) params.set("full_text", "1");
  emit(await request<{ results: Bookmark[] }>(`/bookmarks/search?${params}`));
}

export async function related(context: string, limit?: number, full?: boolean): Promise<void> {
  const params = new URLSearchParams({ context });
  if (limit) params.set("limit", String(limit));
  if (full) params.set("full_text", "1");
  emit(await request<{ results: Bookmark[] }>(`/bookmarks/related?${params}`));
}

export async function gather(topic: string, budget?: number): Promise<void> {
  const params = new URLSearchParams({ topic });
  if (budget) params.set("budget", String(budget));
  emit(await request(`/bookmarks/gather?${params}`));
}

export async function filter(opts: {
  author?: string;
  category?: string;
  tag?: string;
  cluster_id?: number;
  sort?: string;
  since?: string;
  until?: string;
  limit?: number;
}): Promise<void> {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(opts)) if (v !== undefined) params.set(k, String(v));
  emit(await request<{ total: number; count: number; results: Bookmark[] }>(`/bookmarks/filter?${params}`));
}

export async function get(id: string): Promise<void> {
  emit(await request<{ bookmark: Bookmark }>(`/bookmarks/${encodeURIComponent(id)}`));
}

export async function recent(days?: number, limit?: number): Promise<void> {
  const params = new URLSearchParams();
  if (days) params.set("days", String(days));
  if (limit) params.set("limit", String(limit));
  emit(await request<{ results: Bookmark[] }>(`/bookmarks/recent?${params}`));
}

export async function actions(status?: string, limit?: number): Promise<void> {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (limit) params.set("limit", String(limit));
  emit(await request<{ results: Bookmark[] }>(`/actions?${params}`));
}

export async function mark(id: string, status: "done" | "snoozed" | "dismissed"): Promise<void> {
  emit(
    await request<{ bookmark: Bookmark }>(`/actions/${encodeURIComponent(id)}/mark`, {
      method: "POST",
      body: { status },
    }),
  );
}

export async function syncStatus(): Promise<void> {
  emit(await request("/extension/status"));
}

export async function digestPreview(): Promise<void> {
  emit(await request("/digest/preview"));
}

export function configShow(): void {
  const cfg = readConfig();
  emit({ apiUrl: process.env.SQUIRREL_API_URL || cfg.apiUrl || null, email: cfg.email ?? null, hasToken: Boolean(cfg.token) });
}
