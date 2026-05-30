# Client Showcase Polish Design

## Context

The public landing page is structurally complete and its production build passes. The client showcase pass should remove visible draft language without changing the brand, contact details, lead submission flow, or visual identity.

The gallery uses external example images. It should remain visible, but its wording must present the images as neutral examples of a cleaning result rather than claim they are CleanPro customer projects.

## Goals

- Remove visible wording that makes the landing page read like a demo or internal draft.
- Keep the current CleanPro name, phone number, Telegram link, palette, layout, and form behavior.
- Make the gallery client-facing and honest about its purpose.
- Keep the scope small enough to verify confidently before a client presentation.

## Non-Goals

- No visual redesign.
- No replacement of gallery images.
- No changes to backend behavior, Telegram workflow, or lead form fields.
- No changes to the configured phone number or Telegram link.
- No unsupported claims such as ratings, customer counts, guarantees, or years in business.

## Copy And UI Changes

### Header Navigation

Rename the gallery navigation item from `Роботи` to `Результат`. This avoids implying that the externally sourced gallery images are CleanPro portfolio items.

### Gallery Introduction

Keep the gallery in its current position and preserve its card layout. Replace the internal draft copy with a neutral client-facing introduction:

- Eyebrow: `Приклади результату`
- Heading: `Як змінюються меблі після чистки`
- Description: explain that before-and-after photos help demonstrate the type of visible difference professional cleaning can provide and that the exact result depends on fabric and staining.

### Gallery Card Notes

Replace draft-oriented notes such as `Тимчасовий приклад` and instructions to replace images later with short practical descriptions. Each note should explain what a visitor can observe in the example without claiming the image is a CleanPro project.

## Static Regression Guard

Extend `client/scripts/verify-static.mjs` before changing production copy. The verifier should fail while the draft text remains and should guard against reintroducing:

- `Тимчасові приклади`
- `Тимчасовий приклад`
- `Для реального сайту`
- `краще замінити власними кадрами`

It should also require the client-facing gallery heading `Як змінюються меблі після чистки`.

## Verification

1. Run `node scripts/verify-static.mjs` before implementation and confirm the new guard fails for the current draft text.
2. Apply the copy updates.
3. Run `node scripts/verify-static.mjs` and confirm it passes.
4. Run `npm.cmd run build` in `client`.
5. Run `npm.cmd test` and `npm.cmd run build` in `server`.
6. Run `git diff --check`.

Visual inspection through the in-app browser should be attempted again if the browser connection becomes available. In the current Windows sandbox, browser setup has exited during connection, so build and static verification remain the reliable checks.
