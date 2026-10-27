const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Pintos card art: resident pages filled, swapped pages dashed
const pages = document.querySelector(".pages");
for (let i = 0; i < 64; i++) {
  const s = document.createElement("span");
  if ((i * 7) % 11 < 3) s.className = "swap";
  else if ((i * 5) % 9 < 4) s.className = "res";
  pages.append(s);
}

// Counters count up once when reached. HTML already holds the final number,
// so if the observer never fires the reader still sees the right value.
if (!reduce) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      const el = e.target, end = +el.dataset.n, t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / 1200, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-n]").forEach((el) => io.observe(el));
}


// Side rail: each tick sits where its section falls along the page (like on the scrollbar),
// the fill tracks scroll progress, and the section in view gets .on
const rail = document.querySelector(".rail");
const railLinks = [...rail.querySelectorAll("a")];
let sectionTops = [];
function placeRail() {
  const doc = document.documentElement, track = rail.clientHeight - 32;
  sectionTops = railLinks.map((a, i) => (i === 0 ? 0 : document.querySelector(a.hash).offsetTop));
  sectionTops.forEach((top, i) => railLinks[i].style.setProperty("--y", 16 + (top / doc.scrollHeight) * track + "px"));
  updateRail();
}
function updateRail() {
  const doc = document.documentElement, max = doc.scrollHeight - innerHeight;
  rail.style.setProperty("--p", max > 0 ? scrollY / max : 0);
  let on = 0;
  sectionTops.forEach((top, i) => { if (top <= scrollY + innerHeight * 0.4) on = i; });
  if (scrollY >= max - 2) on = railLinks.length - 1; // short last section never reaches the 40% line
  railLinks.forEach((a, i) => a.classList.toggle("on", i === on));
}
addEventListener("scroll", updateRail, { passive: true });
new ResizeObserver(placeRail).observe(document.body);

// Light/dark switch beside the name (on = dark); theme.js applied the starting theme
const themeSwitch = document.querySelector(".theme-switch");
const syncSwitch = () => themeSwitch.setAttribute("aria-checked", document.documentElement.dataset.theme === "dark");
themeSwitch.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch {}
  syncSwitch();
});
syncSwitch();

// Report figure viewer: show one figure, step with the prev/next buttons (wraps around)
document.querySelectorAll(".gallery").forEach((g) => {
  const figs = [...g.querySelectorAll("figure")], count = g.querySelector(".count");
  let i = 0;
  g.querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", () => {
    figs[i].hidden = true;
    i = (i + Number(b.dataset.step) + figs.length) % figs.length;
    figs[i].hidden = false;
    count.textContent = `${i + 1} / ${figs.length}`;
  }));
});

// Click (or Enter/Space) an image to see it large; click anywhere or press Esc to close
const zoom = document.createElement("dialog");
zoom.className = "zoom";
zoom.innerHTML = '<img alt="">';
document.body.append(zoom);
zoom.addEventListener("click", () => zoom.close());
document.querySelectorAll(".photos img, .gallery img").forEach((img) => {
  img.tabIndex = 0;
  img.setAttribute("role", "button");
  const open = () => {
    zoom.firstChild.src = img.currentSrc || img.src;
    zoom.firstChild.alt = img.alt;
    zoom.showModal();
  };
  img.addEventListener("click", open);
  img.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
  });
});
