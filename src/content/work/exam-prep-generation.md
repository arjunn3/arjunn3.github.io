---
title: Exam-prep generation service
product: Revision sessions at Orfiq
summary: A background-job service that builds complete revision packs (summaries, mnemonics, exam-style questions and quizzes), grounded in a knowledge graph and web search.
year: 2026
group: orfiq
area: grounded-generation
order: 5
status: published
ownership: owner
role: Built the service end to end
stack: [FastAPI, PydanticAI, Azure Blob Storage]
code: private
codeNote: Private to Orfiq. This page describes the design; no code is shown.
visual: job
highlights:
  - Built the whole service, including the API, background jobs, agents, data models and prompts.
  - Generation takes minutes, so it runs as a background job with pollable status and requests never time out.
  - Every part of a pack is grounded in the syllabus graph and web search before it is written.
  - Strict schemas for every part, so malformed output is caught before it is saved.
steps:
  - title: Start a job
    text: The request is checked, a job record is saved, and its id comes straight back.
  - title: Build the pack in the background
    text: A worker finds the relevant syllabus requirements, searches the web for grounding, writes each part of the pack and generates its diagrams.
  - title: Check the status
    text: The app polls the job's status until the pack is ready, then loads it.
---

## Context

Before an exam, a student wants focused revision: the high-yield points of a topic, a few mnemonics, the kinds of questions examiners ask, and a quiz to test themselves. Different exams call for different packs, so the service tailors its output to the exam type.

## The challenge

- **Time.** Building a full pack takes a few minutes, far longer than a web request can stay open.
- **Grounding.** Revision content is only useful if it matches the syllabus and the facts are right.
- **Shape.** The pack is rendered in a rich-text editor, so every part has to arrive in a valid, predictable structure.

## Key decisions

- **A job, not a request.** Starting a pack returns immediately with a job id; the work happens in the background with a status the app can poll.
- **Ground before writing.** Each pack starts from the syllabus requirements for the topic in the knowledge graph, plus web search for current facts.
- **A schema for every part.** Summaries, mnemonics, questions and quizzes each have a strict Pydantic model, so malformed output is caught before it is saved.
- **Images alongside text.** Diagrams are generated and stored with the pack, rather than added by hand afterwards.

## Outcome

- Packs are generated for different exam types without timeouts, and the app shows progress while they build.
- Malformed parts are caught by the schemas before a pack is saved, so packs reach the editor ready for review.

## What I learned

Long-running AI work should be treated as a job, not a request. Once generation moved into the background with a status anyone could check, timeouts stopped being a problem and the experience became predictable.
