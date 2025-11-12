Letter feature
=================

This document explains the `Letter` model and API endpoints for the "Letters to Future Us" feature.

Model (Mongoose)
-----------------

File: `backend/models/Letter.js`

Fields:
- authorId: ObjectId (ref User) — owner of the letter
- body: String — current body content (HTML from editor)
- unlockAt: Date (optional) — date/time when the letter is intended to be opened
- versions: [{ body, editedAt }] — array of previous versions (simple history)

Routes
------
All routes are protected by JWT auth middleware. Add the route mount in `backend/server.js`:

app.use('/api/letters', require('./routes/letters'));

Endpoints (server must be running on PORT):

- POST /api/letters
  - Creates a new letter.
  - Body: { body: string, unlockAt?: ISODate }
  - Response: 201 created letter object

- GET /api/letters
  - Lists letters for the authenticated user.

- GET /api/letters/:id
  - Returns a single letter (owner only).

- PATCH /api/letters/:id/version
  - Appends the current body to versions and replaces body with the provided one.
  - Body: { body: string }

- DELETE /api/letters/:id
  - Deletes a letter (owner only).

Notes and Migration
-------------------
- The route implementation pushes the previous `body` value into the `versions` array before replacing it — this preserves edit history.
- On the frontend we store local fallback copies under `localStorage.letters` when the user is not authenticated.
- Consider adding server-side validation for HTML sanitization (e.g., sanitize-html) before saving user-provided HTML.

Example (curl)
--------------
Create letter:

curl -X POST http://localhost:5000/api/letters -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"body":"<p>Hello future us</p>","unlockAt":"2026-11-12"}'

Append version:

curl -X PATCH http://localhost:5000/api/letters/<id>/version -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"body":"<p>Updated body</p>"}'
