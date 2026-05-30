# Vercel Static Showcase Design

## Goal

Prepare the cleaning landing page for a simple Vercel deployment without a running backend while preserving the current interactive UI and keeping the existing server implementation available for future work.

## Deployment Model

Vercel deploys only the `client` application as a static Vite site. The `server` directory remains in the repository unchanged as a dormant reference implementation for a later production form workflow.

The deployed frontend must not call `/api/leads` or transmit form data, photos, phone numbers, locations, or comments to any remote destination.

## Form Experience

The lead form keeps its existing layout and client-side behavior:

- service selection;
- location, phone, and comment fields;
- photo selection, validation, preview, and removal;
- required-field and file validation;
- submit loading state;
- successful modal flow;
- form reset after a valid submission.

After a valid submission, the frontend performs a short local transition and opens the existing success modal. It does not generate or display a lead number because no lead record exists.

The modal copy must remain neutral and truthful:

- Ukrainian title: `Дякуємо! Форму заповнено.`
- Ukrainian text: `Дані перевірено.`
- English title: `Thank you! The form is complete.`
- English text: `The details have been checked.`

The privacy note below the submit button must state that submitting checks the completed fields locally and does not send them.

## Vercel Configuration

Add a Vercel configuration file inside `client` so the `client` directory can be imported as the Vercel project root and deployed without the server.

Document the deployment steps in the project README:

1. import the repository into Vercel;
2. set `client` as the Root Directory;
3. use the Vite build command and `dist` output directory;
4. deploy without environment variables;
5. note that the preserved `server` directory is not used by this static release.

## Verification

Run:

- client static verification;
- client production build;
- server test suite to confirm the preserved backend remains intact;
- a browser smoke test that checks the landing page, validation errors, a valid local form submission, the success modal, and the absence of a `/api/leads` request.

