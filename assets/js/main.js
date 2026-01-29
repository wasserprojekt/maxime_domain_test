(function () {
  // Year in footer
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Active nav link
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const map = {
    "index.html": "index",
    "about.html": "about",
    "projects.html": "projects",
    "contact.html": "contact"
  };
  const key = map[path];
  if (key) {
    document.querySelectorAll(`[data-nav="${key}"]`).forEach(a => a.classList.add("active"));
  }

  // Theme toggle
  const toggleBtn = document.querySelector("[data-theme-toggle]");
  const root = document.documentElement;

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    if (toggleBtn) {
      const icon = toggleBtn.querySelector(".theme-toggle-icon");
      const text = toggleBtn.querySelector(".theme-toggle-text");
      const isDark = theme === "dark";
      if (icon) icon.textContent = isDark ? "☾" : "☀︎";
      if (text) text.textContent = isDark ? "Dark" : "Light";
    }
  }

  if (toggleBtn) {
    // sync initial label
    setTheme(root.dataset.theme || "dark");
    toggleBtn.addEventListener("click", () => {
      const current = root.dataset.theme === "dark" ? "dark" : "light";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  // Mobile nav toggle
  const navToggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      mobileNav.classList.toggle("open");
      const open = mobileNav.classList.contains("open");
      navToggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    });
    // close after click
    mobileNav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => mobileNav.classList.remove("open"));
    });
  }

  // Contact form: char count + AJAX submit (Formspree)
  const form = document.getElementById("contactForm");
  const msg = document.getElementById("message");
  const statusEl = document.getElementById("formStatus");
  const charEl = document.querySelector("[data-char-count]");

  function setStatus(text, ok = true) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.style.color = ok ? "" : "var(--accent-2)";
  }

  if (msg && charEl) {
    const update = () => {
      const max = Number(msg.getAttribute("maxlength")) || 1500;
      charEl.textContent = `${msg.value.length} / ${max}`;
    };
    msg.addEventListener("input", update);
    update();
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Basic HTML constraint validation
      if (!form.checkValidity()) {
        setStatus("Bitte prüfe Betreff und Nachricht (Mindestlängen).", false);
        form.reportValidity();
        return;
      }

      setStatus("Sende…");

      const endpoint = form.getAttribute("action");
      const data = new FormData(form);

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          body: data,
          headers: { "Accept": "application/json" }
        });

        if (res.ok) {
          form.reset();
          if (charEl) charEl.textContent = "0 / 1500";
          setStatus("Gesendet ✅ Danke! Ich melde mich, wenn eine E-Mail angegeben wurde.", true);
        } else {
          setStatus("Hmm… das hat nicht geklappt. Versuch’s später nochmal.", false);
        }
      } catch (err) {
        setStatus("Netzwerkfehler. Bitte später erneut versuchen.", false);
      }
    });
  }
})();
