# Telegram Admin Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a guided Telegram owner workflow with status lists and persistent reminders.

**Architecture:** Extend SQLite-backed leads with operational fields and reminder metadata. Put guided conversation transitions in a testable `TelegramWorkflow` class, then keep the Telegram bot focused on adapting Bot API events to workflow results and polling due reminders.

**Tech Stack:** TypeScript, Node.js, SQLite with `better-sqlite3`, `node-telegram-bot-api`, Vitest

---

### Task 1: Extend Lead Persistence

**Files:**
- Modify: `server/src/db/schema.ts`
- Modify: `server/src/leads/lead.model.ts`
- Modify: `server/src/leads/lead.service.ts`
- Create: `server/src/leads/lead.service.test.ts`

- [ ] Write failing service tests for initial 10-minute reminders, status filtering, unreached callback reminders, scheduled visits, and reminder advancement.
- [ ] Run `npm test -- src/leads/lead.service.test.ts` and verify failures reference missing fields or methods.
- [ ] Add schema columns with startup migrations and implement the minimal service methods.
- [ ] Run `npm test -- src/leads/lead.service.test.ts` and verify the service tests pass.

### Task 2: Add Guided Workflow

**Files:**
- Create: `server/src/telegram/workflow.ts`
- Create: `server/src/telegram/workflow.test.ts`

- [ ] Write failing workflow tests for reached, unreached, price, date, time, retry, invalid input, closing, rejecting, and filtered lists.
- [ ] Run `npm test -- src/telegram/workflow.test.ts` and verify failure because `TelegramWorkflow` does not exist.
- [ ] Implement `TelegramWorkflow` with in-memory per-owner input state and structured results for the bot adapter.
- [ ] Run `npm test -- src/telegram/workflow.test.ts` and verify the workflow tests pass.

### Task 3: Connect Telegram Adapter And Reminder Polling

**Files:**
- Modify: `server/src/telegram/bot.ts`
- Modify: `server/src/telegram/keyboards.ts`
- Modify: `server/src/telegram/messages.ts`
- Modify: `server/src/utils/format.ts`
- Modify: `server/src/utils/format.test.ts`

- [ ] Write failing formatting and keyboard assertions for operational lead fields and guided buttons.
- [ ] Run `npm test -- src/utils/format.test.ts` and verify expected failures.
- [ ] Update cards, keyboards, `/leads`, callback handling, text handling, and the due-reminder timer.
- [ ] Run `npm test` and verify all server tests pass.
- [ ] Run `npm run build` and verify TypeScript compilation passes.
