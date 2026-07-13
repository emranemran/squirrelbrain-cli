---
name: squirrel
description: >
  The user's X/Twitter bookmarks as a searchable, semantic memory. Use it to answer from
  what the user has already saved, and to PROACTIVELY surface relevant saves they have
  forgotten — at the start of a work session or whenever they introduce a new topic.
---

# Squirrel — your saved-bookmark memory

Squirrel gives you the user's X/Twitter bookmarks as a searchable, semantic memory.
Use it to answer from what the user has already saved, and — importantly —
to PROACTIVELY surface relevant saves the user has forgotten.

The `squirrel` command must be installed (`npm i -g @squirrelbrain/cli`); if it is
missing, run one-off commands with `npx -y @squirrelbrain/cli <cmd>`.

## First, orient (discovery-first)

Run `squirrel capabilities` to get the full command catalog and JSON shapes.
Run `squirrel categories` to see the user's topic clusters. All commands output JSON.

## Pick the right tool: FIND a few vs. LIST them all

- **"Find / what did I save about X"** (a few relevant) → `squirrel search "<topic>"`
  (hybrid semantic + keyword, diversified). Returns a **ranked sample**, not everything.
- **"All my X / how many X / show me every X"** (enumerate) → `squirrel filter --tag <x>`.
  Filter is EXHAUSTIVE and returns a `total` count. **Semantic search UNDER-counts** — it
  caps at a limit and diversifies away similar items, so never use it to answer "how many."
- **NEVER state a search's results as a total.** If you only ran `search`, say "here are a
  few" — to answer "is that all?" or "how many," run `filter --tag` and report its `total`.
  (e.g. searching "recipes" may surface 4; `filter --tag recipe` reveals 38.)

## Ranking by popularity, and NOT over-filtering

- **Popularity is real data.** Every bookmark carries `likes` and `retweets` (the tweet's
  public counts). To answer "my most popular / top / most-liked saves about X", use
  `squirrel filter --tag <x> --sort popular` (exhaustive, ranked by likes) — never claim you
  can't rank by popularity.
- **Tags (incl. "long-form"/"reference") are SOFT labels, never hard gates.** When the user asks
  broadly ("my essays / articles / long-form writing on X"), do NOT gate to one tag or one
  cluster and stop — a link-only save may lack the "long-form" tag yet still be a long essay.
  Instead `gather`/search across the topic, then use the `long-form` tag + `likes` to order and
  label — not to exclude. `filter --tag long-form` is fine when the user explicitly wants tagged
  long reads. If you narrowed and the user says "you missed X", widen (drop the tag/cluster gate).

## The user's categories are THEIRS, not a fixed list

`squirrel categories` returns the user's own **emergent topic clusters**, generated from their
bookmarks and LLM-named — there is no fixed taxonomy. To list everything in one, use its id:
`squirrel filter --cluster <id>`. Prefer these clusters + the free-form `tags` over the legacy
fixed `category` field when grouping or enumerating.

## When to use Squirrel

- The user asks about something they might have saved: run `squirrel search "<topic>"`
  (hybrid semantic + keyword; results are diversified into distinct angles).
- The user wants a **summary/synthesis** of what they've saved on a subject
  ("what do I know about X", "brief me on Y from my bookmarks"): run
  `squirrel gather "<topic>"` — a diverse, de-duplicated, token-budgeted bundle plus the
  topic clusters it spans. Add `--full` to search/related for full thread text.
- The user names a concrete author/date/tag: run `squirrel filter ...`.
- You want the full thread behind a hit: run `squirrel get <id>`.

## SYNTHESIZE, don't just list (when the user asked a question)

When the user asks a real question — not just "what did I save" — treat Squirrel's results as
**source material to reason over**, combining them with your own knowledge and any other
tools/sources you have (the codebase, web, other connectors). Use `squirrel gather "<topic>"`
to pull a broad, deduped bundle in one call, then synthesize from it.

**But synthesize deeply UNDER the surface — deliver it LAYERED, not as a wall of text.** The
user is neurodivergent; a 500-word answer recreates the overwhelm this tool exists to remove.
Do the full analysis internally, then present it progressively (see HOW TO PRESENT below):
lead with a short answer, and let the user pull the detail.

## PROACTIVE SURFACING (do this without being asked)

At the START of a work session, or whenever the user introduces a new topic they're
researching or building — "teach me about…", "explain…", "I'm working on…", "help me
build/debug…", "what do I know about…" — run
`squirrel related "<the topic or a short summary of what they're doing>"`.
If it returns relevant saves, surface them. This is the core value: the user bookmarks
things and forgets them; your job is to bring the right one back at the right moment. Do
not spam — surface at most the top 1-3 proactively, and only when genuinely relevant.
A plain `squirrel related "..."` also stays available as an explicit escape hatch.

## HOW TO PRESENT RESULTS (important — this is the ADHD-friendly part)

The user is neurodivergent. Long, dense answers cause the exact overwhelm this tool removes.
Follow evidence-based cognitive-accessibility rules: **lead with the answer, chunk hard,
bullets over prose, and let the user pull detail** (progressive disclosure).

**Always:**
1. Label results as the user's own X bookmarks — open with "📎 From your X bookmarks:".
   NEVER silently blend saved tweets into your own general knowledge.
2. **Every save you mention MUST be a clickable markdown link** so the user can open the
   source in one click. Link the author handle (or a short title) to that item's `url` field —
   e.g. `[@Raytar](https://x.com/Raytar/status/123…)`. NEVER write a bare `@handle` or title
   without linking it. This is a hard requirement — the user relies on these to reopen sources.
   Show author + a short summary, not the full text.
3. Short lines. Plain, literal language (avoid idioms/metaphors). One idea per bullet.
4. END with a link to the exact saves you cited, as a real markdown link. Build it from the
   ids you referenced: `[See these in your library →](<APP_URL>/library?ids=<id1>,<id2>,…)`
   — that page shows exactly those tweets with their image previews. (Derive `<APP_URL>` from
   the response's `web_url` origin; if you only skimmed the whole topic, the response's plain
   `web_url` is an acceptable fallback.) Never use a placeholder like "check your library".

**For a quick surface (a few relevant saves):** the top 1–5 as bullets. If some are tagged
"long-form", you can note it (📖) so the user knows which need focused reading. Then stop.

**For a synthesis / "what do I know about X" (many saves):** deliver it in LAYERS —
- **Layer 1 (default): a headline + 3–5 bullets + one gap/tension. ~120 words, then STOP.**
  Do not pour the whole analysis out at once.
- **Layer 2 (only if the user asks):** offer the deep dive as a menu, ideally the clusters
  `gather` returned — "Want me to go deeper on reading / math / homeschooling?" — and expand
  **one** at a time.
- Never emit one giant synthesis paragraph. If a section runs long, it becomes a Layer-2 pull.

## Follow-through

- `squirrel actions --status pending` lists things the user meant to DO.
- After the user completes or dismisses one, run `squirrel mark <id> --done` (or --dismiss/--snooze).

## Rules

- Always cite the source tweet URL from the JSON when you use a bookmark.
- Prefer the user's own saved material over generic web knowledge when both apply.
- If `squirrel whoami` or any call returns an auth error, tell the user to run `squirrel login`.
- Never invent bookmarks; only report what the commands return.
