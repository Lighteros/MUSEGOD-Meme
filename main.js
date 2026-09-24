const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");
const stars = [];
let w = 0;
let h = 0;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
function seed() {
  stars.length = 0;
  const count = Math.min(220, Math.floor((w * h) / 9000));
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random(),
      s: Math.random() * 0.35 + 0.05,
      drift: Math.random() * 0.25 + 0.05
    });
  }
}
function draw(t) {
  ctx.clearRect(0, 0, w, h);
  const wave = h * 0.42;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 8) {
    const y =
      wave +
      Math.sin(x * 0.008 + t * 0.0004) * 28 +
      Math.sin(x * 0.02 + t * 0.0007) * 10;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = "rgba(232, 194, 122, 0.16)";
  ctx.lineWidth = 1;
  ctx.stroke();

  for (const star of stars) {
    star.y -= star.drift;
    star.a += star.s * 0.02;
    if (star.y < -4) star.y = h + 4;
    const alpha = 0.25 + Math.abs(Math.sin(star.a)) * 0.75;
    ctx.beginPath();
    ctx.fillStyle = `rgba(246, 226, 176, ${alpha})`;
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}

resize();
seed();
requestAnimationFrame(draw);
window.addEventListener("resize", () => {
  resize();
  seed();
});

document.querySelectorAll(".ca").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const value = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      btn.classList.add("copied");
      const hint = btn.querySelector(".ca-hint");
      const prev = hint.textContent;
      hint.textContent = "Copied";
      setTimeout(() => {
        hint.textContent = prev;
        btn.classList.remove("copied");
      }, 1400);
    } catch {
      hintFallback(btn);
    }
  });
});

function hintFallback(btn) {
  const hint = btn.querySelector(".ca-hint");
  hint.textContent = "Select";
}

const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) entry.target.classList.add("reveal");
    }
  },
  { threshold: 0.18 }
);
document.querySelectorAll(".steps li, .about-figure, .aspect-card, .frame, .banner").forEach((el) => io.observe(el));
