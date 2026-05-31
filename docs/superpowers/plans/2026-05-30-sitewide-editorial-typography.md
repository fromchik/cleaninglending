# Sitewide Editorial Typography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply a lighter, more refined typography system across the public landing page while keeping the current layout and Inter font stack.

**Architecture:** Extend the existing static verifier with a sitewide typography guard, then replace excessive `font-black` utilities in frontend components with deliberate `font-bold` or `font-extrabold` weights. Keep numeric highlights and the hero title slightly stronger than surrounding copy.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Vite, Node static verification script

---

### Task 1: Add Typography Guard

**Files:**
- Modify: `client/scripts/verify-static.mjs`

- [x] **Step 1: Add a failing verifier rule**

Scan public frontend component files and report a failure when any file still includes `font-black`.

- [x] **Step 2: Run verifier to confirm RED**

Run: `node scripts/verify-static.mjs`

Expected: FAIL with component paths that still contain `font-black`.

### Task 2: Tune Sitewide Font Weights

**Files:**
- Modify: `client/src/components/*.tsx`

- [x] **Step 1: Replace heavy component weights**

Use:

- `font-extrabold` for hero heading, key numeric values, logo initials, and selected price values;
- `font-bold` for section and card headings;
- `font-semibold` for compact uppercase labels, navigation actions, FAQ summaries, and form options.

- [x] **Step 2: Run verifier to confirm GREEN**

Run: `node scripts/verify-static.mjs`

Expected: `Static verification passed`

### Task 3: Verify Production Output

**Files:**
- Verify: `client/scripts/verify-static.mjs`

- [x] **Step 1: Run production build**

Run: `npm.cmd run build`

Expected: Vite production build completes without errors.

- [x] **Step 2: Run diff whitespace verification**

Run: `git diff --check`

Expected: no output and exit code 0.
