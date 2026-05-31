# Benefits Mosaic And Cleaning Stages Palette Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic benefits checkerboard with an asymmetrical photo mosaic and harmonize the cleaning stages timeline palette.

**Architecture:** Keep the existing frontend component boundaries. Update the benefits data to practical claims, render the same four items through explicit mosaic card layouts, and restyle the existing timeline with Tailwind utility classes. Extend the current static verifier to guard the intended layout markers.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Vite, Node static verification script

---

### Task 1: Add Static Layout Guards

**Files:**
- Modify: `client/scripts/verify-static.mjs`

- [x] **Step 1: Add failing checks**

Require `ServicesOverview.tsx` to contain the mosaic markers `benefits-mosaic`, `benefits-mosaic-feature`, and `benefits-mosaic-support`, and require `TrustHighlights.tsx` to use `bg-[#F5F1E6]` instead of `bg-gold`.

- [x] **Step 2: Run static verification to confirm RED**

Run: `node scripts/verify-static.mjs`

Expected: FAIL because the new mosaic and palette markers do not exist yet.

### Task 2: Implement Benefits Mosaic

**Files:**
- Modify: `client/src/data/content.ts`
- Modify: `client/src/components/ServicesOverview.tsx`

- [x] **Step 1: Replace generic claims with practical service advantages**

Use four items: photo-based estimate, fabric-aware products, on-site equipment, and realistic drying/result guidance.

- [x] **Step 2: Render an asymmetrical desktop mosaic**

Use one large photo-led feature card, one compact photo-led card, and two text-led cards with small image areas. Preserve single-column mobile reading order, fixed image heights, and lazy loading.

### Task 3: Harmonize Cleaning Stages Palette

**Files:**
- Modify: `client/src/components/TrustHighlights.tsx`

- [x] **Step 1: Replace saturated gold with a warm neutral container**

Use `bg-[#F5F1E6]`, a restrained warm border, a pine timeline line, and alternating pine and muted-gold markers.

### Task 4: Verify

**Files:**
- Verify: `client/scripts/verify-static.mjs`

- [x] **Step 1: Run static verification**

Run: `node scripts/verify-static.mjs`

Expected: `Static verification passed`

- [x] **Step 2: Run production build**

Run: `npm.cmd run build`

Expected: Vite production build completes without errors.

- [ ] **Step 3: Inspect desktop and mobile render**

Open the local frontend in the in-app browser, confirm the mosaic hierarchy and timeline contrast, and check that the page does not overflow horizontally.

Blocked in the current Windows sandbox: the in-app browser connection exits during setup. The built frontend was served locally and returned HTTP 200, but visual screenshot inspection could not be completed.
