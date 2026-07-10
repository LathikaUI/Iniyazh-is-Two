const pages = [...document.querySelectorAll('.page')];
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const startBtn = document.getElementById('start');
const counter = document.getElementById('pageCounter');
const music = document.getElementById('music');
const musicBtn = document.getElementById('musicBtn');
let current = 0;
let celebrated = false;

function updateBook() {
  pages.forEach((page, index) => {
    const flipped = index < current;
    page.classList.toggle('flipped', flipped);
    page.style.zIndex = flipped ? String(index + 1) : String(pages.length - index + 10);
  });
  counter.textContent = `${Math.min(current + 1, pages.length)} / ${pages.length}`;
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === pages.length - 1;
  if (current === pages.length - 1 && !celebrated) {
    celebrated = true;
    celebrate();
  }
}

function nextPage() {
  if (current < pages.length - 1) {
    current += 1;
    updateBook();
  }
}
function prevPage() {
  if (current > 0) {
    current -= 1;
    updateBook();
  }
}

nextBtn.addEventListener('click', nextPage);
prevBtn.addEventListener('click', prevPage);
startBtn.addEventListener('click', nextPage);

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') nextPage();
  if (event.key === 'ArrowLeft') prevPage();
});

let touchStartX = 0;
document.addEventListener('touchstart', event => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });
document.addEventListener('touchend', event => {
  const distance = touchStartX - event.changedTouches[0].clientX;
  if (distance > 55) nextPage();
  if (distance < -55) prevPage();
}, { passive: true });

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = String(value).padStart(2, '0');
}

const birthday = new Date(CONFIG.birthday).getTime();
function updateCountdown() {
  const diff = birthday - Date.now();
  const clock = document.getElementById('royalClock');
  if (!clock) return;
  if (diff <= 0) {
    clock.innerHTML = '<div class="clock-crown">👑</div><h3>🎉 The Royal Celebration Begins! 🎉</h3>';
    return;
  }
  setText('days', Math.floor(diff / 86400000));
  setText('hours', Math.floor(diff / 3600000) % 24);
  setText('minutes', Math.floor(diff / 60000) % 60);
  setText('seconds', Math.floor(diff / 1000) % 60);
}
setInterval(updateCountdown, 1000);
updateCountdown();

let musicPlaying = false;
musicBtn.addEventListener('click', async () => {
  try {
    if (musicPlaying) {
      music.pause();
      musicBtn.textContent = '🎵';
      musicBtn.setAttribute('aria-label', 'Play background music');
    } else {
      await music.play();
      musicBtn.textContent = '⏸';
      musicBtn.setAttribute('aria-label', 'Pause background music');
    }
    musicPlaying = !musicPlaying;
  } catch {
    alert('Add music/fairytale.mp3 to enable background music.');
  }
});

function createFireflies() {
  const container = document.querySelector('.fireflies');
  for (let i = 0; i < 18; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'firefly-dot';
    dot.style.left = `${Math.random() * 100}vw`;
    dot.style.top = `${Math.random() * 100}vh`;
    dot.style.setProperty('--x', `${Math.random() * 90 - 45}px`);
    dot.style.setProperty('--y', `${Math.random() * 100 - 50}px`);
    dot.style.setProperty('--duration', `${2.5 + Math.random() * 4}s`);
    dot.style.animationDelay = `${Math.random() * 4}s`;
    container.appendChild(dot);
  }
}

function celebrate() {
  const colors = ['#d6ae45', '#f9e79f', '#b20d30', '#174c2d', '#ffffff'];
  for (let i = 0; i < 90; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty('--fall', `${2.8 + Math.random() * 2.7}s`);
    piece.style.setProperty('--drift', `${Math.random() * 180 - 90}px`);
    piece.style.animationDelay = `${Math.random() * .8}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 6500);
  }
}

function configureLinks() {
  const rsvp = document.getElementById('rsvpLink');
  const wishes = document.getElementById('wishesLink');
  if (CONFIG.whatsappNumber) {
    rsvp.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
  } else {
    rsvp.href = '#';
    rsvp.addEventListener('click', event => {
      event.preventDefault();
      alert('Add your WhatsApp number in config.js.');
    });
  }
  if (CONFIG.wishesFormUrl) {
    wishes.href = CONFIG.wishesFormUrl;
  } else {
    wishes.href = '#';
    wishes.addEventListener('click', event => {
      event.preventDefault();
      alert('Add your Google Form link in config.js.');
    });
  }
}

createFireflies();
configureLinks();
updateBook();
