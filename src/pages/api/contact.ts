import type { APIRoute } from "astro";
import { Resend } from "resend";

const RATE_LIMIT_KEY = "__contact_rate_limit__";
const RATE_LIMIT_WINDOW_MS = 1000 * 60 * 60; // 1 hour
const RATE_LIMIT_MAX = 5;
const MIN_MESSAGE_LENGTH = 20;
const MIN_ELAPSED_MS = 2000;

const globalObject = globalThis as typeof globalThis & {
  [RATE_LIMIT_KEY]?: Map<string, { count: number; reset: number }>;
};

const rateStore =
  globalObject[RATE_LIMIT_KEY] ?? new Map<string, { count: number; reset: number }>();
if (!globalObject[RATE_LIMIT_KEY]) {
  globalObject[RATE_LIMIT_KEY] = rateStore;
}

const resendApiKey = import.meta.env.RESEND_API_KEY;
const contactFrom = import.meta.env.CONTACT_FROM_EMAIL;
const contactTo = import.meta.env.CONTACT_TO_EMAIL;

const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

type ContactResponse = {
  message: string;
};

type Outcome = "success" | "error";

const htmlEntities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHTML(value: string) {
  return value.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}

function coerceString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function getClientId(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "anonymous";
  }
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || "anonymous";
}

function enforceRateLimit(identifier: string) {
  const now = Date.now();
  const entry = rateStore.get(identifier) ?? {
    count: 0,
    reset: now + RATE_LIMIT_WINDOW_MS,
  };

  if (now > entry.reset) {
    entry.count = 0;
    entry.reset = now + RATE_LIMIT_WINDOW_MS;
  }

  entry.count += 1;
  rateStore.set(identifier, entry);

  if (entry.count > RATE_LIMIT_MAX) {
    return false;
  }

  return true;
}

function wantsHTML(request: Request) {
  const accept = request.headers.get("accept");
  return typeof accept === "string" && accept.includes("text/html");
}

function buildRedirect(request: Request, outcome: Outcome, reason?: string) {
  const destination = new URL(request.url);
  destination.pathname = "/contact";
  destination.searchParams.set("status", outcome);
  if (reason) {
    destination.searchParams.set("reason", reason);
  }
  return destination.toString();
}

function reply(request: Request, status: number, payload: ContactResponse, outcome: Outcome, reason?: string) {
  if (wantsHTML(request) && request.headers.get("x-requested-with") !== "contact-form") {
    const redirectURL = buildRedirect(request, outcome, reason);
    return Response.redirect(redirectURL, 303);
  }

  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export const POST: APIRoute = async ({ request }) => {
  if (!resendClient || !contactFrom || !contactTo) {
    console.error("Contact form attempted while mail provider is not configured.");
    return reply(
      request,
      500,
      { message: "Contact form is temporarily unavailable. Please try email instead." },
      "error"
    );
  }

  const formData = await request.formData();
  const name = coerceString(formData.get("name"));
  const email = coerceString(formData.get("email"));
  const message = coerceString(formData.get("message"));
  const company = coerceString(formData.get("company"));
  const startedAtRaw = coerceString(formData.get("startedAt"));

  if (company) {
    return reply(request, 400, { message: "Unable to send this message." }, "error");
  }

  const now = Date.now();
  const startedAt = Number.parseInt(startedAtRaw, 10);
  const elapsed = Number.isFinite(startedAt) ? now - startedAt : MIN_ELAPSED_MS;
  if (elapsed < MIN_ELAPSED_MS) {
    return reply(request, 400, { message: "Please wait a moment before submitting the form." }, "error", "too-fast");
  }

  if (!name || !email || !message) {
    return reply(request, 400, { message: "All fields are required." }, "error", "invalid" );
  }

  if (message.length < MIN_MESSAGE_LENGTH) {
    return reply(request, 400, { message: "Please share at least 20 characters so I have context." }, "error", "short" );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return reply(request, 400, { message: "Please use a valid email address." }, "error", "invalid-email" );
  }

  const clientId = getClientId(request);
  if (!enforceRateLimit(clientId)) {
    return reply(
      request,
      429,
      { message: "You're sending messages too quickly. Please wait and try again." },
      "error",
      "rate-limit"
    );
  }

  const safeName = escapeHTML(name);
  const safeEmail = escapeHTML(email);
  const safeMessage = escapeHTML(message).replace(/\n/g, "<br />");

  try {
    const { error } = await resendClient.emails.send({
      from: contactFrom,
      to: [contactTo],
      subject: `Portfolio contact from ${safeName}`,
      reply_to: email,
      text: `Name: ${safeName}\nEmail: ${safeEmail}\n\n${message}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    if (error) {
      console.error("Resend error", error);
      return reply(
        request,
        502,
        { message: "The mail provider is unavailable. Please email me directly." },
        "error",
        "mail-error"
      );
    }

    return reply(request, 200, { message: "Message received! I'll be in touch shortly." }, "success");
  } catch (error) {
    console.error("Contact form failure", error);
    return reply(
      request,
      500,
      { message: "Something went wrong. Please send an email instead." },
      "error",
      "server"
    );
  }
};
