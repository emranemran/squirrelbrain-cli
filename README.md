# Squirrel CLI

*Stop squirreling away your X bookmarks.* This is the command-line client for
[Squirrel](https://github.com/emranemran/squirrelbrain-cli) — your X/Twitter bookmarks as a
searchable, semantic memory that surfaces inside Claude Code, Codex, and your terminal.

## Install

As an agent skill (Claude Code / Codex):

```bash
npx skills add emranemran/squirrelbrain-cli
```

Standalone:

```bash
npm i -g @squirrelbrain/cli
squirrel login
```

Or one-off: `npx -y @squirrelbrain/cli search "rate limiting"`

## Usage

Every command prints JSON (add `--pretty` for humans). Non-zero exit + `{error, message}` on failure.

```bash
squirrel login                 # device-flow; opens browser; stores token in ~/.squirrel/
squirrel whoami                # {email, plan, bookmark_count}
squirrel capabilities          # machine-readable catalog of everything below

squirrel search "vector databases" --limit 5
squirrel related "building a rate limiter in Hono"    # surface saves relevant to current work
squirrel filter --author sre_diaries --since 2026-01-01
squirrel get <bookmark_id>
squirrel recent --days 14
squirrel actions --status pending
squirrel mark <bookmark_id> --done

squirrel status                # sync state
squirrel digest preview        # what the next weekly email would contain
```

## Config

- Token + settings live in `~/.squirrel/config.json` (0600).
- `SQUIRREL_API_URL` env var overrides the API endpoint (self-host/dev).

## Development

```bash
bun install
bun run build        # bundles to dist/index.js (runs on node >= 18)
bun link             # puts a dev `squirrel` on your PATH
```

The CLI is a thin client over the public HTTP API — it contains no product logic and no secrets.
