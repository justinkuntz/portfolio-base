import { createSignal } from "solid-js";
import { PROTECTED_PROJECTS } from "@consts";

type Mode = "login" | "request";

type Props = {
  slug: string;
};

export default function ProtectedContentGate({ slug }: Props) {
  const [mode, setMode] = createSignal<Mode>("login");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [requestMessage, setRequestMessage] = createSignal("");
  const [loginFeedback, setLoginFeedback] = createSignal<string | null>(null);
  const [requestFeedback, setRequestFeedback] = createSignal<string | null>(null);
  const [loginPending, setLoginPending] = createSignal(false);
  const [requestPending, setRequestPending] = createSignal(false);

  const showLoginFeedback = (message: string) => {
    setLoginFeedback(message);
    setRequestFeedback(null);
  };

  const showRequestFeedback = (message: string) => {
    setRequestFeedback(message);
    setLoginFeedback(null);
  };

  const submitLogin = async (event: SubmitEvent) => {
    event.preventDefault();
    setLoginFeedback(null);

    if (!email().trim() || !password().trim()) {
      showLoginFeedback("Please enter your email and project password.");
      return;
    }

    setLoginPending(true);

    try {
      const response = await fetch(`/api/project-access?slug=${encodeURIComponent(slug)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          email: email().trim(),
          password: password().trim(),
        }),
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.ok && result?.redirectTo) {
        window.location.assign(result.redirectTo as string);
        return;
      }

      showLoginFeedback(
        (result?.message as string | undefined)
          ?? "Unable to unlock this content right now."
      );
    } catch {
      showLoginFeedback("Unable to unlock this content right now.");
    } finally {
      setLoginPending(false);
    }
  };

  const submitRequest = async (event: SubmitEvent) => {
    event.preventDefault();
    setRequestFeedback(null);

    if (!email().trim() || !requestMessage().trim()) {
      showRequestFeedback("Please enter your email and access request message.");
      return;
    }

    setRequestPending(true);

    try {
      const response = await fetch(`/api/project-access-request?slug=${encodeURIComponent(slug)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          email: email().trim(),
          message: requestMessage().trim(),
        }),
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.ok) {
        setRequestMessage("");
        showRequestFeedback(
          (result?.message as string | undefined)
            ?? "Request sent. You should hear back soon."
        );
        return;
      }

      showRequestFeedback(
        (result?.message as string | undefined)
          ?? "Unable to send your request right now."
      );
    } catch {
      showRequestFeedback("Unable to send your request right now.");
    } finally {
      setRequestPending(false);
    }
  };

  return (
    <section aria-labelledby="protected-content-title">
      <div>
        {PROTECTED_PROJECTS.EYEBROW && (
          <p>{PROTECTED_PROJECTS.EYEBROW}</p>
        )}
        <h2 id="protected-content-title">
          {PROTECTED_PROJECTS.TITLE}
        </h2>
        <p>
          {PROTECTED_PROJECTS.DESCRIPTION}
        </p>
      </div>

      <div>
        <button
          type="button"
          aria-pressed={mode() === "login"}
          onClick={() => setMode("login")}
        >
          {PROTECTED_PROJECTS.LOGIN_TAB_TEXT}
        </button>
        <button
          type="button"
          aria-pressed={mode() === "request"}
          onClick={() => setMode("request")}
        >
          {PROTECTED_PROJECTS.REQUEST_TAB_TEXT}
        </button>
      </div>

      <div>
        <div
          hidden={mode() !== "login"}
          aria-hidden={mode() !== "login"}
        >
          <form onSubmit={submitLogin}>
            <div>
              <label for={`gate-email-${slug}`}>
                {PROTECTED_PROJECTS.EMAIL_LABEL}
              </label>
              <input
                id={`gate-email-${slug}`}
                type="email"
                name="email"
                inputmode="email"
                autocomplete="email"
                placeholder={PROTECTED_PROJECTS.EMAIL_PLACEHOLDER}
                value={email()}
                onInput={(event) => setEmail(event.currentTarget.value)}
                required
              />
            </div>

            <div>
              <label for={`gate-password-${slug}`}>
                {PROTECTED_PROJECTS.PASSWORD_LABEL}
              </label>
              <input
                id={`gate-password-${slug}`}
                type="password"
                name="password"
                autocomplete="current-password"
                placeholder={PROTECTED_PROJECTS.PASSWORD_PLACEHOLDER}
                value={password()}
                onInput={(event) => setPassword(event.currentTarget.value)}
                required
              />
            </div>

            <button type="submit" disabled={loginPending()}>
              {loginPending() ? "Unlocking..." : PROTECTED_PROJECTS.LOGIN_SUBMIT_TEXT}
            </button>

            <p>
              By logging in you agree to the{" "}
              <a href={PROTECTED_PROJECTS.NDA_HREF}>
                {PROTECTED_PROJECTS.NDA_TEXT}
              </a>
              .
            </p>

            <p>
              {PROTECTED_PROJECTS.LOGIN_FOOTER_PREFIX}{" "}
              <button
                type="button"
                onClick={() => setMode("request")}
              >
                {PROTECTED_PROJECTS.LOGIN_FOOTER_ACTION_TEXT}
              </button>
            </p>

            <p role="status" aria-live="polite" hidden={!loginFeedback()}>
              {loginFeedback()}
            </p>
          </form>
        </div>

        <div
          hidden={mode() !== "request"}
          aria-hidden={mode() !== "request"}
        >
          <form onSubmit={submitRequest}>
            <div>
              <label for={`gate-request-email-${slug}`}>
                {PROTECTED_PROJECTS.EMAIL_LABEL}
              </label>
              <input
                id={`gate-request-email-${slug}`}
                type="email"
                name="email"
                inputmode="email"
                autocomplete="email"
                placeholder={PROTECTED_PROJECTS.EMAIL_PLACEHOLDER}
                value={email()}
                onInput={(event) => setEmail(event.currentTarget.value)}
                required
              />
            </div>

            <div>
              <label for={`gate-request-message-${slug}`}>
                {PROTECTED_PROJECTS.REQUEST_MESSAGE_LABEL}
              </label>
              <textarea
                id={`gate-request-message-${slug}`}
                name="message"
                placeholder={PROTECTED_PROJECTS.REQUEST_MESSAGE_PLACEHOLDER}
                value={requestMessage()}
                onInput={(event) => setRequestMessage(event.currentTarget.value)}
                required
              />
            </div>

            <button type="submit" disabled={requestPending()}>
              {requestPending() ? "Sending..." : PROTECTED_PROJECTS.REQUEST_SUBMIT_TEXT}
            </button>

            <p>
              {PROTECTED_PROJECTS.REQUEST_FOOTER_PREFIX}{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
              >
                {PROTECTED_PROJECTS.REQUEST_FOOTER_ACTION_TEXT}
              </button>
            </p>

            <p role="status" aria-live="polite" hidden={!requestFeedback()}>
              {requestFeedback()}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
