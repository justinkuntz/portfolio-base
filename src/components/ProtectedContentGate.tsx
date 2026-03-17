import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { PROTECTED_PROJECTS } from "@consts";
import styles from "./ProtectedContentGate.module.css";

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

  let bodyRef: HTMLDivElement | undefined;
  let loginPanelRef: HTMLDivElement | undefined;
  let requestPanelRef: HTMLDivElement | undefined;

  const syncHeight = () => {
    const target = mode() === "login" ? loginPanelRef : requestPanelRef;
    if (!bodyRef || !target) return;
    bodyRef.style.setProperty("--gate-panel-height", `${target.scrollHeight}px`);
  };

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

  onMount(() => {
    syncHeight();

    const observer = new ResizeObserver(() => syncHeight());
    if (loginPanelRef) observer.observe(loginPanelRef);
    if (requestPanelRef) observer.observe(requestPanelRef);
    window.addEventListener("resize", syncHeight);

    onCleanup(() => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeight);
    });
  });

  createEffect(() => {
    mode();
    requestAnimationFrame(() => syncHeight());
  });

  return (
    <section class={styles.root} aria-labelledby="protected-content-title">
      <div class={styles.head}>
        <div class={styles.iconWrap} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" class={styles.icon}>
            <path 
              d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288"    
              stroke="currentColor"
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            />
          </svg>
        </div>
        {PROTECTED_PROJECTS.EYEBROW && (
          <p class={styles.eyebrow}>{PROTECTED_PROJECTS.EYEBROW}</p>
        )}
        <h2 id="protected-content-title" class={styles.title}>
          {PROTECTED_PROJECTS.TITLE}
        </h2>
        <p class={styles.description}>
          {PROTECTED_PROJECTS.DESCRIPTION}
        </p>
      </div>

      <div class={styles.segment} data-mode={mode()}>
        <div class={styles.segmentThumb} aria-hidden="true" />
        <button
          type="button"
          class={styles.segmentButton}
          aria-pressed={mode() === "login"}
          onClick={() => setMode("login")}
        >
          {PROTECTED_PROJECTS.LOGIN_TAB_TEXT}
        </button>
        <button
          type="button"
          class={styles.segmentButton}
          aria-pressed={mode() === "request"}
          onClick={() => setMode("request")}
        >
          {PROTECTED_PROJECTS.REQUEST_TAB_TEXT}
        </button>
      </div>

      <div class={styles.body} ref={bodyRef}>
        <div
          ref={loginPanelRef}
          classList={{
            [styles.panel]: true,
            [styles.panelActive]: mode() === "login",
          }}
          aria-hidden={mode() !== "login"}
        >
          <form class={styles.form} onSubmit={submitLogin}>
            <label class={styles.label} for={`gate-email-${slug}`}>
              {PROTECTED_PROJECTS.EMAIL_LABEL}
            </label>
            <input
              id={`gate-email-${slug}`}
              class={styles.input}
              type="email"
              name="email"
              inputmode="email"
              autocomplete="email"
              placeholder={PROTECTED_PROJECTS.EMAIL_PLACEHOLDER}
              value={email()}
              onInput={(event) => setEmail(event.currentTarget.value)}
              required
            />

            <label class={styles.label} for={`gate-password-${slug}`}>
              {PROTECTED_PROJECTS.PASSWORD_LABEL}
            </label>
            <input
              id={`gate-password-${slug}`}
              class={styles.input}
              type="password"
              name="password"
              autocomplete="current-password"
              placeholder={PROTECTED_PROJECTS.PASSWORD_PLACEHOLDER}
              value={password()}
              onInput={(event) => setPassword(event.currentTarget.value)}
              required
            />

            <button class={styles.submit} type="submit" disabled={loginPending()}>
              {loginPending() ? "Unlocking..." : PROTECTED_PROJECTS.LOGIN_SUBMIT_TEXT}
            </button>

            <p class={styles.meta}>
              By logging in you agree to the{" "}
              <a href={PROTECTED_PROJECTS.NDA_HREF} class={styles.inlineLink}>
                {PROTECTED_PROJECTS.NDA_TEXT}
              </a>
              .
            </p>

            <p class={styles.switcher}>
              {PROTECTED_PROJECTS.LOGIN_FOOTER_PREFIX}{" "}
              <button
                type="button"
                class={styles.textButton}
                onClick={() => setMode("request")}
              >
                {PROTECTED_PROJECTS.LOGIN_FOOTER_ACTION_TEXT}
              </button>
            </p>

            <p
              classList={{
                [styles.feedback]: true,
                [styles.feedbackError]: Boolean(loginFeedback()),
              }}
              hidden={!loginFeedback()}
            >
              {loginFeedback()}
            </p>
          </form>
        </div>

        <div
          ref={requestPanelRef}
          classList={{
            [styles.panel]: true,
            [styles.panelActive]: mode() === "request",
          }}
          aria-hidden={mode() !== "request"}
        >
          <form class={styles.form} onSubmit={submitRequest}>
            <label class={styles.label} for={`gate-request-email-${slug}`}>
              {PROTECTED_PROJECTS.EMAIL_LABEL}
            </label>
            <input
              id={`gate-request-email-${slug}`}
              class={styles.input}
              type="email"
              name="email"
              inputmode="email"
              autocomplete="email"
              placeholder={PROTECTED_PROJECTS.EMAIL_PLACEHOLDER}
              value={email()}
              onInput={(event) => setEmail(event.currentTarget.value)}
              required
            />

            <label class={styles.label} for={`gate-request-message-${slug}`}>
              {PROTECTED_PROJECTS.REQUEST_MESSAGE_LABEL}
            </label>
            <textarea
              id={`gate-request-message-${slug}`}
              class={`${styles.input} ${styles.textarea}`}
              name="message"
              placeholder={PROTECTED_PROJECTS.REQUEST_MESSAGE_PLACEHOLDER}
              value={requestMessage()}
              onInput={(event) => setRequestMessage(event.currentTarget.value)}
              required
            />

            <button class={styles.submit} type="submit" disabled={requestPending()}>
              {requestPending() ? "Sending..." : PROTECTED_PROJECTS.REQUEST_SUBMIT_TEXT}
            </button>

            <p class={styles.switcher}>
              {PROTECTED_PROJECTS.REQUEST_FOOTER_PREFIX}{" "}
              <button
                type="button"
                class={styles.textButton}
                onClick={() => setMode("login")}
              >
                {PROTECTED_PROJECTS.REQUEST_FOOTER_ACTION_TEXT}
              </button>
            </p>

            <p
              classList={{
                [styles.feedback]: true,
                [styles.feedbackSuccess]: Boolean(requestFeedback()),
              }}
              hidden={!requestFeedback()}
            >
              {requestFeedback()}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
