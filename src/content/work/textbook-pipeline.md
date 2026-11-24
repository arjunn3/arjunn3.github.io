---
title: Textbook generation pipeline
product: Textbook v2 at Orfiq
summary: A three-stage LLM pipeline that drafts complete textbooks from a knowledge graph, with coverage checked by code, an independent model reviewing every chapter, and jobs that survive crashes.
year: 2026
group: orfiq
area: grounded-generation
order: 1
featured: true
status: published
ownership: owner
role: Designed and built the whole system
stack: [Python, FastAPI, PydanticAI, Neo4j, Azure Blob Storage]
code: private
codeNote: Private to Orfiq. This page describes the design; no code is shown.
visual: graph-steps
highlights:
  - Designed and built it end to end, as three background stages that each resume per chapter.
  - Coverage is enforced by code, not trusted to the model, so every required topic lands in exactly one chapter.
  - A second, independent model reviews each chapter. Only safety, accuracy, coverage and sourcing problems block it, and fixes are verified rather than re-reviewed.
  - Atomic job claims, crash-recovery copies and per-stage token accounting keep long, expensive runs safe and their cost visible.
steps:
  - title: Outline
    text: A model groups the required topics into chapters. A code audit rejects the outline unless every topic is placed exactly once.
  - title: Blueprint
    text: For each chapter, a model plans the sections, depth, figures and the facts that need checking. Code then fills in the exact references from the graph.
  - title: Chapter
    text: Evidence search, a one-pass draft, code checks, an independent review and one targeted rewrite, then sourced values and images. A human expert signs off.
---

## Context

Writing a textbook is a coverage problem before it is a writing problem: it has to teach everything a syllabus requires, in a sensible order, at the right depth, with evidence for every claim. Here the syllabus is a medical curriculum of hundreds of specific requirements, which Orfiq stores as a knowledge graph. The goal: draft a complete book from that graph, so subject experts edit and approve instead of writing from scratch.

## The challenge

- **Coverage at scale.** One prompt can't plan a whole book, and models quietly drop or invent requirements.
- **Trust.** Medical text needs evidence, consistent terminology and a review trail, not just fluent prose.
- **Long, expensive runs.** Each chapter takes minutes and real money. Crashes, duplicate jobs and retries must not waste either.

## Key decisions

- **The graph decides scope; models write and judge.** Requirements, references and numbering come from the graph and from code. Models never invent or change them.
- **No silent fallbacks.** A failed audit, bad output or storage error fails the job with a readable reason, rather than quietly shipping a worse book.
- **Lean, independent review.** A separate model lists defects in six categories, and only four of them can block a chapter. Blocking sections are rewritten once, and the second review checks those specific fixes instead of starting over.
- **Evidence is verified by code.** A missing value is filled only from a recognised source such as a health body, guideline publisher or journal, and only if its numbers and units actually appear in the source text.
- **Concurrency without stuck locks.** Chapters are claimed with an atomic, conditional write, so a second job gets a clear conflict instead of duplicating work. Finished work is saved immediately, so a crashed chapter resumes without paying twice.
- **Cost as a feature.** Prompts are ordered so the shared parts can be served from cache, each stage can run on its own model, and token use is recorded per stage, failed attempts included.

## What I built

Three background stages behind a REST API. Each chapter's state is tracked, so the interface always knows what is drafting, in review or approved. Editorial profiles for 19 subjects encode teaching order, visual emphasis and which authorities to search, alongside global rules for drug names, units and terminology. Figures are generated four at a time with retries, and if a provider refuses a prompt on content-policy grounds, the pipeline retries once with a softened prompt and otherwise leaves a placeholder for an expert.

## Outcome

- A whole subject can be outlined, planned and drafted chapter by chapter, and every chapter reaches expert review with a quality report attached.
- Jobs can run side by side and survive worker crashes, without duplicated work or chapters left locked.
- It is in active development; experts review chapters before anything is released.

## What I learned

Put structure in code and judgement in the model. The audits, claims and checks are what make a generated book trustworthy; the prose is the easy part.
