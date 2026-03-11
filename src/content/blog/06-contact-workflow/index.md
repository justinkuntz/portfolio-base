---
title: "Contact workflow"
description: "What the contact form does before it relays a message back to the covert."
heroImage: "./hero.png"
heroImageAlt: "Grogu-themed placeholder artwork for the Contact workflow article"
date: "2026-03-06"
draft: false
tags:
  - Tutorial
  - Contact
---

The `/contact` page posts to `src/pages/api/contact.ts`.

The endpoint includes a few useful defaults:

- A honeypot field for simple bot filtering
- A two-second minimum elapsed time before submission
- Basic input validation
- Lightweight in-memory rate limiting
- Resend integration for email delivery

To enable email sending, define these environment variables:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`

If you deploy the site to a multi-instance environment later, consider moving the rate limit to shared storage. For a starter, the built-in setup is enough to keep stray droids out of the inbox.
