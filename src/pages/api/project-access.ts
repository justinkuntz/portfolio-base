import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { Resend } from "resend";
import {
  createProjectAccessCookieValue,
  getProjectProtection,
  getProjectPasswordId,
  getProjectAccessCookieName,
  isValidEmail,
  passwordMatches,
  resolveProjectPassword,
} from "@lib/project-access";

export const prerender = false;

const resendApiKey = import.meta.env.RESEND_API_KEY;
const contactFrom = import.meta.env.CONTACT_FROM_EMAIL;
const accessNotifyTo = import.meta.env.PROJECT_ACCESS_NOTIFY_TO_EMAIL ?? import.meta.env.CONTACT_TO_EMAIL;

const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

const htmlEntities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function coerceString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHTML(value: string) {
  return value.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}

function buildProjectRedirect(request: Request, slug: string, status?: string) {
  const destination = new URL(request.url);
  destination.pathname = `/projects/${slug}`;
  destination.search = "";

  if (status) {
    destination.searchParams.set("access", status);
  }

  return destination.toString();
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

async function parseProjectAccessRequest(request: Request) {
  const url = new URL(request.url);
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = await request.json() as { slug?: string; email?: string; password?: string };
    return {
      slug: (url.searchParams.get("slug") ?? body.slug ?? "").trim(),
      email: (body.email ?? "").trim(),
      password: (body.password ?? "").trim(),
    };
  }

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    return {
      slug: (url.searchParams.get("slug") ?? coerceString(formData.get("slug"))).trim(),
      email: coerceString(formData.get("email")),
      password: coerceString(formData.get("password")),
    };
  }

  const body = await request.text();
  const params = new URLSearchParams(body);

  return {
    slug: (url.searchParams.get("slug") ?? params.get("slug") ?? "").trim(),
    email: (params.get("email") ?? "").trim(),
    password: (params.get("password") ?? "").trim(),
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

async function notifyProjectAccessAttempt({
  projectSlug,
  projectTitle,
  email,
  ip,
  success,
  timestamp,
}: {
  projectSlug: string;
  projectTitle: string;
  email: string;
  ip: string;
  success: boolean;
  timestamp: string;
}) {
  if (!resendClient || !contactFrom || !accessNotifyTo) return;

  const safeProjectTitle = escapeHTML(projectTitle);
  const safeProjectSlug = escapeHTML(projectSlug);
  const safeEmail = escapeHTML(email);
  const safeIp = escapeHTML(ip);
  const safeTimestamp = escapeHTML(timestamp);
  const safeStatus = success ? "success" : "failure";

  const text = [
    "Protected project access attempt",
    `Project: ${projectTitle} (${projectSlug})`,
    `Email: ${email}`,
    `Timestamp: ${timestamp}`,
    `IP: ${ip}`,
    `Result: ${safeStatus}`,
  ].join("\n");

  await resendClient.emails.send({
    from: contactFrom,
    to: [accessNotifyTo],
    subject: `[Protected Project] ${safeStatus.toUpperCase()} ${projectTitle}`,
    replyTo: email,
    text,
    html: `
      <h2>Protected project access attempt</h2>
      <p><strong>Project:</strong> ${safeProjectTitle} (${safeProjectSlug})</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Timestamp:</strong> ${safeTimestamp}</p>
      <p><strong>IP:</strong> ${safeIp}</p>
      <p><strong>Result:</strong> ${safeStatus}</p>
    `,
  });
}

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const wantsJson = (request.headers.get("accept") ?? "").includes("application/json")
    || (request.headers.get("content-type") ?? "").includes("application/json");
  try {
    let slug = "";
    let email = "";
    let password = "";
    ({ slug, email, password } = await parseProjectAccessRequest(request));

    if (!slug || !email || !password) {
      if (wantsJson) {
        return jsonResponse(
          { ok: false, status: "missing", message: "Please enter your email and project password." },
          400,
        );
      }
      const destination = slug
        ? buildProjectRedirect(request, slug, "missing")
        : "/projects?access=missing";
      return redirect(destination, 303);
    }

    if (!isValidEmail(email)) {
      if (wantsJson) {
        return jsonResponse(
          { ok: false, status: "invalid-email", message: "Please use a valid email address." },
          400,
        );
      }

      return redirect(buildProjectRedirect(request, slug, "invalid-email"), 303);
    }

    const projects = (await getCollection("projects")).filter((entry) => !entry.data.draft);
    const project = projects.find((entry) => entry.id === slug);

    if (!project) {
      if (wantsJson) {
        return jsonResponse(
          { ok: false, status: "notfound", message: "This project could not be found." },
          404,
        );
      }
      return redirect(`/projects?access=notfound&slug=${encodeURIComponent(slug)}`, 303);
    }

    const protection = getProjectProtection(project.data);
    const passwordId = getProjectPasswordId(project.data, project.id);
    if (!protection.isProtected || !passwordId) {
      if (wantsJson) {
        return jsonResponse(
          { ok: false, status: "notprotected", message: "This project is not configured as protected." },
          400,
        );
      }
      return redirect(buildProjectRedirect(request, slug), 303);
    }

    const secret = import.meta.env.PROJECT_ACCESS_SECRET;
    const expectedPassword = resolveProjectPassword(passwordId);
    const ip = getClientIp(request);
    const timestamp = new Date().toISOString();

    if (!secret || !expectedPassword) {
      if (wantsJson) {
        return jsonResponse(
          {
            ok: false,
            status: "unavailable",
            message:
              "This protected project is not configured correctly yet. Add the matching password env var before sharing it.",
          },
          503,
        );
      }
      return redirect(buildProjectRedirect(request, slug, "unavailable"), 303);
    }

    if (!passwordMatches(password, expectedPassword)) {
      await notifyProjectAccessAttempt({
        projectSlug: project.id,
        projectTitle: project.data.title,
        email,
        ip,
        success: false,
        timestamp,
      }).catch((error) => {
        console.error("[project-access] notify failed", error);
      });

      if (wantsJson) {
        return jsonResponse(
          { ok: false, status: "invalid", message: "That password was incorrect. Please try again." },
          401,
        );
      }
      return redirect(buildProjectRedirect(request, slug, "invalid"), 303);
    }

    cookies.set(
      getProjectAccessCookieName(slug),
      createProjectAccessCookieValue(slug, passwordId, secret),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: new URL(request.url).protocol === "https:",
        path: `/projects/${slug}`,
        maxAge: 60 * 60 * 24 * 5,
      }
    );

    await notifyProjectAccessAttempt({
      projectSlug: project.id,
      projectTitle: project.data.title,
      email,
      ip,
      success: true,
      timestamp,
    }).catch((error) => {
      console.error("[project-access] notify failed", error);
    });

    if (wantsJson) {
      return jsonResponse({ ok: true, redirectTo: buildProjectRedirect(request, slug) });
    }

    return redirect(buildProjectRedirect(request, slug), 303);
  } catch (error) {
    console.error("[project-access] unlock failed", error);

    const message = error instanceof Error
      ? error.message
      : "Unable to unlock this project right now.";

    if (wantsJson) {
      return jsonResponse(
        { ok: false, status: "error", message },
        500,
      );
    }

    return redirect("/projects?access=error", 303);
  }
};
