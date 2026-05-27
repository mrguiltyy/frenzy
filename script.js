// Liquid canvas animation
const canvas = document.getElementById('liquid');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const blobs = [];

for (let i = 0; i < 25; i++) {
  blobs.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 80 + Math.random() * 120,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  blobs.forEach(b => {
    b.x += b.dx;
    b.y += b.dy;

    if (b.x < 0 || b.x > canvas.width)  b.dx *= -1;
    if (b.y < 0 || b.y > canvas.height) b.dy *= -1;

    const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
    gradient.addColorStop(0, 'rgba(0,255,255,0.12)');
    gradient.addColorStop(1, 'rgba(138,43,226,0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Music player
const songs = [
  { title: 'Deftones - Sextape',           src: 'songs/song1.mp3' },
  { title: 'Hail The Sun - Relax / Divide', src: 'songs/song2.mp3' },
  { title: "Weezer - Say It Ain't So",      src: 'songs/song3.mp3' },
  { title: 'Loathe - Two Way Mirror',       src: 'songs/song4.mp3' },
  { title: 'Sleep Token - Granite',         src: 'songs/song5.mp3' }
];

let currentSong = 0;

const audio   = document.getElementById('audio');
const title   = document.getElementById('song-title');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');

function loadSong(index) {
  audio.src = songs[index].src;
  title.textContent = songs[index].title;
  audio.volume = 0.15;
}

loadSong(currentSong);

playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = '⏸';
  } else {
    audio.pause();
    playBtn.textContent = '▶';
  }
});

nextBtn.addEventListener('click', () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  audio.play();
  playBtn.textContent = '⏸';
});

prevBtn.addEventListener('click', () => {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
  audio.play();
  playBtn.textContent = '⏸';
});

audio.addEventListener('ended', () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  audio.play();
});

// Contact form -> Cloudflare Worker relay
const form       = document.getElementById('contact-form');
const statusText = document.getElementById('status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = {
    name:    formData.get('name'),
    email:   formData.get('email'),
    message: formData.get('message')
  };

  statusText.innerText = 'Sending...';

  try {
    const response = await fetch('https://YOUR-WORKER.your-subdomain.workers.dev', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      statusText.innerText = 'Message sent.';
      form.reset();
    } else {
      statusText.innerText = 'Failed to send.';
    }
  } catch (err) {
    statusText.innerText = 'Server error.';
  }
});
