# Lead Success Popup Design

## Goal

Show a clear modal confirmation after a cleaning request is submitted successfully.

## User Experience

- Keep the lead form visible and reusable after a successful submission.
- When the API confirms the lead was accepted, clear the submitted form fields and open a modal popup above the page.
- Show a short confirmation message: "Спасибо! Мы перезвоним вам в течение 10 минут."
- Include a visible "Хорошо" button.
- Close the popup when the user presses the button, clicks the darkened backdrop outside the popup, or presses `Escape`.
- Do not close the popup when the user clicks inside its content.

## Components

- `LeadForm` continues to own the successful-submission state because it already receives the API response.
- `SuccessMessage` becomes the modal confirmation component. It receives an `onClose` callback and renders the backdrop, dialog, message, and close button.
- `SuccessMessage` registers the `Escape` listener only while the modal exists and removes the listener during cleanup.

## Error Handling

- Failed submissions continue to show the existing inline form error.
- The popup opens only after a successful API response.

## Verification

- Build the client with `npm run build`.
- Extend the static verification script to assert that the popup includes dialog semantics, the 10-minute callback message, a backdrop-close handler, and an `Escape` handler.
