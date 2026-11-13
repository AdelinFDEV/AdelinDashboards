/* Demo-uri de automatizări · Adelin Solutions — motorul care desenează și „rulează” fluxul */
const Auto = (() => {
  const NS = "http://www.w3.org/2000/svg";
  const ICONS = {
    form: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/>',
    ai: '<path d="M12 3l1.800 4.700L18.500 9.500l-4.700 1.800L12 16l-1.800-4.700L5.500 9.500l4.700-1.800z"/><path d="M18.500 15l.800 2.200 2.200.800-2.200.800-.800 2.200-.800-2.200-2.200-.800 2.200-.800z"/>',
    sheet: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h3M8 17h6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    split: '<path d="M4 12h6M10 12c4 0 4-6 10-6M10 12c4 0 4 6 10 6"/><path d="M17 3l3 3-3 3M17 15l3 3-3 3"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    drive: '<path d="M4 7h6l2 2h8v10H4z"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    book: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11M9 8h6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.400 3.600-7 8-7s8 2.600 8 7"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  };
  const COL = 116, ROW = 128, X0 = 62, Y0 = 24, TILE = 62;
  const sleep = (ms) => new Promise((r) => setTimeout(r, matchMedia("(prefers-reduced-motion: reduce)").matches ? Math.min(ms, 120) : ms));
  const nf = new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  let cfg, els = {}, edgeEls = [], done, outs, clock, busy = false;
  const $ = (id) => document.getElementById(id);

  function init(config) {
    cfg = config;
    const canvas = $("canvas");
    const maxC = Math.max(...cfg.nodes.map((n) => n.col)), maxR = Math.max(...cfg.nodes.map((n) => n.row));
    const W = X0 * 2 + maxC * COL, H = Y0 + maxR * ROW + TILE + 62;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    const svg = document.createElementNS(NS, "svg"); svg.setAttribute("viewBox", `0 0 ${W} ${H}`); canvas.appendChild(svg);
    const pos = (n) => ({ x: X0 + n.col * COL, y: Y0 + n.row * ROW + TILE / 2 });
    const byId = Object.fromEntries(cfg.nodes.map((n) => [n.id, n]));
    edgeEls = cfg.edges.map(([a, b, label]) => {
      const p = pos(byId[a]), q = pos(byId[b]);
      const x1 = p.x + TILE / 2, x2 = q.x - TILE / 2, mx = (x1 + x2) / 2;
      const path = document.createElementNS(NS, "path");
      path.setAttribute("d", `M${x1},${p.y} C${mx},${p.y} ${mx},${q.y} ${x2},${q.y}`); path.setAttribute("class", "edge"); svg.appendChild(path);
      if (label) { const t = document.createElementNS(NS, "text"); t.setAttribute("x", x2 - 6); t.setAttribute("y", q.y - 8); t.setAttribute("text-anchor", "end"); t.setAttribute("class", "edge-label"); t.textContent = label; svg.appendChild(t); }
      return { a, b, path };
    });
    cfg.nodes.forEach((n) => {
      const p = pos(n), b = document.createElement("button");
      b.type = "button"; b.className = `node node--${n.kind || "app"}`; b.style.left = p.x + "px"; b.style.top = Y0 + n.row * ROW + "px";
      b.innerHTML = `<span class="node__tile"><svg viewBox="0 0 24 24">${ICONS[n.icon]}</svg>${n.kind === "ai" ? '<span class="badge-ai">AI</span>' : ""}</span><span class="node__title">${n.title}</span><span class="node__sub">${n.sub || ""}</span>`;
      b.addEventListener("click", () => showData(n.id));
      canvas.appendChild(b); els[n.id] = b;
    });
    reset();
  }

  function setStatus(cls, text) { const s = $("status"); s.className = "status " + cls; s.lastElementChild.textContent = text; }

  function reset() {
    done = new Set(); outs = {}; clock = 0;
    Object.values(els).forEach((e) => e.classList.remove("is-run", "is-done", "is-skip", "is-sel"));
    edgeEls.forEach((e) => e.path.setAttribute("class", "edge"));
    $("data").innerHTML = `<span class="hint">Aici apar datele care trec prin fiecare pas. După rulare, apasă pe orice pas din flux ca să vezi ce a primit și ce a produs.</span>`;
    $("log").innerHTML = `<li class="hint" style="display:block">Jurnalul execuției apare aici, pas cu pas.</li>`;
    const s = $("summary"); if (s) s.hidden = true;
    setStatus("", "În așteptare");
  }

  function showData(id) {
    const o = outs[id]; if (!o) return;
    Object.entries(els).forEach(([k, e]) => e.classList.toggle("is-sel", k === id));
    $("data").innerHTML = Object.entries(o).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
    $("data-title").textContent = "Date · " + cfg.nodes.find((n) => n.id === id).title;
  }

  function begin() { reset(); busy = true; setStatus("run", "Rulează…"); $("log").innerHTML = ""; document.querySelectorAll("[data-lock]").forEach((b) => (b.disabled = true)); }

  async function step(id, { ms = 750, sec = 0.4, out, log, from } = {}) {
    const el = els[id], node = cfg.nodes.find((n) => n.id === id);
    const incoming = edgeEls.filter((e) => e.b === id && done.has(e.a) && (!from || e.a === from));
    incoming.forEach((e) => e.path.setAttribute("class", "edge is-live"));
    el.classList.add("is-run");
    const wrap = $("canvas").parentElement, r = el.offsetLeft - wrap.clientWidth / 2;
    if (wrap.scrollWidth > wrap.clientWidth) wrap.scrollTo({ left: r, behavior: "smooth" });
    await sleep(ms);
    clock += sec;
    el.classList.remove("is-run"); el.classList.add("is-done"); done.add(id);
    incoming.forEach((e) => e.path.setAttribute("class", "edge is-done"));
    if (out) { outs[id] = out; showData(id); }
    if (log) {
      const li = document.createElement("li");
      li.innerHTML = `<time>${nf.format(clock)} s</time><div><b>${node.title}</b> <span>— ${log}</span></div>`;
      $("log").appendChild(li); $("log").scrollTop = $("log").scrollHeight;
    }
  }

  function skip(ids) { ids.forEach((id) => els[id].classList.add("is-skip")); }

  function end(html) {
    busy = false; setStatus("ok", `Finalizat în ${nf.format(clock)} s`);
    const s = $("summary"); if (s && html) { s.innerHTML = html.replace("{t}", nf.format(clock)); s.hidden = false; }
    document.querySelectorAll("[data-lock]").forEach((b) => (b.disabled = false));
  }

  /* Chat tip WhatsApp */
  function chat(box) {
    const time = () => new Date().toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
    const bottom = () => (box.scrollTop = box.scrollHeight);
    return {
      add(kind, text, who) {
        const d = document.createElement("div"); d.className = "msg msg--" + kind;
        d.innerHTML = (who ? `<b class="who">${esc(who)}</b>` : "") + esc(text) + (kind === "sys" ? "" : `<small>${time()}${kind === "out" ? " ✓✓" : ""}</small>`);
        box.appendChild(d); bottom(); return d;
      },
      async typing(ms = 900) {
        const t = document.createElement("div"); t.className = "typing"; t.innerHTML = "<i></i><i></i><i></i>";
        box.appendChild(t); bottom(); await sleep(ms); t.remove();
      },
      clear() { box.innerHTML = ""; },
    };
  }

  return { init, reset, begin, step, skip, end, sleep, chat, esc, get busy() { return busy; } };
})();
