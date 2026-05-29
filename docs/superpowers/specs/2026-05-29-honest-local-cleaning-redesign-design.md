# Honest Local Cleaning Redesign Design

Date: 2026-05-29
Status: Approved for implementation planning

## Context

The project is a React/Vite/Tailwind landing page for a furniture dry-cleaning service with a lead form that sends photos and contact details to the backend. The current frontend works structurally, but it reads like a generated template rather than a trustworthy local service.

The redesign will keep the site as a single Ukrainian-language landing page. It will position the business as a practical local service in Kyiv and nearby areas, with photo-based estimates as the main conversion path.

## Goals

- Make the site feel like a real local cleaning service, not an AI-generated SaaS landing page.
- Replace all mojibake/broken text with natural Ukrainian copy.
- Make the first mobile screen immediately communicate service, city, starting price, and a clear call to action.
- Keep the photo estimate form as the central action.
- Prepare the design for future real photos while still looking acceptable with temporary images.
- Improve performance, layout stability, accessibility, and SEO basics.

## Non-Goals

- No multi-page redesign.
- No new backend behavior.
- No brand exploration beyond the landing page visual system.
- No fake testimonials, fake team photos, or unverifiable claims.
- No heavy animation or decorative visual effects.

## Current AI-Looking Signs To Remove

- Broken Ukrainian text encoding throughout UI, metadata, and docs-facing copy.
- Repeated formula of eyebrow label, oversized heading, and floating cards.
- Overuse of large rounded corners and soft shadows.
- Generic glossy before/after photos presented as the main proof.
- Abstract marketing language without practical details.
- Decorative icon usage in nearly every block.
- Sterile mint/teal/white palette with little local-service character.
- Form styling that feels like a component demo instead of a quick service request.

## Recommended Approach

Use the "honest local service" direction:

- Practical, direct Ukrainian copy.
- Compact layout with less decorative whitespace.
- Clear price anchors and constraints.
- Stronger emphasis on what the customer should send for an accurate estimate.
- Temporary photos treated as examples, not as claimed proof.
- Local details: Kyiv, nearby areas, drying time, what affects price, Telegram/phone contact.

## Page Structure

1. Header
   - Compact logo/service name.
   - Phone and Telegram/contact access.
   - One primary CTA to the form.
   - Mobile layout must fit at 320px without horizontal overflow.

2. Hero
   - Headline: "Хімчистка меблів у Києві з розрахунком за фото".
   - Supporting copy explains that the user sends photos and receives a price estimate.
   - Primary CTA: "Отримати розрахунок".
   - Secondary contact action: phone or Telegram.
   - A practical photo checklist replaces the current glossy hero proof.

3. Quick Facts
   - Four scannable facts: starting price, drying time, service area, response channel.
   - These should read as useful facts, not decorative badges.

4. Lead Form
   - The form stays near the top and remains the main conversion surface.
   - Labels, errors, helper text, and success state use clean Ukrainian.
   - File upload copy should tell users what photos help: full item, stain close-up, fabric tag if available.

5. Service Price List
   - Replace the dark premium card section with a simple service price list or table.
   - Keep "від" pricing and short notes about what affects the final price.

6. Photo Guide
   - A short section explaining which photos to send for a more accurate estimate.
   - This helps replace generic trust claims with practical guidance.

7. Before/After Gallery
   - Keep a gallery, but label temporary photos as examples until real client work is available.
   - Images should use lazy loading and stable dimensions.

8. How It Works
   - Reduce decorative cards and make the steps short.
   - Focus on photo submission, estimate, scheduling, cleaning, drying.

9. FAQ and Contacts
   - Keep FAQ grounded in common questions: drying, smell removal, price changes, service area.
   - Contact block should be direct and easy to scan.

10. Footer
   - Simple copyright and service/city text.

## Visual System

- Background: warm off-white or very light neutral, not a gradient-heavy backdrop.
- Text: dark graphite/pine tone with high contrast.
- Primary action: deep green.
- Secondary accent: restrained warm tone for prices or important notes.
- Cards: only for repeated items, not as nested decorative containers.
- Radius: moderate, around 12-16px for most UI; avoid 28px as a default.
- Shadows: subtle or absent; avoid large soft "template" shadows.
- Typography: fewer uppercase labels, normal letter spacing, clear hierarchy.
- Icons: functional only. Use icons for phone, message, upload, status, and selected facts where they clarify action.
- Mobile: no horizontal overflow, no text squeezed inside buttons, no nav overlap.

## Content Direction

All public UI copy should be Ukrainian. Tone should be plain, local, and specific:

- Prefer: "Надішліть 2-3 фото, і ми назвемо орієнтовну ціну".
- Avoid: broad claims like "професійна якість", "ідеальний результат", or unverifiable guarantees.
- Mention Kyiv and nearby areas where appropriate.
- Be transparent that final price depends on size, material, and dirt/stain complexity.
- Do not invent reviews, ratings, years in business, or customer counts.

## Performance And Accessibility

Implementation should follow current Core Web Vitals priorities: LCP, INP, and CLS.

- Avoid externally hosted images as primary performance-critical assets where possible.
- Add `loading="lazy"` to non-critical images.
- Add explicit width/height or stable aspect-ratio wrappers for images to prevent layout shift.
- Keep the hero lightweight; if an image remains above the fold, make it intentional and size-stable.
- Reduce unnecessary shadows and expensive visual effects.
- Preserve semantic headings and labels.
- Ensure contrast meets WCAG 2.2 AA contrast minimum for normal text.
- Use proper metadata in `index.html`: Ukrainian title, description, and `lang="uk"`.

## Component Plan

- `Header`: compact service header.
- `HeroSection`: offer, local context, primary CTA, photo checklist.
- `QuickFacts`: four grounded service facts.
- `LeadForm`: cleaned-up form copy and service selection.
- `FileUploadField`: practical upload guidance.
- `ServicePriceList`: simple pricing section.
- `PhotoGuide`: guidance for useful estimate photos.
- `BeforeAfterGallery`: temporary examples, optimized image attributes.
- `HowItWorks`: concise process section.
- `FaqContactSection`: practical FAQ and contact actions.
- `content.ts` and `services.ts`: Ukrainian content source of truth.

## Testing And Verification

- Run the frontend build.
- Check mobile layout at 320px, 360px, 390px, and desktop width.
- Confirm no horizontal overflow.
- Confirm all visible text is Ukrainian and not mojibake.
- Confirm form labels, errors, helper text, and success message are readable.
- Confirm image attributes reduce layout shift risk.
- Confirm metadata uses Ukrainian language and content.

## Implementation Boundary

The implementation should touch the frontend only unless a frontend change reveals a backend contract issue. Backend routes, database schema, Telegram behavior, and upload limits are out of scope for this redesign.
