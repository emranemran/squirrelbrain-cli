let pretty = false;

export function setPretty(v: boolean): void {
  pretty = v;
}

export function emit(data: unknown): void {
  console.log(pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data));
}

export function fail(error: string, message: string): never {
  console.log(JSON.stringify({ error, message }));
  process.exit(1);
}

/** Human-facing progress goes to stderr so stdout stays pure JSON. */
export function note(message: string): void {
  console.error(message);
}
