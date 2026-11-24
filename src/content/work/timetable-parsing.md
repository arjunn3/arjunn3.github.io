---
title: Timetable document parser
product: Master timetable parser at Orfiq
summary: Turns messy timetable documents (PDF, Word or Excel) into one clean, validated JSON schedule, behind an async API with a CLI and its own test suite.
year: 2026
group: orfiq
area: documents
order: 6
status: published
ownership: owner
role: Designed and built it
stack: [Python, FastAPI, Pydantic, Pytest]
code: private
codeNote: Private to Orfiq. This page describes the design; no code is shown.
visual: parser
highlights:
  - One parser for PDF, Word and Excel timetables, using layout heuristics to recover structure from inconsistent documents.
  - Async API. Upload returns at once with status and result links; a finished result is downloadable, and a job can be cancelled.
  - Storage is decoupled. The parser only extracts and validates, and the app decides where the result is saved.
  - Ships with a command-line tool and a dedicated test suite.
steps:
  - title: Read the document
    text: A reader for each format pulls out text and layout from PDF, Word or Excel files.
  - title: Recover the structure
    text: Layout heuristics find the days, time slots and sessions, and mapping rules normalise names, times and subjects.
  - title: Validate and hand over
    text: The result is checked against typed models and returned as one canonical JSON schedule.
---

## Context

Every college sends its timetable in its own format: scanned PDFs, Word tables, Excel sheets with merged cells. The product needs all of them as one structured schedule that the rest of the system can read.

## The challenge

- **No standard layout.** Days might be rows or columns, sessions span merged cells, and labels change from one institution to the next.
- **Three file formats,** each with its own quirks.
- **Slow and fallible.** Parsing can take a while, and a bad document must fail clearly, not produce a half-right schedule.

## Key decisions

- **Heuristics plus validation.** Layout heuristics recover structure, and typed models reject anything that doesn't fit the schedule format, so errors surface instead of slipping through.
- **An async job API.** Uploading returns `202 Accepted` with status and result links. The result endpoint answers `409` while the job is still running, and cancellation works through the platform's shared task API.
- **Extraction only.** The parser doesn't decide where results are stored. The app reviews the JSON and saves it where the user chooses, which keeps the parser simple and reusable.
- **Tested like a library.** It comes with a command-line tool for local runs and a dedicated test suite.

Earlier, I also added a deterministic check to the calendar importer: the weekday is computed from the parsed date in code, never taken from the model, which eliminated a whole class of wrong-day errors.

## Outcome

- Timetables in all three formats come out as one canonical JSON schedule.
- Failures are explicit and testable instead of silent.

## What I learned

For messy documents, combine heuristics with strict validation. Heuristics get you most of the way; the schema tells you, loudly, when they didn't.
