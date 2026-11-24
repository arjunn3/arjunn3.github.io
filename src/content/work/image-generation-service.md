---
title: Multi-provider image service
product: Image pipeline at Orfiq
summary: One image-generation service behind four product surfaces, routing between Azure OpenAI and Gemini with automatic fallback and step-by-step refinement.
year: 2026
group: orfiq
area: integrations
order: 7
status: published
ownership: owner
role: Designed and built the image service
stack: [Azure OpenAI, Gemini, FastAPI, Tenacity]
code: private
codeNote: Private to Orfiq. This page describes the design; no code is shown.
visual: fallback
highlights:
  - Replaced four separate integrations with one core service, so each product surface adds only its own context and prompt style.
  - A provider router fails over from Azure OpenAI to Gemini on outages and rate limits.
  - Several reference images can be passed in, so an image is refined step by step instead of regenerated.
---

## Context

Course material needs precise illustrations: anatomy, pathology slides, radiology and clinical flowcharts. Four different places in the product needed images: the course editor, two chat assistants and a general API. Later, a logbook endpoint and reading materials needed them too.

## The challenge

- **No shared interface.** Each place that needed images had its own integration and prompt style.
- **No way to refine.** Every change meant generating a new image from scratch.
- **Single points of failure.** When a provider was down or rate-limited, image generation simply failed.

## Key decisions

- **One core, thin adapters.** A single image function handles aspect ratio (16:9, 4:3, 3:4 or 1:1), reference images, retries and storage. Each surface's adapter only adds its context and prompt style.
- **Fallback as a design decision.** A router picks the provider from configuration and falls back to Gemini automatically when Azure OpenAI is unavailable or rate-limited.
- **References for refinement.** Passing several reference images turns "try again" into "change this part".
- **Bounded concurrency.** Up to four images generate at once, each with its own timeout and retries with exponential backoff, and results are saved behind signed links.

## Outcome

- Every image in the product goes through one service with one prompt style.
- Provider outages turn into slower images instead of broken pages.

## What I learned

Decide the failure behaviour before you need it: which provider is primary, what counts as "down", and what the user sees. Then an outage is just a slower image.
