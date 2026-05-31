# Vercel Static Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy the existing cleaning landing page as a static Vercel site while preserving its interactive form UI and retaining the dormant backend source for future work.

**Architecture:** Vercel builds only the `client` Vite application. The lead form validates and resets locally, without calling `/api/leads` or transmitting user data. The existing `server` directory stays unchanged and is documented as a future integration base.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Vercel static hosting

---

### Task 1: Add The Static Release Guard

**Files:**
- Modify: `client/scripts/verify-static.mjs`
- Modify: `client/package.json`

- [x] **Step 1: Add failing static-release assertions**

Extend `client/scripts/verify-static.mjs` so it requires:

```js
if (leadForm.includes("fetch(") || leadForm.includes("FormData")) {
  failures.push("LeadForm must not transmit customer data in the static Vercel release");
}
if (!leadForm.includes("setIsComplete(true)") || !leadForm.includes("window.setTimeout(resolve, 250)")) {
  failures.push("LeadForm must complete locally after the short submit transition");
}
if (leadForm.includes("leadId") || successMessage.includes("leadId") || successMessage.includes("t.lead")) {
  failures.push("Static showcase success flow must not display a generated lead number");
}
```

Also assert that `client/vercel.json` exists with the SPA rewrite and that `README.md` documents `client` as the Vercel Root Directory.

- [x] **Step 2: Expose the guard as an npm script**

Add:

```json
"verify:static": "node scripts/verify-static.mjs",
"build": "npm run verify:static && tsc -b && vite build"
```

- [x] **Step 3: Run the guard and verify it fails**

Run: `npm run verify:static`

Expected: FAIL because the current client still calls `fetch("/api/leads")`, still displays `leadId`, and has no `vercel.json`.

### Task 2: Convert The Form To Local Completion

**Files:**
- Modify: `client/src/components/LeadForm.tsx`
- Modify: `client/src/components/SuccessMessage.tsx`
- Modify: `client/src/i18n/translations.ts`

- [x] **Step 1: Replace remote submission with a local transition**

In `LeadForm`, remove `FormData`, `fetch`, `LeadResponse`, and generated lead IDs. Use:

```ts
const [isComplete, setIsComplete] = useState(false);

await new Promise<void>((resolve) => window.setTimeout(resolve, 250));
setIsComplete(true);
setLocation("");
setPhone("");
setComment("");
setPhotos([]);
setErrors({});
```

Render:

```tsx
{isComplete && <SuccessMessage onClose={() => setIsComplete(false)} />}
```

- [x] **Step 2: Remove the lead number from the modal**

Change `SuccessMessage` to accept only:

```ts
{ onClose }: { onClose: () => void }
```

Remove the conditional request-number paragraph.

- [x] **Step 3: Use neutral truthful copy**

Update both locales:

```ts
privacy: "Натискання перевірить заповнені поля локально. Дані нікуди не надсилаються."
success: { close: "Закрити", title: "Дякуємо! Форму заповнено.", text: "Дані перевірено.", ok: "Добре" }
```

```ts
privacy: "Submitting checks the completed fields locally. Your details are not sent anywhere."
success: { close: "Close", title: "Thank you! The form is complete.", text: "The details have been checked.", ok: "Done" }
```

### Task 3: Add The Vercel Deployment Files

**Files:**
- Create: `client/vercel.json`
- Modify: `client/vite.config.ts`
- Modify: `.gitignore`
- Modify: `README.md`

- [x] **Step 1: Add the static SPA configuration**

Create:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [x] **Step 2: Remove the unused local API proxy**

Keep the Vite port configuration and remove the `/api` proxy from `client/vite.config.ts`.

- [x] **Step 3: Ignore generated TypeScript build artifacts**

Add:

```gitignore
*.tsbuildinfo
client/vite.config.js
client/vite.config.d.ts
```

- [x] **Step 4: Document the static Vercel deployment**

Append a README section that states:

```md
## Static Vercel release

The current Vercel release deploys only `client`. The form validates locally and does not send personal data or photos. The preserved `server` directory is a dormant base for a future backend integration.

1. Import the repository into Vercel.
2. Set **Root Directory** to `client`.
3. Keep **Framework Preset** as `Vite`.
4. Use `npm run build` and the `dist` output directory.
5. Deploy without environment variables.
```

### Task 4: Verify The Release

**Files:**
- Verify: `client`
- Verify: `server`

- [x] **Step 1: Run the client release guard**

Run: `npm run verify:static`

Expected: `Static verification passed`

- [x] **Step 2: Run the production build**

Run: `npm run build`

Expected: Vite build exits with code `0`.

- [x] **Step 3: Run the preserved backend tests**

Run: `npm test`

Expected: Vitest exits with code `0`.

- [x] **Step 4: Run a browser smoke test**

Open the local static preview and verify:

- landing page renders;
- empty form submission shows validation errors;
- adding an image and valid details opens the success modal;
- modal has neutral copy and no lead number;
- no request is sent to `/api/leads`;
- `/en` renders after a direct navigation.
