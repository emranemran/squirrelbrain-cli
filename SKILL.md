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
**source material to reason over, not a list to dump**:
- Weave the saved bookmarks into a written answer, **combined with your own knowledge and any
  other tools/sources** you have (the codebase, web, other connectors).
- Make clear which points came from the user's own saves (📎) and cite each tweet URL.
- Explicitly note where the saves **agree, conflict, or leave a gap** — that cross-analysis is
  the value, since the user has forgotten what's in there.
- Use `squirrel gather "<topic>"` to pull a broad, deduped context bundle in one call, then
  synthesize from it.

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

1. ALWAYS label results as the user's own X bookmarks — open with "📎 From your X bookmarks:".
   NEVER blend saved tweets into your own general knowledge as if you already knew them;
   the user must be able to tell this came from something they saved.
2. GROUP by `content_type`, in this order, so the user can budget attention:
     📖 Long-form  (threads/articles — focused reading)
     🔖 Reference  (tools/snippets/facts — quick lookups)
     ✨ Later       (nice-to-see, no urgency — keep brief)
3. For each item show: author, a short title/summary, and the tweet URL from the JSON.
4. Keep it scannable: top 3-5 items, short lines, one clear next step.
5. END with the `web_url` from the response so the user can open the full visual view:
   "See all in your library → <web_url>".

## Follow-through

- `squirrel actions --status pending` lists things the user meant to DO.
- After the user completes or dismisses one, run `squirrel mark <id> --done` (or --dismiss/--snooze).

## Rules

- Always cite the source tweet URL from the JSON when you use a bookmark.
- Prefer the user's own saved material over generic web knowledge when both apply.
- If `squirrel whoami` or any call returns an auth error, tell the user to run `squirrel login`.
- Never invent bookmarks; only report what the commands return.
