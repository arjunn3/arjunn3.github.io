---
title: Repairing malformed LLM output
product: TipTap sanitizer at Orfiq
summary: A deterministic repair layer for the rich-text JSON that models generate, fixing broken tables, lists and links before they can crash the editor while keeping the content.
year: 2026
group: orfiq
area: documents
order: 4
status: published
ownership: owner
role: Wrote most of the repair layer and its tests
stack: [Python, ProseMirror / TipTap, Pytest]
code: private
codeNote: Private to Orfiq. This page describes the design; no code is shown.
visual: diff
highlights:
  - Recursive repair of model-generated document trees, covering swallowed blocks, nested rows, invalid list items and HTML-style links.
  - Content is moved to where the schema allows it rather than deleted. Only invalid control characters are stripped.
  - Repairs instead of regenerating, so a fix costs nothing and gives the same answer every time.
  - A test for each repair, plus tracing, so problems show up in monitoring rather than in someone's editor.
steps:
  - title: Clean the text
    text: Strip control characters and fill empty text nodes, which the editor refuses to load.
  - title: Repair the tree
    text: Lift headings and paragraphs out of tables that swallowed them, flatten rows nested inside rows, fix list items, and turn HTML-style links into proper link marks.
  - title: Hand over a valid document
    text: The editor receives a document that matches its schema, with its content kept.
---

## Context

Rich-text editors such as ProseMirror (which TipTap is built on) don't store HTML. They store a JSON tree with a strict schema: which node may contain which, what attributes are allowed, and so on. When an LLM writes course content in that format, it gets the tree subtly wrong surprisingly often.

## The challenge

- **One mistake swallows a page.** An unclosed table absorbs every heading and paragraph after it.
- **Plausible but invalid shapes.** Rows nested inside rows, list items that aren't list items, links written as HTML-style nodes, stray control characters, empty text nodes.
- **High stakes, high volume.** Any of these can crash the editor or scramble the layout, and every generated document goes through it.

## Key decisions

- **Repair, don't re-prompt.** Regenerating a whole document because one table is malformed is slow and expensive, and it can fail the same way twice. A tree repair is instant and deterministic.
- **Preserve content.** Blocks swallowed by a table are lifted back out in their original order, and nested rows become siblings. Content is moved, not deleted, to make the schema pass.
- **Run before saving.** The repair layer runs on generated documents before they are saved: a gate, not a clean-up job someone remembers to run.
- **Make it observable.** Each repair is covered by its own test, and the sanitise-and-validate step is traced, so new failure shapes show up in monitoring.

## Outcome

- The malformed structures that used to crash the editor or scramble layouts are repaired before anyone sees them.
- The same input always produces the same repaired document, at no extra model cost.

## What I learned

Treat model output like any other untrusted input: validate it against a schema and repair it deterministically wherever you can, rather than asking the model to try again.
