# Sitewide Editorial Typography Design

Date: 2026-05-30
Status: Approved for implementation planning

## Context

The landing page uses Inter and a clear visual hierarchy, but many interface elements rely on `font-black`. This makes the page feel heavier and less refined than the provided furniture-store reference. The reference uses compact headings, restrained body copy, lighter navigation, and small labels with measured spacing.

## Goal

Apply a calmer editorial typography system across the entire landing page without changing the layout, content hierarchy, or loading external font files.

## Direction

Keep the existing Inter stack and tune its usage:

- use `font-bold` for most section headings;
- reserve `font-extrabold` for the hero heading and a few high-emphasis values;
- remove `font-black` from public frontend components;
- keep body copy regular with a compact but readable line-height;
- use restrained letter-spacing for small uppercase labels;
- make navigation, buttons, form controls, cards, FAQ, and footer follow the same weight system.

## Scale

- Hero heading: compact, prominent, `font-extrabold`, slightly tighter tracking.
- Section headings: `font-bold`, balanced line-height, no oversized weight.
- Card headings: `font-bold`, usually one step below section headings.
- Body copy: regular weight, consistent `leading-6` or `leading-7` based on width.
- Labels and eyebrows: small, `font-semibold` or `font-bold`, uppercase only where useful, with modest tracking.
- Buttons: `font-semibold` or `font-bold`, avoiding overly heavy labels.
- Prices and short numeric values: `font-extrabold` where emphasis helps scanning.

## Scope

Update frontend presentation only:

- React components under `client/src/components`;
- shared typography defaults in `client/src/styles/index.css` if needed;
- static verifier checks for the new typography rule.

Do not add remote fonts, alter backend behavior, or restructure sections.

## Verification

- Add a static verifier check that public frontend components no longer use `font-black`.
- Run the static verifier and confirm it fails before implementation.
- Replace excessive weights across the frontend.
- Run the static verifier and production build.
- Run `git diff --check`.
