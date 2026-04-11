# Skylah Store Security Checklist

This checklist is designed to move security controls from frontend-only enforcement to backend and platform-level enforcement.

## 1) Contact Form Abuse Controls

- [ ] Add a backend endpoint (for example `/api/contact`) and set `VITE_CONTACT_PROVIDER=backend`.
- [ ] Enforce server-side rate limits: per IP, per user, and per email.
- [ ] Add daily caps server-side (frontend cap is not authoritative).
- [ ] Validate and sanitize all incoming fields on the server.
- [ ] Block disposable email domains if needed.
- [ ] Log abuse signals (IP, user agent, burst patterns).

## 2) Authentication Controls

- [ ] Keep email verification required before account dashboard access.
- [ ] Add backend throttling for password reset and resend verification flows.
- [ ] Keep user-facing auth error messages generic to avoid leakage.
- [ ] Enable Firebase App Check if applicable.

## 3) Firestore Data Protection

- [ ] Use per-user document paths only (already implemented in app data layer).
- [ ] Add strict Firestore security rules to enforce `request.auth.uid == userId`.
- [ ] Restrict writeable fields and validate data shape in rules.
- [ ] Avoid storing sensitive payment data (only labels and last4 are allowed).

## 4) Secrets and Config

- [ ] Do not commit `.env`.
- [ ] Use environment-specific values for contact endpoint and Firebase keys.
- [ ] Keep production secrets in hosting provider secret manager, not client env vars.

## 5) Build and Dependency Hygiene

- [ ] Keep Vite/Vitest updated and run `npm audit` regularly.
- [ ] Run tests and production build on every release.
- [ ] Remove unused dependencies.

## 6) Monitoring and Incident Response

- [ ] Add backend error monitoring for contact endpoint.
- [ ] Track repeated failed auth events and unusual contact traffic.
- [ ] Document rollback process for security incidents.

## Current Stubs Already Implemented

- Frontend contact service abstraction: `src/lib/contactService.js`
- Provider switch via env var: `VITE_CONTACT_PROVIDER` (`formsubmit` or `backend`)
- Backend endpoint env var: `VITE_CONTACT_BACKEND_ENDPOINT`
- Firestore account storage layer: `src/lib/accountDataStore.js`
- Firestore initialization export: `src/lib/firebase.js`
- Firestore security rules stub: `firestore.rules`
