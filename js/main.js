// Adelin Solutions — interacțiunile paginii principale
(() => {
  const WA = "40750210645";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wa = (text) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;

  $("#year").textContent = new Date().getFullYear();

  /* ---------- Linkuri WhatsApp cu mesaj pregătit ---------- */
  $$("[data-wa]").forEach((a) => (a.href = wa(a.dataset.wa)));
  const choices = $("#choices");
  const setMain = () => {
    const pick = $('[aria-pressed="true"]', choices).dataset.msg;
    const text = pick ? `Salut, Adelin! Sunt interesat de ${pick}. Putem discuta?` : "Salut, Adelin! Am văzut site-ul tău și aș vrea să aflu cum mă poți ajuta.";
    $("#wa-main").href = wa(text); $("#wa-num").href = wa(text);
  };
  choices.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    $$("button", choices).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); setMain();
  });
  setMain();

  /* ---------- Previzualizări live ale demo-urilor ---------- */
  const PV_W = 1280;
  const fit = (pv) => {
    const f = pv.firstElementChild; if (!f || !pv.clientWidth) return;
    const s = pv.clientWidth / PV_W;
    f.style.transform = `scale(${s})`; f.style.height = Math.ceil(pv.clientHeight / s) + "px";
  };
  const ro = "ResizeObserver" in window ? new ResizeObserver((es) => es.forEach((e) => fit(e.target))) : null;
  function loadPreview(pv) {
    if (pv.dataset.loaded) return; pv.dataset.loaded = "1";
    const f = document.createElement("iframe");
    f.src = pv.dataset.src; f.title = "Previzualizare demo"; f.tabIndex = -1; f.setAttribute("aria-hidden", "true"); f.setAttribute("scrolling", "no");
    f.addEventListener("load", () => {
      try { // același domeniu: ascund barele de demo în previzualizare
        const st = f.contentDocument.createElement("style");
        st.textContent = ".demo-bar,.sticky-cta,.bar,.fab{display:none!important}body{padding-bottom:0!important;overflow:hidden!important}html{scroll-behavior:smooth}";
        f.contentDocument.head.appendChild(st);
      } catch (_) { /* deschis ca fișier local: previzualizarea rămâne nemodificată */ }
      pv.classList.add("is-ready");
    });
    pv.appendChild(f); fit(pv); ro && ro.observe(pv);
  }
  const previews = $$(".pv");
  previews.filter((p) => "eager" in p.dataset).forEach(loadPreview);
  addEventListener("resize", () => previews.forEach(fit));
  // la hover, demo-ul derulează singur ca să arate mai mult din pagină
  $$(".demo").forEach((card) => {
    const scrollTo = (top) => { try { $("iframe", card).contentWindow.scrollTo({ top, behavior: reduced ? "auto" : "smooth" }); } catch (_) {} };
    card.addEventListener("mouseenter", () => scrollTo(560));
    card.addEventListener("mouseleave", () => scrollTo(0));
  });

  /* ---------- Tot ce depinde de scroll ---------- */
  const nav = $("#nav"), fab = $(".fab"), tilt = $(".stage__tilt"), stage = $("#stage");
  const pending = $$(".reveal");
  pending.forEach((el, i) => (el.style.transitionDelay = (i % 3) * 90 + "ms"));
  const words = (() => {
    const m = $("#manifest"), accent = ["cifrele,", "programări", "târziu", "toate", "trei."];
    m.innerHTML = m.textContent.trim().split(/\s+/).map((w) => `<span class="${accent.includes(w) ? "hl" : ""}">${w}</span>`).join(" ");
    return $$("span", m);
  })();
  const sections = $$(".nav__links a").map((a) => [a, $(a.getAttribute("href"))]);
  const counters = $$("[data-count]"); let counted = false;

  function onScroll() {
    const y = scrollY, vh = innerHeight;
    nav.classList.toggle("is-stuck", y > 30);
    fab.classList.toggle("is-on", y > vh * 0.7);
    // scena se îndreaptă pe măsură ce derulezi
    if (!reduced && tilt) { const p = Math.min(1, y / (vh * 0.55)); tilt.style.setProperty("--rx", (22 * (1 - p)).toFixed(2) + "deg"); }
    for (let i = pending.length - 1; i >= 0; i--)
      if (pending[i].getBoundingClientRect().top < vh * 0.9) pending.splice(i, 1)[0].classList.add("is-visible");
    previews.forEach((pv) => { if (!pv.dataset.loaded && pv.clientWidth && pv.getBoundingClientRect().top < vh * 1.6) loadPreview(pv); });
    // textul se „aprinde” cuvânt cu cuvânt
    const r = $("#manifest").getBoundingClientRect();
    const prog = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (vh * 0.5 + r.height * 0.5)));
    words.forEach((w, i) => w.classList.toggle("on", reduced || i < prog * words.length + 0.5));
    // secțiunea activă în meniu
    let cur = null;
    sections.forEach(([a, s]) => { if (s && s.getBoundingClientRect().top < vh * 0.45) cur = a; });
    sections.forEach(([a]) => a.classList.toggle("is-active", a === cur));
    if (!counted && counters[0].getBoundingClientRect().top < vh) { counted = true; counters.forEach(count); }
  }
  function count(el) {
    const target = +el.dataset.count, suffix = el.dataset.suffix || "";
    if (reduced) { el.textContent = target + suffix; return; }
    const t0 = performance.now(), dur = 1500;
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    setTimeout(() => (el.textContent = target + suffix), dur + 200); // siguranță dacă tab-ul e în fundal
  }
  addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); addEventListener("load", onScroll);
  onScroll();

  /* ---------- Mouse: lumină, înclinare, reflexii ---------- */
  if (!reduced && matchMedia("(pointer: fine)").matches) {
    const glow = $(".glow");
    addEventListener("mousemove", (e) => {
      glow.style.setProperty("--gx", e.clientX + "px"); glow.style.setProperty("--gy", e.clientY + "px");
      if (scrollY < innerHeight) tilt.style.setProperty("--ry", ((e.clientX / innerWidth - 0.5) * 7).toFixed(2) + "deg");
    }, { passive: true });
    $$("[data-spot]").forEach((card) => card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px"); card.style.setProperty("--my", e.clientY - r.top + "px");
    }));
  }

  /* ---------- File de demo-uri ---------- */
  const tabs = $("#tabs"), pill = $(".tabs__pill"), demos = $$(".demo");
  function selectTab(filter, scroll) {
    const btn = $(`[data-filter="${filter}"]`, tabs) || $('[data-filter="all"]', tabs);
    $$("button", tabs).forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
    pill.style.setProperty("--x", btn.offsetLeft + "px"); pill.style.setProperty("--w", btn.offsetWidth + "px");
    demos.forEach((d) => d.classList.toggle("is-hidden", filter !== "all" && d.dataset.cat !== filter));
    onScroll();
    if (scroll) $("#proiecte").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }
  tabs.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) selectTab(b.dataset.filter); });
  $$("[data-tab]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); selectTab(a.dataset.tab, true); }));
  const fromHash = { "#dashboarduri": "dashboard", "#site-uri": "web", "#automatizari": "auto" }[location.hash];
  const placePill = () => selectTab(($('[aria-selected="true"]', tabs) || {}).dataset?.filter || "all");
  selectTab(fromHash || "all", !!fromHash);
  addEventListener("resize", placePill);
  document.fonts && document.fonts.ready.then(placePill);
})();
