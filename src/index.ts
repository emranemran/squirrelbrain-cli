import { ApiFailure } from "./api";
import * as core from "./commands/core";
import { login } from "./commands/login";
import { fail, setPretty } from "./output";

const HELP = {
  usage: "squirrel <command> [args] [--pretty]",
  commands: [
    "login | logout | whoami | capabilities | categories | status",
    'search "<query>" [--limit N] [--full]',
    'related "<work context>" [--limit N] [--full]',
    'gather "<topic>" [--budget N]     (synthesis-ready context bundle)',
    "filter [--author A] [--category C] [--tag T] [--since D] [--until D] [--limit N]",
    "get <bookmark_id>",
    "recent [--days N] [--limit N]",
    "actions [--status pending|done|snoozed|dismissed] [--limit N]",
    "mark <bookmark_id> --done|--snooze|--dismiss",
    "digest preview",
    "config",
  ],
  docs: "Run `squirrel capabilities` for the machine-readable catalog.",
};

interface Parsed {
  positional: string[];
  flags: Record<string, string | boolean>;
}

function parseArgs(argv: string[]): Parsed {
  const positional: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(a);
    }
  }
  return { positional, flags };
}

const num = (v: string | boolean | undefined) =>
  typeof v === "string" && Number.isFinite(Number(v)) ? Number(v) : undefined;
const str = (v: string | boolean | undefined) => (typeof v === "string" ? v : undefined);

async function main(): Promise<void> {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  if (flags.pretty) setPretty(true);
  const [cmd, ...rest] = positional;

  switch (cmd) {
    case "login":
      return login();
    case "logout":
      return core.logout();
    case "whoami":
      return core.whoami();
    case "capabilities":
      return core.capabilities();
    case "categories":
      return core.categories();
    case "search": {
      const q = rest.join(" ").trim();
      if (!q) fail("invalid_args", 'Usage: squirrel search "<query>" [--limit N] [--full]');
      return core.search(q, num(flags.limit), Boolean(flags.full));
    }
    case "related": {
      const context = rest.join(" ").trim();
      if (!context) fail("invalid_args", 'Usage: squirrel related "<work context>" [--limit N] [--full]');
      return core.related(context, num(flags.limit), Boolean(flags.full));
    }
    case "gather": {
      const topic = rest.join(" ").trim();
      if (!topic) fail("invalid_args", 'Usage: squirrel gather "<topic>" [--budget N]');
      return core.gather(topic, num(flags.budget));
    }
    case "filter":
      return core.filter({
        author: str(flags.author),
        category: str(flags.category),
        tag: str(flags.tag),
        since: str(flags.since),
        until: str(flags.until),
        limit: num(flags.limit),
      });
    case "get": {
      if (!rest[0]) fail("invalid_args", "Usage: squirrel get <bookmark_id>");
      return core.get(rest[0]);
    }
    case "recent":
      return core.recent(num(flags.days), num(flags.limit));
    case "actions":
      return core.actions(str(flags.status), num(flags.limit));
    case "mark": {
      if (!rest[0]) fail("invalid_args", "Usage: squirrel mark <bookmark_id> --done|--snooze|--dismiss");
      const status = flags.done ? "done" : flags.snooze ? "snoozed" : flags.dismiss ? "dismissed" : null;
      if (!status) fail("invalid_args", "One of --done, --snooze, --dismiss is required");
      return core.mark(rest[0], status);
    }
    case "status":
      return core.syncStatus();
    case "digest": {
      if (rest[0] !== "preview") fail("invalid_args", "Usage: squirrel digest preview");
      return core.digestPreview();
    }
    case "config":
      return core.configShow();
    case "help":
    case undefined:
      console.log(JSON.stringify(HELP, null, 2));
      return;
    default:
      fail("unknown_command", `Unknown command '${cmd}'. Run squirrel help.`);
  }
}

main().catch((err) => {
  if (err instanceof ApiFailure) fail(err.code, err.message);
  fail("internal", (err as Error).message ?? String(err));
});
