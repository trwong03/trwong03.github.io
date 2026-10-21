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

// Oscilloscope: CH1 analog sensor trace, CH2 I2C clock. Pointer or arrow keys tune CH1.
const scope = document.querySelector(".scope");
const canvas = document.getElementById("scope");
const ctx = canvas.getContext("2d");
const readout = document.getElementById("readout");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
let freq = 2, amp = 0.6, phase = 0, running = false, colors;

function readColors() {
  const cs = getComputedStyle(document.documentElement);
  colors = ["--line", "--accent", "--accent-2", "--muted"].map((v) => cs.getPropertyValue(v).trim());
}
function resize() {
  const d = devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * d;
  canvas.height = canvas.clientHeight * d;
  ctx.setTransform(d, 0, 0, d, 0, 0);
}
function draw() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  const [line, ch1, ch2] = colors;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 1; i < 10; i++) { const x = (w * i) / 10; ctx.moveTo(x, 0); ctx.lineTo(x, h); }
  for (let i = 1; i < 8; i++) { const y = (h * i) / 8; ctx.moveTo(0, y); ctx.lineTo(w, y); }
  ctx.stroke();

  const mid = h * 0.4;
  ctx.lineWidth = 2;
  ctx.strokeStyle = ch1;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 2) {
    const t = (x / w) * Math.PI * 2 * freq + phase;
    const y = mid - amp * h * 0.28 * (Math.sin(t) + 0.25 * Math.sin(3 * t + 0.6));
    x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke();

  const lo = h * 0.9, hi = h * 0.76, period = w / 12;
  ctx.strokeStyle = ch2;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 1) {
    const y = ((x + phase * 30) % period) < period / 2 ? hi : lo;
    x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke();

  readout.textContent = `${(freq * 0.6).toFixed(2)} kHz · ${(amp * 5.5).toFixed(1)} Vpp`;
}
function loop() {
  if (!running) return;
  phase += 0.05;
  draw();
  requestAnimationFrame(loop);
}
function setRunning(on) {
  if (reduce || on === running) return;
  running = on;
  if (on) requestAnimationFrame(loop);
}
function tune(f, a) {
  freq = clamp(f, 0.5, 6);
  amp = clamp(a, 0.1, 1);
  if (!running) draw();
}

scope.addEventListener("pointermove", (e) => {
  const r = canvas.getBoundingClientRect();
  tune(0.5 + 5.5 * clamp((e.clientX - r.left) / r.width, 0, 1), 1 - clamp((e.clientY - r.top) / r.height, 0, 0.9));
});
scope.addEventListener("keydown", (e) => {
  const k = { ArrowLeft: [-0.25, 0], ArrowRight: [0.25, 0], ArrowUp: [0, 0.1], ArrowDown: [0, -0.1] }[e.key];
  if (!k) return;
  e.preventDefault();
  tune(freq + k[0], amp + k[1]);
});
// Only animate while the scope is on screen
new IntersectionObserver(([e]) => setRunning(e.isIntersecting)).observe(scope);
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { readColors(); draw(); });
addEventListener("resize", () => { resize(); draw(); });

readColors();
resize();
draw();
