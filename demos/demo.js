/* Comportament comun pentru site-urile demo · Adelin Solutions */
const Demo = (() => {
  const ADELIN_WA = "40750210645"; // site demonstrativ: contactul duce la Adelin Solutions, nu la o afacere reală

  // Apariție la scroll (verificare directă a poziției: merge și în file cu tab-ul în fundal)
  const pending = [...document.querySelectorAll("[data-reveal]")];
  pending.forEach((el, i) => (el.style.transitionDelay = (i % 3) * 90 + "ms"));
  const reveal = () => {
    for (let i = pending.length - 1; i >= 0; i--)
      if (pending[i].getBoundingClientRect().top < innerHeight * 0.92) pending.splice(i, 1)[0].classList.add("is-in");
  };
  addEventListener("scroll", reveal, { passive: true }); addEventListener("resize", reveal); addEventListener("load", reveal); reveal();

  // Meniu mobil
  const toggle = document.querySelector("[data-menu-toggle]"), menu = document.querySelector("[data-menu]");
  if (toggle && menu) {
    const set = (o) => { menu.classList.toggle("is-open", o); toggle.setAttribute("aria-expanded", String(o)); };
    toggle.addEventListener("click", () => set(!menu.classList.contains("is-open")));
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => set(false)));
  }

  // Fereastra cu mesajul WhatsApp
  let modal;
  function openWa(business, text) {
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "wa-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-label", "Mesaj de programare");
      modal.innerHTML = `
        <div class="wa-box">
          <div class="wa-head"><i></i><div><b></b><small>online · răspunde de obicei în câteva minute</small></div></div>
          <div class="wa-chat"><div class="wa-bubble"><span></span><time></time></div></div>
          <div class="wa-foot">
            <p><b>Așa primește afacerea cererea pe WhatsApp</b>, scrisă automat din ce a ales clientul. Acesta este un site demonstrativ, deci nu se trimite nimic.</p>
            <div class="wa-actions"><button type="button">Închide</button><a target="_blank" rel="noopener">Vreau un site ca acesta</a></div>
          </div>
        </div>`;
      document.body.appendChild(modal);
      const close = () => modal.classList.remove("is-open");
      modal.querySelector("button").addEventListener("click", close);
      modal.addEventListener("click", (e) => e.target === modal && close());
      document.addEventListener("keydown", (e) => e.key === "Escape" && close());
    }
    modal.querySelector(".wa-head i").textContent = business.trim()[0];
    modal.querySelector(".wa-head b").textContent = business;
    modal.querySelector(".wa-bubble span").textContent = text;
    modal.querySelector("time").textContent = new Date().toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }) + " ✓✓";
    modal.querySelector("a").href = `https://wa.me/${ADELIN_WA}?text=${encodeURIComponent("Salut, Adelin! Am testat site-ul demo „" + business + "” și aș vrea un site asemănător pentru afacerea mea.")}`;
    modal.classList.add("is-open");
    modal.querySelector("a").focus();
  }

  // Validare simplă: marchează câmpurile obligatorii goale
  function validate(form) {
    let ok = true, first;
    form.querySelectorAll("[required]").forEach((f) => {
      const bad = !f.value.trim();
      f.classList.toggle("field-error", bad);
      if (bad) { ok = false; first = first || f; }
    });
    first && first.focus();
    return ok;
  }
  document.addEventListener("input", (e) => e.target.classList && e.target.classList.remove("field-error"));

  // Următoarele zile lucrătoare (pentru alegerea datei)
  function nextDays(count, closed = [0]) {
    const out = [], d = new Date();
    while (out.length < count) {
      d.setDate(d.getDate() + 1);
      if (!closed.includes(d.getDay()))
        out.push({ date: new Date(d), short: d.toLocaleDateString("ro-RO", { weekday: "short" }).replace(".", ""), day: d.getDate(), long: d.toLocaleDateString("ro-RO", { weekday: "long", day: "numeric", month: "long" }) });
    }
    return out;
  }

  const y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  return { openWa, validate, nextDays };
})();
