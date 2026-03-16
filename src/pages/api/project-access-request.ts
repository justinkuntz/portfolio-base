import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { Resend } from "resend";
import { isValidEmail } from "@lib/project-access";

export const prerender = false;

const resendApiKey = import.meta.env.RESEND_API_KEY;
const contactFrom = import.meta.env.CONTACT_FROM_EMAIL;
const accessNotifyTo = import.meta.env.PROJECT_ACCESS_NOTIFY_TO_EMAIL ?? import.meta.env.CONTACT_TO_EMAIL;
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;
const MIN_MESSAGE_LENGTH = 20;

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

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "anonymous";
  }

  return request.headers.get("cf-connecting-ip")
    || request.headers.get("x-real-ip")
    || "anonymous";
}

async function parseRequest(request: Request) {
  const url = new URL(request.url);
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = await request.json() as { slug?: string; email?: string; message?: string };
    return {
      slug: (url.searchParams.get("slug") ?? body.slug ?? "").trim(),
      email: (body.email ?? "").trim(),
      message: (body.message ?? "").trim(),
    };
  }

  const body = await request.text();
  const params = new URLSearchParams(body);
  return {
    slug: (url.searchParams.get("slug") ?? params.get("slug") ?? "").trim(),
    email: (params.get("email") ?? "").trim(),
    message: (params.get("message") ?? "").trim(),
  };
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { slug, email, message } = await parseRequest(request);

    if (!slug || !email || !message) {
      return jsonResponse(
        { ok: false, message: "Please enter your email and request message." },
        400,
      );
    }

    if (!isValidEmail(email)) {
      return jsonResponse(
        { ok: false, message: "Please use a valid email address." },
        400,
      );
    }

    if (message.length < MIN_MESSAGE_LENGTH) {
      return jsonResponse(
        { ok: false, message: `Please share at least ${MIN_MESSAGE_LENGTH} characters so the request has context.` },
        400,
      );
    }

    const projects = (await getCollection("projects")).filter((entry) => !entry.data.draft);
    const project = projects.find((entry) => entry.id === slug);

    if (!project) {
      return jsonResponse(
        { ok: false, message: "This project could not be found." },
        404,
      );
    }

    if (!resendClient || !contactFrom || !accessNotifyTo) {
      return jsonResponse(
        { ok: false, message: "Request access is unavailable right now." },
        503,
      );
    }

    const ip = getClientIp(request);
    const timestamp = new Date().toISOString();
    const safeProjectTitle = escapeHTML(project.data.title);
    const safeProjectSlug = escapeHTML(project.id);
    const safeEmail = escapeHTML(email);
    const safeMessage = escapeHTML(message).replace(/\n/g, "<br />");
    const safeTimestamp = escapeHTML(timestamp);
    const safeIp = escapeHTML(ip);

    const { error } = await resendClient.emails.send({
      from: contactFrom,
      to: [accessNotifyTo],
      subject: `[Protected Project] Access request for ${project.data.title}`,
      replyTo: email,
      text: [
        "Protected project access request",
        `Project: ${project.data.title} (${project.id})`,
        `Email: ${email}`,
        `Timestamp: ${timestamp}`,
        `IP: ${ip}`,
        "",
        message,
      ].join("\n"),
      html: `
        <h2>Protected project access request</h2>
        <p><strong>Project:</strong> ${safeProjectTitle} (${safeProjectSlug})</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Timestamp:</strong> ${safeTimestamp}</p>
        <p><strong>IP:</strong> ${safeIp}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    if (error) {
      console.error("[project-access-request] mail error", error);
      return jsonResponse(
        { ok: false, message: "Unable to send your request right now." },
        502,
      );
    }

    return jsonResponse({
      ok: true,
      message: "Request sent. You should hear back soon.",
    });
  } catch (error) {
    console.error("[project-access-request] failure", error);
    return jsonResponse(
      { ok: false, message: "Unable to send your request right now." },
      500,
    );
  }
};
