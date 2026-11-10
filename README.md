# School Resource Partners

Three-page, responsive static website with a Vercel quote API. Existing routes and shopping portals are preserved.

## Run and test

- Serve the directory with a static server to inspect the pages.
- `npm test` runs server validation and mocked email-provider tests.
- `npm run check` validates JavaScript syntax.
- Vercel runs `api/quote.js` as a serverless function. A plain static server does not run this API.

## Quote delivery: required before launch

The previous implementation displayed success without sending anything. This version does not claim submission unless the email provider accepts it. Failed or unconfigured requests preserve the visitor's input and provide a prefilled email fallback. Files must be manually attached when using that fallback.

To enable online submissions, configure `RESEND_API_KEY` and `QUOTE_FROM` in Vercel using a verified sending domain. Do not commit credentials. The server fixes the recipient to `quotes@schoolsolutions360.com`; visitors cannot override it. No mail service account, DNS, credentials, or new persistent access was created by this update.

Before production: connect the approved email service, add deployment-level rate limiting/bot protection, confirm attachment handling and privacy requirements with the business, and complete an authorized end-to-end delivery test with the destination inbox. Provider acceptance is not proof of inbox delivery. Uploaded lists are limited to 2 MB. No student records or sensitive personal information should be submitted.

Brand palette: navy #1F3A5F, slate #6B7280, soft white #F9FAFB, accent gold #C8A951. The existing logo is retained. No final replacement-logo approval was found. Product imagery is retained from the company’s own current shop; see ASSET_SOURCES.md. Earlier decorative CSS remains unused. Existing School Solutions 360 email addresses and store links remain because replacements were not verified.
