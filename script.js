// ── CURSOR ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
  rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.width='20px';cursor.style.height='20px';ring.style.width='60px';ring.style.height='60px'; });
  el.addEventListener('mouseleave', () => { cursor.style.width='12px';cursor.style.height='12px';ring.style.width='36px';ring.style.height='36px'; });
});

// ── STARS ──
const starsContainer = document.getElementById('stars');
for (let i = 0; i < 120; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  const size = Math.random() * 2 + 0.5;
  s.style.cssText = `
    width:${size}px;height:${size}px;
    top:${Math.random()*100}%;left:${Math.random()*100}%;
    --dur:${2+Math.random()*4}s;
    --del:-${Math.random()*5}s;
    --min-op:${0.05+Math.random()*0.1};
    --max-op:${0.3+Math.random()*0.5};
  `;
  starsContainer.appendChild(s);
}

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const skillBars = document.querySelectorAll('.skill-bar-fill');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, { threshold: 0.15 });
reveals.forEach(el => observer.observe(el));

// Skill bars observer
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const w = entry.target.getAttribute('data-width');
      setTimeout(() => { entry.target.style.width = w + '%'; }, 200);
    } else {
      entry.target.style.width = '0';
    }
  });
}, { threshold: 0.3 });
skillBars.forEach(b => barObserver.observe(b));

// ── VIDEO MODAL ──
const videoModal = document.getElementById('video-modal');
const projectVideo = document.getElementById('project-video');
const closeModalBtn = document.querySelector('.close-modal');
const videoTriggers = document.querySelectorAll('.video-trigger');

videoTriggers.forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    const videoSrc = trigger.getAttribute('data-video-src');
    if (videoSrc) {
      projectVideo.src = videoSrc;
      projectVideo.load();
      videoModal.classList.add('visible');
      const playPromise = projectVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => console.log("Video play error:", error));
      }
    }
  });
});

function hideModal() {
  videoModal.classList.remove('visible');
  projectVideo.pause();
  projectVideo.removeAttribute('src'); // Stop video from loading in background safely
  projectVideo.load();
}

closeModalBtn.addEventListener('click', hideModal);
videoModal.addEventListener('click', (e) => { if (e.target === videoModal) hideModal(); });

const customAlert = document.getElementById('custom-alert');
const closeAlertBtn = document.getElementById('close-alert');
function hideCustomAlert() { if (customAlert) customAlert.classList.remove('visible'); }
if (closeAlertBtn) closeAlertBtn.addEventListener('click', hideCustomAlert);
if (customAlert) customAlert.addEventListener('click', (e) => { if (e.target === customAlert) hideCustomAlert(); });

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        if (videoModal && videoModal.classList.contains('visible')) hideModal();
        if (customAlert && customAlert.classList.contains('visible')) hideCustomAlert();
    }
});

// ── SMOOTH NAV ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    if (a.getAttribute('href') === '#') {
        e.preventDefault();
        if (a.classList.contains('project-card') && !a.classList.contains('video-trigger')) {
            if (customAlert) customAlert.classList.add('visible');
        }
        return;
    }

    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});