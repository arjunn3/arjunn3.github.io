---
title: Graph-grounded case generation
product: Linker Case at Orfiq
summary: An agent pipeline that writes teaching case studies using only facts fetched from a knowledge graph, so everything a case cites is a real, traceable record.
year: 2026
group: orfiq
area: grounded-generation
order: 2
status: published
ownership: owner
role: Designed and built the pipeline and its step-by-step API
stack: [Neo4j, Cypher, PydanticAI, FastAPI]
code: private
codeNote: Private to Orfiq. This page describes the design; no code is shown.
visual: pipeline
highlights:
  - Replaced model-written database queries with fixed, top-down graph queries, so retrieval became repeatable and every result is a real record.
  - A two-agent design. One agent sets explicit scope rules; another scores each candidate against them and writes down why.
  - In a test case, 450 candidates from the graph were narrowed to 18 (14 essential, 4 recommended), each with a written rationale.
  - A step-by-step API lets reviewers build and check a case one stage at a time. Invalid requests are rejected before any model runs.
steps:
  - title: Set the scope
    text: An agent writes explicit rules for the case, covering what must be included, what must be left out, how deep to go and which subjects apply.
  - title: Query the graph
    text: Fixed Cypher queries walk the graph from the top down. Direct matches are pinned before any model makes a choice.
  - title: Shortlist and write
    text: An agent scores every candidate against the scope rules and gives a rationale. The case is written only from that shortlist.
---

## Context

The goal is to generate case studies that connect several subjects at once: one patient, seen through physiology, pharmacology and medicine together. Each case has to cite the exact syllabus requirements it teaches, and those live in a knowledge graph in Neo4j, organised as subject, topic and requirement.

## The challenge

The first version used a common pattern called text-to-Cypher: ask a model to turn a plain question into a database query. It broke in three ways.

- **Non-determinism.** The same request produced different queries, so the same case came back with different requirements.
- **Look-alike matches.** A case about high blood pressure pulled in a liver condition that merely shares a word with it.
- **Missed connections.** For one infection it found no drug-related requirements at all, because the graph files drugs under their own topics, not under the disease.

## Key decisions

- **Fixed queries over generated ones.** The model decides what matters; the database fetches it with queries that never change. Retrieval became repeatable, and every result is a real record.
- **Narrow before you ask.** Topics that match the request directly are pinned automatically, so the model chooses from a short, relevant menu instead of the whole graph.
- **Guardrails first.** A scope agent writes explicit must-include and must-exclude rules before retrieval, so later steps can't drift.
- **Structured judgement.** Each shortlisted item carries a priority, a learning level and a written rationale, so reviewers can check the reasoning, not just the result.
- **Fail fast at the boundary.** A request naming a subject or stage that doesn't exist gets an immediate, explained error instead of failing deep inside the pipeline.

## Outcome

- In a test case on high blood pressure, 450 candidates came back from the graph and 18 were shortlisted (14 essential, 4 recommended). Every one is traceable to a record in the graph.
- Database retrieval no longer depends on a model writing queries, so it behaves the same way every time.

## What I learned

Let the model judge and let the database fetch. Models are good at deciding what a case is about; they are unreliable at writing the query that finds it.
