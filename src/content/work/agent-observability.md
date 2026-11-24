---
title: Agent retry observability
product: Platform work at Orfiq
summary: Surfacing the silent validation retries inside LLM agents as structured logs and telemetry, so a slow run can explain itself.
year: 2026
group: orfiq
area: reliability
order: 8
status: published
ownership: owner
role: Built it
stack: [PydanticAI, Logfire, Loguru]
code: private
codeNote: Private to Orfiq. This page describes the design; no code is shown.
visual: retries
highlights:
  - Exposes the retries agent frameworks hide, showing which field failed validation, why, and on which turn.
  - Each retry becomes both a structured log line and a telemetry event, so it shows up on dashboards.
  - Tested against both clean first-turn runs and retry loops.
---

## Context

Agent frameworks like PydanticAI validate a model's output against a schema. When the output doesn't fit, the framework quietly sends the error back to the model and asks again. That is great for robustness and terrible for visibility: from the outside, the run just looks slow and expensive.

## The challenge

Nobody could answer basic questions: which agents retry, which fields keep failing, and how often a run succeeds on the first turn.

## Key decisions

- **Read what the framework already records.** A finished run keeps its full message history, including the retry prompts, so no extra calls or wrappers are needed.
- **Extract the useful parts.** For each retry: the field that failed, the validation error, and the turn it happened on.
- **Send it two places.** A structured warning in the logs for debugging, and a telemetry event in Logfire for trends and dashboards.

## Outcome

- Retries are visible per agent, per field and per turn.
- The prompts and schemas that cause the most retries are easy to find.

## What I learned

You can't improve what you can't see. Once retries were visible, it was clear where to look.
