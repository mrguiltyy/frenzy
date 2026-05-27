// ── Gold particle system ────────────────────────────────────────────────────
const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d');

let W = canvas.width  = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

function mkParticle(randomY = false) {
  return {
    x:      Math.random() * W,
    y:      randomY ? Math.random() * H : H + 8,
    size:   0.8 + Math.random() * 1.8,
    speed:  0.25 + Math.random() * 0.55,
    alpha:  0.08 + Math.random() * 0.22,
    drift:  (Math.random() - 0.5) * 0.3,
    phase:  Math.random() * Math.PI * 2,
    freq:   0.008 + Math.random() * 0.016,
  };
}

const particles = Array.from({ length: 45 }, () => mkParticle(true));

let frame = 0;

function draw() {
  ctx.clearRect(0, 0, W, H);
  frame++;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.phase += p.freq;
    p.x     += p.drift + Math.sin(p.phase) * 0.35;
    p.y     -= p.speed;

    // fade near top & bottom edges
    const fadeT = Math.min(1, p.y / 120);
    const fadeB = Math.min(1, (H - p.y) / 80);
    const a     = p.alpha * fadeT * fadeB;

    if (a > 0.005) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = `rgba(201,168,76,${a})`;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }

    if (p.y < -8) particles[i] = mkParticle(false);
  }

  requestAnimationFrame(draw);
}

draw();

// ── Contact form → Cloudflare Worker relay ──────────────────────────────────
const form   = document.getElementById('contact-form');
const status = document.getElementById('status');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const data = {
    name:    form.name.value.trim(),
    email:   form.email.value.trim(),
    message: form.message.value.trim(),
  };

  status.textContent = 'Transmitting…';

  try {
    const res = await fetch('https://YOUR-WORKER.your-subdomain.workers.dev', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });

    if (res.ok) {
      status.textContent = 'Transmission received.';
      form.reset();
    } else {
      status.textContent = 'Transmission failed — try again.';
    }
  } catch {
    status.textContent = 'Connection error.';
  }
});
