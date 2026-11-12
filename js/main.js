// Adelin Solutions — interacciones
(() => {
  // Año en el pie
  document.getElementById("year").textContent = new Date().getFullYear();

  // Menú móvil
  const sidebar = document.getElementById("sidebar");
  const toggle = document.querySelector(".menu-toggle");
  const setMenu = (open) => {
    sidebar.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => setMenu(!sidebar.classList.contains("is-open")));
  document.querySelectorAll(".nav__link, .sidebar .btn").forEach((a) =>
    a.addEventListener("click", () => setMenu(false))
  );

  // Sección activa en el menú lateral
  const links = [...document.querySelectorAll(".nav__link")];
  const sections = links.map((l) => document.querySelector(l.getAttribute("href")));
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + e.target.id));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => s && spy.observe(s));

  // Aparición al hacer scroll
  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          reveal.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 80 + "ms";
    reveal.observe(el);
  });

  // Contadores
  const counters = document.querySelectorAll("[data-count]");
  const count = (el) => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || "";
    const start = performance.now();
    const dur = 1400;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  counters.forEach((c) => count(c));

  // Filtros de proyectos
  const filters = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project");
  filters.forEach((btn) =>
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.toggle("is-active", b === btn));
      const f = btn.dataset.filter;
      projects.forEach((p) => p.classList.toggle("is-hidden", f !== "all" && p.dataset.cat !== f));
    })
  );

  // Brillo que sigue al ratón en las tarjetas de servicio
  document.querySelectorAll(".service").forEach((card) =>
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    })
  );
})();
