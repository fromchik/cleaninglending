# Lead Success Popup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a closable modal confirmation after a successful lead submission.

**Architecture:** Keep successful-submission state in `LeadForm`. Render `SuccessMessage` alongside the reusable form and turn `SuccessMessage` into an accessible modal that owns its close interactions.

**Tech Stack:** React, TypeScript, Tailwind CSS, Node static verification script, Vite

---

### Task 1: Add Static Regression Checks

**Files:**
- Modify: `client/scripts/verify-static.mjs`

- [ ] Add assertions that `SuccessMessage.tsx` contains dialog semantics, the 10-minute message, backdrop close handling, and an `Escape` listener.
- [ ] Run `node scripts/verify-static.mjs` from `client` and verify that it fails because the popup markers are absent.

### Task 2: Implement The Modal

**Files:**
- Modify: `client/src/components/SuccessMessage.tsx`
- Modify: `client/src/components/LeadForm.tsx`

- [ ] Add an `onClose` callback to `SuccessMessage`, register and clean up the `Escape` listener, render the backdrop and dialog, and close on backdrop click without closing on content click.
- [ ] Keep the form rendered after success and render the modal separately when `successLeadId` is defined.
- [ ] Run `node scripts/verify-static.mjs` from `client` and verify that it passes.

### Task 3: Verify The Client

**Files:**
- Verify: `client/src/components/SuccessMessage.tsx`
- Verify: `client/src/components/LeadForm.tsx`

- [ ] Run `npm run build` from `client`.
- [ ] Review the final diff for scope and accidental changes.
