import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_PREFIX = "project_access_";

type LegacyAccess = {
  visibility?: "public" | "protected";
  passwordId?: string;
  hint?: string;
  summary?: string;
};

type ProjectProtectionSource = {
  passwordProtect?: boolean;
  passwordId?: string;
  passwordHint?: string;
  passwordSummary?: string;
  access?: LegacyAccess;
};

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sanitizePasswordId(passwordId: string) {
  return passwordId.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
}

function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function getProjectProtection(source: ProjectProtectionSource) {
  if (source.passwordProtect) {
    return {
      isProtected: true,
      passwordId: source.passwordId,
      hint: source.passwordHint,
      summary: source.passwordSummary,
    };
  }

  if (source.access?.visibility === "protected") {
    return {
      isProtected: true,
      passwordId: source.access.passwordId,
      hint: source.access.hint,
      summary: source.access.summary,
    };
  }

  return {
    isProtected: false,
    passwordId: undefined,
    hint: undefined,
    summary: undefined,
  };
}

export function getProjectPasswordId(source: ProjectProtectionSource, slug: string) {
  const protection = getProjectProtection(source);

  if (!protection.isProtected) return undefined;
  return protection.passwordId ?? slug;
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function getProjectAccessCookieName(slug: string) {
  return `${COOKIE_PREFIX}${slug}`;
}

export function createProjectAccessCookieValue(
  slug: string,
  passwordId: string,
  secret: string
) {
  const payload = toBase64Url(JSON.stringify({ slug, passwordId }));
  const signature = signPayload(payload, secret);
  return `${payload}.${signature}`;
}

export function hasValidProjectAccessCookie(
  cookieValue: string | undefined,
  slug: string,
  passwordId: string,
  secret: string | undefined
) {
  if (!cookieValue || !secret) return false;

  const [payload, signature] = cookieValue.split(".");
  if (!payload || !signature) return false;

  const expectedSignature = signPayload(payload, secret);
  const provided = Buffer.from(signature, "utf8");
  const expected = Buffer.from(expectedSignature, "utf8");

  if (provided.length !== expected.length) return false;
  if (!timingSafeEqual(provided, expected)) return false;

  try {
    const parsed = JSON.parse(fromBase64Url(payload)) as {
      slug?: string;
      passwordId?: string;
    };
    return parsed.slug === slug && parsed.passwordId === passwordId;
  } catch {
    return false;
  }
}

export function resolveProjectPassword(passwordId: string) {
  const json = import.meta.env.PROJECT_ACCESS_PASSWORDS;
  if (json) {
    try {
      const passwords = JSON.parse(json) as Record<string, string>;
      const fromMap = passwords[passwordId];
      if (typeof fromMap === "string" && fromMap.length > 0) {
        return fromMap;
      }
    } catch {
      // Ignore malformed JSON and continue to env-key fallback.
    }
  }

  const envKey = `PROJECT_PASSWORD_${sanitizePasswordId(passwordId)}`;
  const envValue = (import.meta.env as Record<string, string | undefined>)[envKey];
  if (typeof envValue === "string" && envValue.length > 0) {
    return envValue;
  }

  const globalPassword = import.meta.env.PROJECT_ACCESS_PASSWORD;
  return typeof globalPassword === "string" && globalPassword.length > 0
    ? globalPassword
    : undefined;
}

export function passwordMatches(input: string, expected: string) {
  const provided = Buffer.from(input, "utf8");
  const target = Buffer.from(expected, "utf8");

  if (provided.length !== target.length) return false;
  return timingSafeEqual(provided, target);
}
