---
title: Reliability for long-running AI jobs
product: Platform work at Orfiq
summary: Making AI jobs that take minutes behave in production, with clear errors, honest status, safe cancellation and fixes for race conditions that only appear with several workers.
year: 2026
group: orfiq
area: reliability
order: 3
status: published
ownership: owner
role: Wrote most of the error handling and the job-status fixes
stack: [FastAPI, Pydantic, Pytest]
code: private
codeNote: Private to Orfiq. This page describes the design; no code is shown.
visual: states
highlights:
  - One error map turns provider, storage and database failures into plain messages with a reference code support can trace.
  - Validation retries cut from 8 to 3, so requests that are going to fail do so quickly instead of burning tokens.
  - Finished, failed and cancelled jobs are final, so a slow worker's late update can no longer overwrite them.
  - "Diagnosed and fixed multi-worker bugs: false \"not found\" errors from job status kept in process memory, and a temp-file race between workers."
---

## Context

Generating a textbook chapter, a revision pack or a parsed timetable takes minutes, not milliseconds. So the platform runs that work as background jobs: the client starts one, gets an id back, and polls for the result. In production, the API also runs on several workers at once.

## The challenge

- **Raw errors leaked.** Model-provider, storage and graph-database exceptions reached the app as tracebacks, and support had nothing to trace.
- **Slow failure.** Output validation retried up to eight times, so a request that was going to fail took a long time and spent tokens doing it.
- **Races.** A late update from a slow worker could flip a cancelled job back to "in progress", and the very first status check could return "not found" because the job record didn't exist yet.
- **Works on my machine.** Some job state lived in process memory. That is fine with one worker and wrong with several.

## Key decisions

- **One error map, two outputs.** Each failure class (outage, rate limit, timeout, safety block, storage, database) maps to a plain message and a short reference code, for both direct responses and background jobs.
- **Fail fast.** Output-validation retries were cut from 8 to 3.
- **Final means final.** Completed, failed and cancelled are terminal states; later writes to them are ignored.
- **Create before you announce.** The job record is written before its id is returned, so the first status check always finds it.
- **Shared state, atomic writes.** Job status moved out of process memory into a shared store written with atomic file replacement. Finished jobs are cached in memory because they can't change; jobs still running are always re-read.

## Two production bugs I fixed

- **False "not found" under load.** Polling sometimes reported a job missing. The cause: status lived in each worker's memory, and round-robin routing sent the poll to a worker that had never seen the job. Shared status fixed it, along with conflict detection for concurrent sessions, expiry of old records and tests that simulate several workers. A follow-up extended the same guarantee across replicas.
- **Workers corrupting each other's cache.** Several workers downloaded the same cache file to one fixed temporary filename at the same time. Unique temp files fixed the race, and lazy start-up under a lock fixed a crash when initialisation had been delayed.

## Outcome

- Failures read as plain messages with a traceable code instead of stack traces.
- Cancellation sticks, and the first status check always finds its job.
- Status behaves the same on one worker or many, with tests that reproduce the multi-worker conditions.

## What I learned

Many "AI reliability" problems are ordinary distributed-systems problems. A state machine with final states, honest errors and shared state did more for reliability than any prompt change.
