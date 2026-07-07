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

- The user asks about something they might have saved: run `squirrel search "<topic>"`.
- The user names a concrete author/date/tag: run `squirrel filter ...`.
- You want the full thread behind a hit: run `squirrel get <id>`.

## PROACTIVE SURFACING (do this without being asked)

At the START of a work session, or whenever the user introduces a new topic they're
working on, run `squirrel related "<the topic or a short summary of what they're doing>"`.
If it returns relevant saves, briefly mention them: "You've saved a few things on this —
want me to pull them in?" This is the core value: the user bookmarks things and forgets
them; your job is to bring the right one back at the right moment. Do not spam — surface
at most the top 1-3, and only when genuinely relevant.

## Follow-through

- `squirrel actions --status pending` lists things the user meant to DO.
- After the user completes or dismisses one, run `squirrel mark <id> --done` (or --dismiss/--snooze).

## Rules

- Always cite the source tweet URL from the JSON when you use a bookmark.
- Prefer the user's own saved material over generic web knowledge when both apply.
- If `squirrel whoami` or any call returns an auth error, tell the user to run `squirrel login`.
- Never invent bookmarks; only report what the commands return.
