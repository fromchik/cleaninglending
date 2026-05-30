# Benefits Mosaic And Cleaning Stages Palette Design

Date: 2026-05-30
Status: Approved for implementation planning

## Context

The landing page already has a "Чому обирають нас" section with four text-and-photo items and an "Етапи чистки" section with a vertical six-step timeline. The benefits section currently uses a regular alternating grid that feels generic. The cleaning stages section uses a saturated gold background that competes with the rest of the page.

## Goal

Refresh both sections without changing the overall page structure:

- make "Чому обирають нас" feel more distinctive and grounded in the real service;
- keep photos so the section remains visually alive;
- use practical advantages instead of broad promotional claims;
- make "Етапи чистки" fit the existing pine, teal, cream, and restrained warm-accent palette.

## Benefits Section

Use an asymmetrical service mosaic.

- A large lead card with a cleaning-process photo anchors the left side on desktop.
- Three supporting cards sit beside it in a varied layout rather than a uniform checkerboard.
- Cards use a mix of photo-led and text-led compositions.
- The content focuses on practical reasons to choose the service:
  - a clear estimate based on photos;
  - products selected for the fabric and type of dirt;
  - an on-site visit with equipment;
  - realistic expectations about the result and drying time.
- Photos remain supporting evidence and atmosphere. They must not imply unverifiable claims about the team or completed jobs.
- On mobile, the mosaic becomes a single-column reading order with stable image heights and no overlap.

## Cleaning Stages Section

Keep the existing vertical timeline and six steps, but change its presentation.

- Replace the saturated gold container with a warm light neutral background.
- Use a restrained warm border or highlight so the section still feels distinct from nearby white sections.
- Use a pine timeline line.
- Use primarily pine step markers with a restrained warm accent for selected markers.
- Keep dark text with sufficient contrast.
- Preserve the existing step copy and mobile-friendly vertical flow.

## Scope

Frontend only:

- update the benefits component markup and its content;
- adjust the cleaning stages component classes;
- add small style helpers only if Tailwind utility classes become too repetitive.

No backend, form, routing, or data-contract changes are required.

## Verification

- Run the frontend static verification and production build.
- Confirm the benefits mosaic is readable at mobile and desktop widths.
- Confirm there is no horizontal overflow.
- Confirm photos have stable dimensions and lazy loading where appropriate.
- Confirm the cleaning stages text remains readable against the new background.
