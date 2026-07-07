import { apiUrl, readConfig } from "./config";

export class ApiFailure extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function request<T>(
  path: string,
  opts: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { method = "GET", body, auth = true } = opts;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (auth) {
    const token = readConfig().token;
    if (!token) {
      throw new ApiFailure("unauthorized", "Not logged in. Run `squirrel login` first.", 401);
    }
    headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${apiUrl()}${path}`, {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (err) {
    throw new ApiFailure("network", `Could not reach ${apiUrl()} — ${(err as Error).message}`, 0);
  }

  const json = (await res.json().catch(() => null)) as
    | (T & { error?: string; message?: string })
    | null;

  if (!res.ok) {
    const code = json?.error ?? `http_${res.status}`;
    const message =
      res.status === 401
        ? "Auth failed or token expired. Run `squirrel login`."
        : (json?.message ?? `API returned ${res.status}`);
    throw new ApiFailure(code, message, res.status);
  }
  if (json === null) throw new ApiFailure("bad_response", "API returned non-JSON response", res.status);
  return json;
}
