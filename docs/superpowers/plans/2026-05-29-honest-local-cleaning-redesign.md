# Honest Local Cleaning Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the frontend into a Ukrainian-language honest local cleaning-service landing page with better trust, mobile layout, content quality, accessibility, and performance basics.

**Architecture:** Keep the existing React/Vite/Tailwind single-page structure, but move all visible Ukrainian content into typed data arrays and small focused components. The redesign is frontend-only and preserves the existing `/api/leads` form contract.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, lucide-react, Node static verification script.

---

## File Structure

- Create: `client/scripts/verify-static.mjs`
  - Static smoke test for mojibake, metadata, exported content arrays, and image/performance markers.
- Create: `client/src/components/QuickFacts.tsx`
  - Renders four practical service facts.
- Create: `client/src/components/PhotoGuide.tsx`
  - Explains which photos help estimate the price.
- Modify: `client/index.html`
  - Ukrainian metadata and `lang="uk"`.
- Modify: `client/src/styles/index.css`
  - Warmer background, less AI-looking visual treatment, stable layout helpers.
- Modify: `client/tailwind.config.ts`
  - More grounded colors/shadows/radius tokens.
- Modify: `client/src/app/App.tsx`
  - New section order and component imports.
- Modify: `client/src/components/Header.tsx`
  - Compact local-service header.
- Modify: `client/src/components/CtaButton.tsx`
  - Durable button sizing and focus behavior.
- Modify: `client/src/components/HeroSection.tsx`
  - Local service offer and practical photo checklist.
- Modify: `client/src/components/LeadForm.tsx`
  - Clean Ukrainian copy, stronger helper text, stable form layout.
- Modify: `client/src/components/FileUploadField.tsx`
  - Practical upload guidance.
- Modify: `client/src/components/ServicePriceGrid.tsx`
  - Convert to simple price list/table-like service section.
- Modify: `client/src/components/BeforeAfterGallery.tsx`
  - Temporary examples with lazy images and stable dimensions.
- Modify: `client/src/components/HowItWorks.tsx`
  - Shorter grounded process.
- Modify: `client/src/components/FaqContactSection.tsx`
  - Practical FAQ and contact block.
- Modify: `client/src/components/SuccessMessage.tsx`
  - Clean Ukrainian success message.
- Modify: `client/src/data/content.ts`
  - Ukrainian source of truth for quick facts, photo tips, gallery, steps, FAQ.
- Modify: `client/src/data/services.ts`
  - Ukrainian service labels/prices/notes.

## Task 1: Static Verification Harness

**Files:**
- Create: `client/scripts/verify-static.mjs`

- [ ] **Step 1: Write the failing static verification script**

Create `client/scripts/verify-static.mjs`:

```js
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const filesToScan = [
  "index.html",
  "src/app/App.tsx",
  "src/components/Header.tsx",
  "src/components/HeroSection.tsx",
  "src/components/LeadForm.tsx",
  "src/components/FileUploadField.tsx",
  "src/components/ServicePriceGrid.tsx",
  "src/components/BeforeAfterGallery.tsx",
  "src/components/HowItWorks.tsx",
  "src/components/FaqContactSection.tsx",
  "src/components/SuccessMessage.tsx",
  "src/data/content.ts",
  "src/data/services.ts"
];

const mojibakeMarkers = ["Р ", "Рџ", "Рќ", "Р‘", "Р”", "РҐ", "Р©", "С–", "С—", "СЊ", "Сѓ", "вЂ", "в‚", "В©"];
const failures = [];

for (const relativePath of filesToScan) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`Missing file: ${relativePath}`);
    continue;
  }
  const text = fs.readFileSync(absolutePath, "utf8");
  for (const marker of mojibakeMarkers) {
    if (text.includes(marker)) {
      failures.push(`${relativePath} contains mojibake marker "${marker}"`);
    }
  }
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (!html.includes('<html lang="uk">')) failures.push('index.html must use lang="uk"');
if (!html.includes("Хімчистка меблів у Києві")) failures.push("index.html title/description must be Ukrainian and local");

const content = fs.readFileSync(path.join(root, "src/data/content.ts"), "utf8");
for (const exportName of ["quickFacts", "photoTips", "beforeAfterCases", "steps", "faqs"]) {
  if (!content.includes(`export const ${exportName}`)) {
    failures.push(`content.ts must export ${exportName}`);
  }
}

const app = fs.readFileSync(path.join(root, "src/app/App.tsx"), "utf8");
for (const componentName of ["QuickFacts", "PhotoGuide"]) {
  if (!app.includes(componentName)) {
    failures.push(`App.tsx must render ${componentName}`);
  }
}

const gallery = fs.readFileSync(path.join(root, "src/components/BeforeAfterGallery.tsx"), "utf8");
if (!gallery.includes('loading="lazy"')) failures.push("BeforeAfterGallery images must be lazy loaded");
if (!gallery.includes("aspect-")) failures.push("BeforeAfterGallery must reserve stable image aspect ratios");

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Static verification passed");
```

- [ ] **Step 2: Run the script and verify it fails**

Run: `node client/scripts/verify-static.mjs`

Expected: FAIL because current files contain mojibake and `QuickFacts` / `PhotoGuide` do not exist yet.

## Task 2: Content And Metadata

**Files:**
- Modify: `client/index.html`
- Modify: `client/src/data/content.ts`
- Modify: `client/src/data/services.ts`

- [ ] **Step 1: Replace metadata and content sources**

Implement these exact content structures:

```ts
export const quickFacts = [
  { label: "Ціна", value: "від 900 грн", note: "точніше після фото" },
  { label: "Сушка", value: "4-8 год", note: "залежить від тканини" },
  { label: "Виїзд", value: "Київ і поруч", note: "район уточнимо в заявці" },
  { label: "Зв'язок", value: "Telegram або телефон", note: "відповімо після перегляду фото" }
];

export const photoTips = [
  "Загальний вигляд меблів з відстані 1-2 метри.",
  "Крупно плями, потертості або місця з запахом.",
  "Бірку тканини або матеріалу, якщо вона збереглася."
];

export const steps = [
  "Ви надсилаєте фото меблів і короткий опис проблеми.",
  "Ми оцінюємо розмір, матеріал і складність забруднення.",
  "Погоджуємо ціну, район і зручний час приїзду.",
  "Чистимо меблі екстрактором і пояснюємо, скільки часу сохнутиме тканина."
];
```

`services.ts` must keep the existing `ServiceOption[]` shape and provide readable Ukrainian labels, prices, and notes.

- [ ] **Step 2: Run static verification**

Run: `node client/scripts/verify-static.mjs`

Expected: still FAIL because layout components have not been rewritten yet.

## Task 3: Visual System Foundation

**Files:**
- Modify: `client/tailwind.config.ts`
- Modify: `client/src/styles/index.css`
- Modify: `client/src/components/CtaButton.tsx`
- Modify: `client/src/components/Header.tsx`

- [ ] **Step 1: Update visual tokens and base CSS**

Use a warmer neutral base, deep green action color, restrained shadow, and moderate radii. Keep `.section-shell`, `.field`, and mobile width constraints.

- [ ] **Step 2: Rewrite header and button**

Header must fit 320px width and include compact brand, phone/Telegram contact, and CTA. `CtaButton` must keep accessible focus styles and avoid text overflow.

- [ ] **Step 3: Run frontend build**

Run: `npm.cmd run build` from `client`

Expected: PASS TypeScript and Vite build.

## Task 4: Page Sections

**Files:**
- Create: `client/src/components/QuickFacts.tsx`
- Create: `client/src/components/PhotoGuide.tsx`
- Modify: `client/src/app/App.tsx`
- Modify: `client/src/components/HeroSection.tsx`
- Modify: `client/src/components/LeadForm.tsx`
- Modify: `client/src/components/FileUploadField.tsx`

- [ ] **Step 1: Add QuickFacts and PhotoGuide**

`QuickFacts` maps `quickFacts`; `PhotoGuide` maps `photoTips`. Both use simple section layouts, not heavy decorative cards.

- [ ] **Step 2: Rewrite HeroSection**

Hero must lead with "Хімчистка меблів у Києві з розрахунком за фото", explain the flow, and show the photo checklist instead of making glossy external photos the proof.

- [ ] **Step 3: Rewrite LeadForm copy**

Replace all visible strings, placeholders, validation errors, helper text, and submit states with natural Ukrainian. Keep the same form state and `/api/leads` request body.

- [ ] **Step 4: Run static verification and build**

Run: `node client/scripts/verify-static.mjs`

Expected: may still FAIL until gallery/performance changes are complete.

Run: `npm.cmd run build` from `client`

Expected: PASS.

## Task 5: Supporting Sections And Performance Markers

**Files:**
- Modify: `client/src/components/ServicePriceGrid.tsx`
- Modify: `client/src/components/BeforeAfterGallery.tsx`
- Modify: `client/src/components/HowItWorks.tsx`
- Modify: `client/src/components/FaqContactSection.tsx`
- Modify: `client/src/components/SuccessMessage.tsx`

- [ ] **Step 1: Rewrite service price section**

Make it a plain price list with readable prices and notes. Avoid the large dark premium panel.

- [ ] **Step 2: Rewrite gallery**

Use stable aspect-ratio wrappers and `loading="lazy"` on lower-page images. Label the gallery as examples until real customer photos are available.

- [ ] **Step 3: Rewrite process, FAQ, contact, and success message**

Use short practical Ukrainian copy. Do not add fake ratings, fake testimonials, years in business, or customer counts.

- [ ] **Step 4: Run static verification and build**

Run: `node client/scripts/verify-static.mjs`

Expected: PASS.

Run: `npm.cmd run build` from `client`

Expected: PASS.

## Task 6: Final Verification

**Files:**
- Verify all modified frontend files.

- [ ] **Step 1: Check no accidental mojibake remains**

Run: `node client/scripts/verify-static.mjs`

Expected: `Static verification passed`.

- [ ] **Step 2: Check production build**

Run: `npm.cmd run build` from `client`

Expected: Vite build completes with exit code 0.

- [ ] **Step 3: Inspect git diff**

Run: `git diff -- client docs/superpowers/plans/2026-05-29-honest-local-cleaning-redesign.md`

Expected: Diff only contains frontend redesign changes, the static verification script, and this plan.
