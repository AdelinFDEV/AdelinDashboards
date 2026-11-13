/* Dashboard-uri demo · Adelin Solutions — motor de grafice fără dependențe */
const D = (() => {
  const NS = "http://www.w3.org/2000/svg";
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- Formatare (ro-RO) ---------- */
  const nf0 = new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 0 });
  const nf1 = new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const num = (n) => nf0.format(Math.round(n));
  const lei = (n) => num(n) + " lei";
  const dec = (n) => nf1.format(n);
  const pct = (n) => dec(n) + "%";
  const short = (n) => (Math.abs(n) >= 1000 ? dec(n / 1000).replace(",0", "") + "k" : num(n));

  /* ---------- Generator pseudo-aleator cu sămânță (date identice la fiecare încărcare) ---------- */
  const rng = (seed) => () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const sum = (a) => a.reduce((s, v) => s + v, 0);

  /* ---------- Tooltip ---------- */
  let tipEl;
  const tip = {
    show(html, e) {
      if (!tipEl) { tipEl = document.createElement("div"); tipEl.className = "tip"; document.body.appendChild(tipEl); }
      tipEl.innerHTML = html;
      tipEl.classList.add("is-on");
      const r = tipEl.getBoundingClientRect();
      let x = e.clientX + 14, y = e.clientY + 14;
      if (x + r.width > innerWidth - 8) x = e.clientX - r.width - 14;
      if (y + r.height > innerHeight - 8) y = e.clientY - r.height - 14;
      tipEl.style.left = Math.max(8, x) + "px";
      tipEl.style.top = Math.max(8, y) + "px";
    },
    hide() { tipEl && tipEl.classList.remove("is-on"); },
  };
  const tipRows = (title, rows) =>
    `<b class="t">${esc(title)}</b>` +
    rows.map((r) => `<p><span>${r.color ? `<i style="background:${r.color}"></i>` : ""}${esc(r.label)}</span><b>${esc(r.value)}</b></p>`).join("");
  const hover = (node, fn) => {
    node.addEventListener("mousemove", (e) => tip.show(fn(e), e));
    node.addEventListener("mouseleave", tip.hide);
    node.addEventListener("touchstart", (e) => { const t = e.touches[0]; tip.show(fn(t), t); }, { passive: true });
    node.addEventListener("touchend", () => setTimeout(tip.hide, 1400));
  };

  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent && parent.appendChild(n);
    return n;
  };
  const niceMax = (v) => {
    if (v <= 0) return 1;
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    const f = v / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  };

  /* Redesenare la redimensionare */
  const charts = [];
  const mount = (target, draw) => {
    const node = typeof target === "string" ? document.querySelector(target) : target;
    let rec = charts.find((c) => c.node === node);
    if (!rec) { rec = { node }; charts.push(rec); }
    rec.draw = draw;
    draw(node, Math.max(node.clientWidth, 260));
  };
  let rt;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => charts.forEach((c) => c.draw(c.node, Math.max(c.node.clientWidth, 260))), 120); });

  /* ---------- Grafic linie: o singură axă, crosshair + tooltip ---------- */
  function line(target, { labels, series, fmt = num, height = 260, area = true }) {
    mount(target, (node, W) => {
      node.innerHTML = "";
      const H = height, m = { t: 14, r: 14, b: 26, l: 46 };
      const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, height: H, role: "img" }, node);
      const max = niceMax(Math.max(...series.flatMap((s) => s.values)) * 1.05);
      const n = labels.length;
      const x = (i) => m.l + (i * (W - m.l - m.r)) / (n - 1);
      const y = (v) => H - m.b - (v / max) * (H - m.t - m.b);
      for (let i = 0; i <= 4; i++) {
        const v = (max * i) / 4;
        el("line", { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), class: i ? "gl" : "bl" }, svg);
        el("text", { x: m.l - 8, y: y(v) + 4, "text-anchor": "end", class: "ax" }, svg).textContent = short(v);
      }
      const step = Math.ceil(n / Math.max(2, Math.floor((W - m.l) / 70)));
      labels.forEach((l, i) => {
        if (i % step === 0 && i <= n - 1 - step / 2 || i === n - 1)
          el("text", { x: x(i), y: H - 6, "text-anchor": i === n - 1 ? "end" : "middle", class: "ax" }, svg).textContent = l;
      });
      const path = (vals) => vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
      series.forEach((s, si) => {
        if (area && si === 0) {
          const id = "g" + Math.random().toString(36).slice(2, 8);
          const defs = el("defs", {}, svg);
          const g = el("linearGradient", { id, x1: 0, x2: 0, y1: 0, y2: 1 }, defs);
          el("stop", { offset: "0%", "stop-color": s.color, "stop-opacity": 0.22 }, g);
          el("stop", { offset: "100%", "stop-color": s.color, "stop-opacity": 0 }, g);
          el("path", { d: path(s.values) + `L${x(n - 1)},${y(0)}L${x(0)},${y(0)}Z`, fill: `url(#${id})` }, svg);
        }
      });
      [...series].reverse().forEach((s) => {
        el("path", { d: path(s.values), fill: "none", stroke: s.color, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round", ...(s.dashed ? { "stroke-dasharray": "5 5" } : {}) }, svg);
      });
      const cross = el("line", { y1: m.t, y2: H - m.b, stroke: css("--muted"), "stroke-width": 1, opacity: 0 }, svg);
      const dots = series.map((s) => el("circle", { r: 4.5, fill: s.color, stroke: css("--surface"), "stroke-width": 2, opacity: 0 }, svg));
      const hit = el("rect", { x: m.l, y: 0, width: W - m.l - m.r, height: H, fill: "transparent" }, svg);
      const at = (e) => {
        const r = svg.getBoundingClientRect();
        const i = Math.max(0, Math.min(n - 1, Math.round(((e.clientX - r.left - m.l) / (W - m.l - m.r)) * (n - 1))));
        cross.setAttribute("x1", x(i)); cross.setAttribute("x2", x(i)); cross.setAttribute("opacity", 1);
        dots.forEach((d, si) => { d.setAttribute("cx", x(i)); d.setAttribute("cy", y(series[si].values[i])); d.setAttribute("opacity", 1); });
        return tipRows(labels[i], series.map((s) => ({ label: s.name, value: fmt(s.values[i]), color: s.color })));
      };
      hover(hit, at);
      hit.addEventListener("mouseleave", () => { cross.setAttribute("opacity", 0); dots.forEach((d) => d.setAttribute("opacity", 0)); });
    });
  }

  /* ---------- Coloane verticale ---------- */
  function cols(target, { labels, values, fmt = num, height = 230, color, highlight = [], hiColor, tipLabel = "Valoare", extra }) {
    mount(target, (node, W) => {
      node.innerHTML = "";
      const H = height, m = { t: 22, r: 8, b: 26, l: 44 };
      const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, height: H, role: "img" }, node);
      const max = niceMax(Math.max(...values) * 1.08);
      const n = values.length, bw = (W - m.l - m.r) / n;
      const y = (v) => H - m.b - (v / max) * (H - m.t - m.b);
      for (let i = 0; i <= 4; i++) {
        const v = (max * i) / 4;
        el("line", { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), class: i ? "gl" : "bl" }, svg);
        el("text", { x: m.l - 8, y: y(v) + 4, "text-anchor": "end", class: "ax" }, svg).textContent = short(v);
      }
      const w = Math.min(bw - 2, Math.max(4, bw * 0.62));
      const skip = Math.ceil(n / Math.max(2, Math.floor((W - m.l) / 46)));
      values.forEach((v, i) => {
        const cx = m.l + bw * i + bw / 2, top = y(v), h = Math.max(1, H - m.b - top);
        const hi = highlight.includes(i);
        const r = Math.min(4, w / 2, h);
        el("path", { d: `M${cx - w / 2},${H - m.b}v${-(h - r)}q0,${-r} ${r},${-r}h${w - 2 * r}q${r},0 ${r},${r}v${h - r}z`, fill: hi ? hiColor || css("--accent") : color || css("--s1") }, svg);
        if (hi && n <= 16) el("text", { x: cx, y: top - 6, "text-anchor": "middle", class: "dl" }, svg).textContent = fmt(v);
        if (i % skip === 0) el("text", { x: cx, y: H - 6, "text-anchor": "middle", class: "ax" }, svg).textContent = labels[i];
        const hit = el("rect", { x: m.l + bw * i, y: m.t, width: bw, height: H - m.t - m.b, fill: "transparent" }, svg);
        hover(hit, () => tipRows(labels[i], [{ label: tipLabel, value: fmt(v) }, ...(extra ? extra(i) : [])]));
      });
    });
  }

  /* ---------- Bare orizontale (HTML) ---------- */
  function hbars(target, items, { fmt = num, max, tipFn } = {}) {
    const node = typeof target === "string" ? document.querySelector(target) : target;
    const mx = max || Math.max(...items.map((i) => i.value));
    node.className = "hbars";
    node.innerHTML = items.map((it) => `
      <div class="hbar">
        <span class="hbar__label">${esc(it.label)}</span>
        <span class="hbar__track"><span class="hbar__fill" style="background:${it.color || css("--s1")}" data-w="${Math.max(1, (it.value / mx) * 100)}"></span></span>
        <span class="hbar__val">${esc(it.text || fmt(it.value))}</span>
      </div>`).join("");
    requestAnimationFrame(() => requestAnimationFrame(() => node.querySelectorAll(".hbar__fill").forEach((f) => (f.style.width = f.dataset.w + "%"))));
    [...node.children].forEach((row, i) => hover(row, () => (tipFn ? tipFn(items[i]) : tipRows(items[i].label, [{ label: "Valoare", value: items[i].text || fmt(items[i].value) }]))));
  }

  /* ---------- Heatmap: o singură nuanță, deschis → intens ---------- */
  function heat(target, { rows, colLabels, values, fmt = num, rgb = "200,245,58", unit = "", legend = ["puțin", "mult"] }) {
    const node = typeof target === "string" ? document.querySelector(target) : target;
    const flat = values.flat(), max = Math.max(...flat), min = Math.min(...flat);
    let h = `<div class="heat" style="grid-template-columns:34px repeat(${colLabels.length}, minmax(0,1fr))">`;
    rows.forEach((r, ri) => {
      h += `<span class="heat__lab">${r}</span>`;
      values[ri].forEach((v, ci) => {
        const a = 0.08 + 0.92 * ((v - min) / (max - min || 1));
        h += `<span class="heat__cell" style="background:rgba(${rgb},${a.toFixed(2)})" data-r="${ri}" data-c="${ci}"></span>`;
      });
    });
    h += `<span></span>` + colLabels.map((c) => `<span class="heat__lab heat__lab--c">${c}</span>`).join("") + `</div>
      <div class="heat-legend"><span>${legend[0]}</span><i style="background:linear-gradient(90deg, rgba(${rgb},.08), rgba(${rgb},1))"></i><span>${legend[1]}</span></div>`;
    node.innerHTML = h;
    node.querySelectorAll(".heat__cell").forEach((c) => {
      const ri = +c.dataset.r, ci = +c.dataset.c;
      hover(c, () => tipRows(`${rows[ri]} · ora ${colLabels[ci]}`, [{ label: unit, value: fmt(values[ri][ci]) }]));
    });
  }

  /* ---------- Utilitare de interfață ---------- */
  function seg(target, cb) {
    const node = typeof target === "string" ? document.querySelector(target) : target;
    node.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b || b.getAttribute("aria-pressed") === "true") return;
      node.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      cb(b.dataset.v);
    });
  }
  const delta = (cur, prev, { invert = false, suffix = "" } = {}) => {
    const d = prev ? ((cur - prev) / prev) * 100 : 0;
    const good = invert ? d <= 0 : d >= 0;
    return `<span class="delta delta--${good ? "good" : "bad"}">${d >= 0 ? "▲" : "▼"} ${dec(Math.abs(d))}%</span>${suffix}`;
  };
  const insights = (target, list) => {
    document.querySelector(target).innerHTML = list.map((i) => `
      <div class="insight insight--${i.type}">
        <span class="insight__ic">${i.type === "good" ? "✓" : i.type === "warn" ? "!" : "✕"}</span>
        <div><h3>${i.title}</h3><p>${i.text}</p></div>
      </div>`).join("");
  };
  let toastEl, tt;
  const toast = (html) => {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.innerHTML = html; toastEl.classList.add("is-on");
    clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("is-on"), 3600);
  };
  const set = (id, html) => { document.getElementById(id).innerHTML = html; };
  const dayLabels = (n) => {
    const out = [], now = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i);
      out.push(d.toLocaleDateString("ro-RO", { day: "numeric", month: "short" }).replace(".", ""));
    }
    return out;
  };

  return { css, esc, num, lei, dec, pct, short, rng, sum, tip, tipRows, hover, line, cols, hbars, heat, seg, delta, insights, toast, set, dayLabels };
})();
