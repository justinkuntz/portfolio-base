(() => {
  const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const root = document.documentElement;

  function withTransitionsDisabled(callback) {
    const css = document.createElement("style");
    css.appendChild(
      document.createTextNode(
        `* {
          -webkit-transition: none !important;
          -moz-transition: none !important;
          -o-transition: none !important;
          -ms-transition: none !important;
          transition: none !important;
        }`,
      ),
    );
    document.head.appendChild(css);
    callback();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.head.removeChild(css);
      });
    });
  }

  function getStoredTheme() {
    try {
      const value = localStorage.getItem("theme");
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  }

  function getSystemTheme() {
    return themeQuery.matches ? "dark" : "light";
  }

  function getResolvedTheme() {
    return getStoredTheme() ?? getSystemTheme();
  }

  function syncThemeToggles(theme) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.dataset.theme = theme;
      button.setAttribute("aria-pressed", String(theme === "dark"));
      button.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
      button.setAttribute("title", `Switch to ${nextTheme} theme`);
      const label = button.querySelector("[data-theme-toggle-label]");
      if (label) {
        label.textContent = `Switch to ${nextTheme} theme`;
      }

      if (button.dataset.themeToggleReady !== "true") {
        requestAnimationFrame(() => {
          button.dataset.themeToggleReady = "true";
        });
      }
    });
  }

  function setThemeOnRoot(theme) {
    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
  }

  function applyTheme(theme, { persist = false } = {}) {
    withTransitionsDisabled(() => {
      setThemeOnRoot(theme);
      syncThemeToggles(theme);
    });

    if (persist) {
      try {
        localStorage.setItem("theme", theme);
      } catch {
        // Ignore storage failures.
      }
    }

  }

  function toggleTheme() {
    const currentTheme = root.classList.contains("dark") ? "dark" : "light";
    applyTheme(currentTheme === "dark" ? "light" : "dark", { persist: true });
  }

  function bindThemeToggle(button) {
    if (button.dataset.themeToggleBound === "true") return;
    button.dataset.themeToggleBound = "true";
    button.addEventListener("click", toggleTheme);
  }

  function initTheme() {
    const theme = root.dataset.theme || getResolvedTheme();
    setThemeOnRoot(theme);
    syncThemeToggles(theme);
    document.querySelectorAll("[data-theme-toggle]").forEach(bindThemeToggle);
  }

  themeQuery.addEventListener("change", () => {
    if (getStoredTheme()) return;
    applyTheme(getSystemTheme());
  });

  document.addEventListener("DOMContentLoaded", initTheme);
  document.addEventListener("astro:after-swap", initTheme);

  initTheme();
})();
