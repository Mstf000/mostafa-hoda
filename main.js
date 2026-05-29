// ══════════════════════════════════════════════════════════════
//  CONFIGURATION — edit only this block
// ══════════════════════════════════════════════════════════════
const PARTNER_A     = 'Hoda';
const PARTNER_B     = 'Mostafa';
const WEDDING_DATE  = '2026-07-08T16:00:00'; // ISO 8601, local time — 40 days from 2026-05-29
const DISPLAY_DATE  = 'July 8, 2026';
const DISPLAY_TIME  = '4:00 PM';
const VENUE_NAME    = 'Venue Name';
const VENUE_MAP_URL = 'https://maps.google.com/?q=Your+Venue+Here';
const CITY          = 'City, Country';
const BOT_TOKEN     = 'YOUR_BOT_TOKEN';
const CHAT_ID       = 'YOUR_CHAT_ID';
const START_SEC     = 0;   // seconds into the audio file to begin from
const QUOTE         = 'And suddenly, all the love songs were about you.';
const PHOTOS = [
  'public/photo-1.jpg',
  'public/photo-2.jpg',
  'public/photo-3.jpg',
  'public/photo-4.jpg',
];
// ══════════════════════════════════════════════════════════════

// ─── FILL STATIC TEXT ─────────────────────────────────────────
function populateText() {
  const $ = id => document.getElementById(id);

  $('hero-name-a').textContent       = PARTNER_A;
  $('hero-name-b').textContent       = PARTNER_B;
  $('hero-date').textContent         = DISPLAY_DATE;
  $('hero-location').textContent     = CITY;
  $('details-time').textContent      = DISPLAY_TIME;
  $('details-venue').textContent     = VENUE_NAME;
  $('details-city').textContent      = CITY;
  $('details-map-link').href         = VENUE_MAP_URL;
  $('closing-sub').textContent       = `${DISPLAY_DATE} · ${CITY}`;
  $('footer-text').textContent       = `${PARTNER_A} & ${PARTNER_B} · ${DISPLAY_DATE} · ${CITY}`;
  $('page-title').textContent        = `${PARTNER_A} & ${PARTNER_B} — Wedding Invitation`;
  $('closing-names-top').textContent = `${PARTNER_A} & ${PARTNER_B}`;

  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  $('details-day').textContent = dayNames[new Date(WEDDING_DATE).getDay()];
}

// ─── BOTANICALS ───────────────────────────────────────────────
function initBotanicals() {
  const container = document.getElementById('botanicals');
  const leaves = [
    '🌿','🍃','🌿','🍃','🌱','🍀','🌿','🍃',
    '🌿','🍃','🌱','🍀','🌿','🍃','🌿','🍃',
    '🌱','🍀','🌿','🍃','🌿','🍃','🌱','🍀','🌿',
  ];

  leaves.forEach(emoji => {
    const el = document.createElement('span');
    el.className = 'botanical';
    el.textContent = emoji;
    el.setAttribute('aria-hidden', 'true');

    const size  = 1 + Math.random() * 1.1;
    const dur   = 6 + Math.random() * 7;
    const delay = -(Math.random() * 10);

    el.style.cssText = `
      left: ${Math.random() * 96}%;
      top:  ${Math.random() * 96}%;
      font-size: ${size}rem;
      opacity: ${0.25 + Math.random() * 0.45};
      --dur:    ${dur}s;
      --delay:  ${delay}s;
      --r0: ${-12 + Math.random() * 24}deg;
      --r1: ${-12 + Math.random() * 24}deg;
      --r2: ${-12 + Math.random() * 24}deg;
      --r3: ${-12 + Math.random() * 24}deg;
    `;
    container.appendChild(el);
  });
}

// ─── FLIP DIGIT CLASS ──────────────────────────────────────────
class FlipDigit {
  constructor() {
    this.el = document.createElement('div');
    this.el.className = 'flip-digit';
    this.el.innerHTML = `
      <div class="fd-half fd-top fd-static-top"><span>0</span></div>
      <div class="fd-half fd-bot fd-static-bot"><span>0</span></div>
      <div class="fd-half fd-top fd-anim-top"><span>0</span></div>
      <div class="fd-half fd-bot fd-anim-bot"><span>0</span></div>
    `;

    this._sTopSpan  = this.el.querySelector('.fd-static-top span');
    this._sBotSpan  = this.el.querySelector('.fd-static-bot span');
    this._aTopDiv   = this.el.querySelector('.fd-anim-top');
    this._aBotDiv   = this.el.querySelector('.fd-anim-bot');
    this._aTopSpan  = this.el.querySelector('.fd-anim-top span');
    this._aBotSpan  = this.el.querySelector('.fd-anim-bot span');

    this._cur  = '0';
    this._busy = false;
  }

  update(val) {
    val = String(val);
    if (val === this._cur || this._busy) return;

    const prev   = this._cur;
    this._cur    = val;
    this._busy   = true;

    // Content for the animated halves
    this._aTopSpan.textContent = prev; // old value folds away
    this._aBotSpan.textContent = val;  // new value reveals
    this._sBotSpan.textContent = val;  // update static bottom immediately (hidden behind anim-bot)

    // Reset anim-bot to its default hidden state without triggering CSS transition
    this._aTopDiv.style.animation = 'none';
    this._aBotDiv.style.animation = 'none';
    this._aBotDiv.style.transform = 'rotateX(90deg)';
    this._aTopDiv.style.transform = 'rotateX(0deg)';
    void this.el.offsetWidth; // force reflow so we can restart the animation

    this._aTopDiv.style.animation = '';
    this._aBotDiv.style.animation = '';
    this._aBotDiv.style.transform = '';
    this._aTopDiv.style.transform = '';

    this.el.classList.add('is-flipping');

    // Midpoint: the fold-away is complete, reveal the updated static top
    setTimeout(() => {
      this._sTopSpan.textContent = val;
    }, 260);

    // End: clean up
    setTimeout(() => {
      this.el.classList.remove('is-flipping');
      this._busy = false;
    }, 540);
  }
}

// ─── COUNTDOWN ────────────────────────────────────────────────
function initCountdown() {
  const target    = new Date(WEDDING_DATE).getTime();
  const container = document.getElementById('countdown-grid');

  const groups = [
    { key: 'days',    label: 'Days',    digits: 2 },
    { key: 'hours',   label: 'Hours',   digits: 2 },
    { key: 'minutes', label: 'Minutes', digits: 2 },
    { key: 'seconds', label: 'Seconds', digits: 2 },
  ];

  const digitMap = {};

  groups.forEach(g => {
    const group = document.createElement('div');
    group.className = 'countdown-group';

    const pair = document.createElement('div');
    pair.className = 'flip-pair';

    digitMap[g.key] = [];
    for (let i = 0; i < g.digits; i++) {
      const fd = new FlipDigit();
      pair.appendChild(fd.el);
      digitMap[g.key].push(fd);
    }

    const label = document.createElement('span');
    label.className = 'countdown-label';
    label.textContent = g.label;

    group.appendChild(pair);
    group.appendChild(label);
    container.appendChild(group);
  });

  function pad2(n) {
    return String(Math.max(0, Math.min(99, n))).padStart(2, '0');
  }

  function tick() {
    const diff      = Math.max(0, target - Date.now());
    const totalSecs = Math.floor(diff / 1000);
    const secs      = totalSecs % 60;
    const mins      = Math.floor(totalSecs / 60) % 60;
    const hrs       = Math.floor(totalSecs / 3600) % 24;
    const days      = Math.floor(totalSecs / 86400);

    const vals = {
      days:    pad2(days),
      hours:   pad2(hrs),
      minutes: pad2(mins),
      seconds: pad2(secs),
    };

    Object.entries(vals).forEach(([key, str]) => {
      digitMap[key][0].update(str[0]);
      digitMap[key][1].update(str[1]);
    });
  }

  tick();
  setInterval(tick, 1000);
}

// ─── CALENDAR ─────────────────────────────────────────────────
function initCalendar() {
  const target  = new Date(WEDDING_DATE);
  const year    = target.getFullYear();
  const month   = target.getMonth();
  const wDay    = target.getDate();

  const firstWeekDay = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth  = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];

  let html = `
    <div class="cal-header">
      <span class="cal-month-name">${monthNames[month]}</span>
      <span class="cal-year-label">${year}</span>
    </div>
    <div class="cal-rule"></div>
    <div class="cal-grid">
  `;

  // Two-letter day headers
  ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d => {
    html += `<div class="cal-day-hdr">${d}</div>`;
  });

  // Leading empty cells
  for (let i = 0; i < firstWeekDay; i++) {
    html += '<div class="cal-cell"></div>';
  }

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    if (d === wDay) {
      html += `<div class="cal-cell cal-wedding-day" title="Wedding day">
        <span class="cal-heart" aria-hidden="true">❤️</span>
        <span class="cal-num">${d}</span>
      </div>`;
    } else {
      html += `<div class="cal-cell">${d}</div>`;
    }
  }

  html += '</div>';
  document.getElementById('wedding-calendar').innerHTML = html;
}

// ─── TYPEWRITER ───────────────────────────────────────────────
function initTypewriter() {
  const textEl   = document.getElementById('typewriter-text');
  const cursorEl = document.getElementById('tw-cursor');
  let   started  = false;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      observer.disconnect();

      let i = 0;
      const type = () => {
        textEl.textContent = QUOTE.slice(0, i + 1);
        i++;
        if (i < QUOTE.length) {
          setTimeout(type, 50 + Math.random() * 35);
        } else {
          setTimeout(() => { cursorEl.style.display = 'none'; }, 2800);
        }
      };
      setTimeout(type, 450);
    }
  }, { threshold: .5 });

  observer.observe(document.getElementById('message'));
}

// ─── GUESTBOOK ────────────────────────────────────────────────
function initGuestbook() {
  const form     = document.getElementById('guestbook-form');
  const feedback = document.getElementById('gb-feedback');

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = document.getElementById('gb-name').value.trim();
    const message = document.getElementById('gb-message').value.trim();
    if (!name || !message) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled    = true;
    btn.textContent = 'Sending…';

    const text = `💌 New guestbook message!\n\n👤 ${name}\n📝 ${message}`;

    try {
      const res = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ chat_id: CHAT_ID, text }),
        }
      );
      if (!res.ok) throw new Error('Non-OK response');

      form.style.display  = 'none';
      feedback.textContent = '💚 Thank you! Your message means the world to us.';
    } catch {
      feedback.textContent = '❌ Something went wrong — please try again.';
      btn.disabled    = false;
      btn.textContent = 'Send love 💚';
    }
  });
}

// ─── BURST (shared for RSVP & easter egg) ─────────────────────
function burst(items, count = 200) {
  // items: array of emojis  OR  array of '#rrggbb' color strings (confetti mode)
  const isConfetti = items[0] && items[0].startsWith('#');

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className   = 'burst-piece';

    if (isConfetti) {
      el.textContent  = '◆';
      el.style.color  = items[Math.floor(Math.random() * items.length)];
      el.style.fontSize = `${0.45 + Math.random() * 0.75}rem`;
    } else {
      el.textContent  = items[Math.floor(Math.random() * items.length)];
      el.style.fontSize = `${1.1 + Math.random() * 0.8}rem`;
    }

    const startX = Math.random() * 100;              // vw
    const dx     = (-45 + Math.random() * 90) + 'vw';
    const dur    = (1.4 + Math.random() * 1.6) + 's';
    const delay  = (Math.random() * 0.45) + 's';
    const rot    = (-360 + Math.random() * 720) + 'deg';

    el.style.left  = startX + 'vw';
    el.style.setProperty('--dur',   dur);
    el.style.setProperty('--delay', delay);
    el.style.setProperty('--dx',    dx);
    el.style.setProperty('--rot',   rot);

    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }
}

// ─── RSVP ─────────────────────────────────────────────────────
function initRSVP() {
  const btnYes = document.getElementById('btn-yes');
  const btnNo  = document.getElementById('btn-no');
  const taunt  = document.getElementById('rsvp-taunt');
  let   dodges = 0;

  // Fixed corners (avoiding the music button area in the bottom-right)
  const corners = [
    { top: '22px', left: '22px',  bottom: 'auto', right: 'auto'  },
    { top: '22px', right: '90px', bottom: 'auto', left: 'auto'   },
    { top: 'auto', right: '90px', bottom: '80px', left: 'auto'   },
    { top: 'auto', left: '22px',  bottom: '80px', right: 'auto'  },
  ];

  const taunts = [
    'Oh come on… 🙈',
    "You can't catch me! 😜",
    'Just say yes already! 🙃',
    'Last chance… I dare you 😏',
  ];

  btnYes.addEventListener('click', () => {
    // Hide both buttons immediately
    document.getElementById('rsvp-buttons').style.display = 'none';
    taunt.textContent  = 'We cannot wait to celebrate with you!';
    taunt.style.color  = 'var(--sage-dark)';
    taunt.style.fontStyle = 'italic';
    burst(['🎉','🥳','💃','🕺','🎊','✨','🌟','💚','🎶'], 200);
  });

  function dodge() {
    if (dodges >= 4) return;

    if (dodges === 0) {
      btnNo.classList.add('is-running');
    }

    const c = corners[dodges % corners.length];
    btnNo.style.top    = c.top;
    btnNo.style.left   = c.left;
    btnNo.style.bottom = c.bottom;
    btnNo.style.right  = c.right;

    taunt.textContent = taunts[dodges];
    dodges++;

    if (dodges >= 4) {
      btnNo.removeEventListener('click', dodge);
      btnNo.classList.remove('is-running');
      btnNo.classList.add('is-crying');
      btnNo.textContent = '😢 Fine, I give up…';

      // Clear inline positioning so the crying button reflows in-place
      btnNo.style.cssText = '';

      setTimeout(() => {
        burst(['😢','😭','💔','🥺','😿'], 150);
        taunt.textContent = "We'll miss you so much… 💔";
      }, 250);
    }
  }

  btnNo.addEventListener('click', dodge);
}

// ─── EASTER EGG ───────────────────────────────────────────────
function initEasterEgg() {
  const ringBtn = document.getElementById('ring-btn');
  const goldPalette = [
    '#FFD700','#FFC200','#FFB800','#FFDF00','#F0C000',
    '#E6B800','#FFE066','#FFD040','#FAC000',
  ];

  ringBtn.addEventListener('click', () => {
    burst(goldPalette, 200);
  });
}

// ─── MUSIC ────────────────────────────────────────────────────
function initMusic() {
  const btn   = document.getElementById('music-btn');
  const audio = document.getElementById('bg-music');

  let gestureHandled = false;

  function tryPlay() {
    audio.currentTime = START_SEC;
    return audio.play().catch(() => { /* blocked — handled below */ });
  }

  // Attempt autoplay
  tryPlay();

  // Fallback: play on first meaningful user interaction
  function onFirstGesture() {
    if (!gestureHandled && audio.paused) {
      gestureHandled = true;
      tryPlay();
    }
  }
  document.addEventListener('touchstart', onFirstGesture, { once: true, passive: true });
  document.addEventListener('click',      onFirstGesture, { once: true });

  btn.addEventListener('click', e => {
    e.stopPropagation(); // prevent triggering onFirstGesture
    gestureHandled = true;

    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play',  () => btn.classList.add('is-playing'));
  audio.addEventListener('pause', () => btn.classList.remove('is-playing'));
}

// ─── ENVELOPE INTRO ───────────────────────────────────────────
function initEnvelope() {
  const overlay  = document.getElementById('envelope-overlay');
  const envWrap  = document.getElementById('env-wrap');
  const hint     = document.getElementById('env-hint');
  const card     = document.getElementById('env-inner-card');

  // Populate envelope card with couple's details
  document.getElementById('env-names').textContent = `${PARTNER_A} & ${PARTNER_B}`;
  document.getElementById('env-date').textContent  = DISPLAY_DATE;

  // Prevent background scroll while overlay is visible
  document.body.style.overflow = 'hidden';

  function openEnvelope() {
    envWrap.removeEventListener('click', openEnvelope);
    overlay.removeEventListener('keydown', keyHandler);

    // 1. Hint fades + seal pops + flap opens (0ms)
    hint.classList.add('env-hiding');
    envWrap.classList.add('is-opening');

    // 2. Card rises from envelope (420ms)
    setTimeout(() => card.classList.add('is-rising'), 420);

    // 3. Overlay fades out (1050ms)
    setTimeout(() => overlay.classList.add('env-exit'), 1050);

    // 4. Remove overlay + restore scroll (1700ms)
    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = '';
    }, 1700);
  }

  function keyHandler(e) {
    if (e.key === 'Enter' || e.key === ' ') openEnvelope();
  }

  envWrap.addEventListener('click', openEnvelope);
  overlay.addEventListener('keydown', keyHandler);
}

// ─── GALLERY + LIGHTBOX ───────────────────────────────────────
function initGallery() {
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightbox-img');
  const lbClose   = document.getElementById('lightbox-close');

  const items = document.querySelectorAll('.gallery-item');
  const srcs  = PHOTOS;

  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      lbImg.src = srcs[i] || item.querySelector('img').src;
      lbImg.alt = item.querySelector('img').alt;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

// ─── SCROLL REVEAL ────────────────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ─── BOOTSTRAP ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initEnvelope();
  populateText();
  initBotanicals();
  initCountdown();
  initCalendar();
  initGallery();
  initTypewriter();
  initGuestbook();
  initRSVP();
  initEasterEgg();
  initMusic();
  initScrollReveal();
});
