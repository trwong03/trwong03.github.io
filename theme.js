// Runs in <head> before paint on every page (including the demo iframe):
// use the visitor's saved choice, else their system setting. Without JS the site stays dark.
(() => {
  const set = (t) => (document.documentElement.dataset.theme = t);
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch {}
  set(saved || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
  // The toggle on another page/iframe of this site saves a new choice: follow it.
  addEventListener("storage", (e) => { if (e.key === "theme" && e.newValue) set(e.newValue); });
})();
