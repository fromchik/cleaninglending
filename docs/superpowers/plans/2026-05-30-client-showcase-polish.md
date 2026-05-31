# Client Showcase Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove visible internal draft wording from the public landing page while keeping the existing layout, contacts, and lead flow intact.

**Architecture:** Extend the existing frontend static verifier with a gallery copy regression guard, then update the header navigation and gallery copy in place. Keep the existing component boundaries and external gallery images unchanged.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Vite, Node static verification script

---

### Task 1: Add Gallery Copy Regression Guard

**Files:**
- Modify: `client/scripts/verify-static.mjs`

- [x] **Step 1: Add failing verifier checks**

After loading `gallery`, reject the internal draft phrases and require the client-facing heading:

```js
for (const removedText of [
  "Тимчасові приклади",
  "Тимчасовий приклад",
  "Для реального сайту",
  "краще замінити власними кадрами"
]) {
  if (content.includes(removedText) || gallery.includes(removedText)) {
    failures.push(`Public gallery copy must not include internal draft text "${removedText}"`);
  }
}
if (!gallery.includes("Як змінюються меблі після чистки")) {
  failures.push("BeforeAfterGallery must use the client-facing result heading");
}
```

- [x] **Step 2: Run verifier to confirm RED**

Run: `node scripts/verify-static.mjs` from `client`.

Expected: FAIL with internal draft text messages and the missing client-facing heading.

### Task 2: Replace Visible Draft Copy

**Files:**
- Modify: `client/src/components/Header.tsx`
- Modify: `client/src/components/BeforeAfterGallery.tsx`
- Modify: `client/src/data/content.ts`

- [x] **Step 1: Rename the gallery navigation item**

Change the `#work` navigation label from `Роботи` to `Результат`.

- [x] **Step 2: Replace the gallery introduction**

Use:

```tsx
<p className="text-sm font-bold text-teal">Приклади результату</p>
<h2 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-pine sm:text-3xl">
  Як змінюються меблі після чистки
</h2>
```

Use this description:

```text
Фото до і після показують, як професійна чистка змінює вигляд меблів. Точний результат залежить від тканини, типу забруднення та давності плям.
```

- [x] **Step 3: Replace the gallery card notes**

Use neutral practical descriptions:

```text
Глибока чистка допомагає освіжити тканину та прибрати помітні сліди щоденного використання.
Для делікатної оббивки важливо підібрати засіб і спосіб чистки під конкретний матеріал.
Фото загального вигляду та плям крупним планом допомагають реалістично оцінити обсяг роботи.
Навіть локальні плями краще показати на фото до виїзду майстра.
```

- [x] **Step 4: Run verifier to confirm GREEN**

Run: `node scripts/verify-static.mjs` from `client`.

Expected: `Static verification passed`.

### Task 3: Verify Presentation Readiness

**Files:**
- Verify: `client/scripts/verify-static.mjs`
- Verify: `client/src/components/Header.tsx`
- Verify: `client/src/components/BeforeAfterGallery.tsx`
- Verify: `client/src/data/content.ts`

- [x] **Step 1: Search the public client source for visible draft markers**

Run:

```powershell
rg -n -i "демо|demo|mvp|prototype|прототип|тимчас|времен|для реального сайту|власними кадрами|чернов|draft|lorem|заглуш|sample" client\src client\index.html -g "!**/*.tsbuildinfo"
```

Expected: only the user-approved Telegram URL `https://t.me/cleaning_demo`.

- [x] **Step 2: Build the client**

Run: `npm.cmd run build` from `client`.

Expected: Vite production build completes without errors.

- [x] **Step 3: Test and build the server**

Run: `npm.cmd test` from `server`.

Expected: all Vitest tests pass.

Run: `npm.cmd run build` from `server`.

Expected: TypeScript build completes without errors.

- [x] **Step 4: Check whitespace**

Run: `git diff --check`.

Expected: no output and exit code 0.
