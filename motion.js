/* ============================================================
   Team SJEC Racing — site-wide motion & interaction layer
   Scroll reveals, count-up stats, sticky header, mobile nav,
   scroll progress bar, and magnetic buttons.
   Pure vanilla JS, no dependencies, respects reduced-motion.
   ============================================================ */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Scroll progress bar ---------- */
  function initProgressBar() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    const update = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop || document.body.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      const pct = height > 0 ? (scrolled / height) * 100 : 0;
      bar.style.width = pct + '%';
    };
    document.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- 2. Sticky header shrink on scroll ---------- */
  function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    const update = () => {
      if (window.scrollY > 12) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    document.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- 3. Mobile nav drawer ---------- */
  function initMobileNav() {
    const nav = document.querySelector('header nav');
    const links = document.querySelector('.navlinks');
    if (!nav || !links) return;

    const btn = document.createElement('button');
    btn.className = 'nav-toggle';
    btn.setAttribute('aria-label', 'Toggle menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(btn);

    const scrim = document.createElement('div');
    scrim.className = 'nav-scrim';
    document.body.appendChild(scrim);

    const close = () => {
      links.classList.remove('open');
      btn.classList.remove('open');
      scrim.classList.remove('show');
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-locked');
    };
    const open = () => {
      links.classList.add('open');
      btn.classList.add('open');
      scrim.classList.add('show');
      btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-locked');
    };

    btn.addEventListener('click', () => {
      links.classList.contains('open') ? close() : open();
    });
    scrim.addEventListener('click', close);
    links.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) close();
    });
  }

  /* ---------- 4. Scroll reveal ---------- */
  function initReveal() {
    const targets = document.querySelectorAll(
      '.hero-ctas, .stat-strip, .section-heading, .teaser-card, .member-card, ' +
      '.field-card, .spotlight-grid, .about-grid, .about-facts, .contact-inner, ' +
      '.contact-page-inner, .page-header .eyebrow, .page-header h1, .page-header .lede, ' +
      '.reel-grid, .reel-card, .hero .eyebrow, .hero h1, .hero .lede'
    );
    if (!targets.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    targets.forEach((el, i) => {
      el.classList.add('reveal');
      // stagger children within grids a touch
      if (el.matches('.teaser-card, .member-card, .field-card, .reel-card')) {
        const siblings = Array.from(el.parentElement.children);
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = Math.min(idx * 80, 320) + 'ms';
      }
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach((el) => io.observe(el));
  }

  /* ---------- 5. Count-up stats ---------- */
  function animateCount(el) {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\D*)(\d+)(\D*)$/); // prefix, digits, suffix
    if (!match) {
      el.classList.add('count-pop');
      return;
    }
    const [, prefix, digits, suffix] = match;
    const target = parseInt(digits, 10);
    const padLen = digits.length;
    const duration = 1100;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = prefix + String(val).padStart(padLen, '0') + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = raw;
    }
    requestAnimationFrame(tick);
  }

  function initCounters() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const nums = entry.target.querySelectorAll('.stat b');
            nums.forEach((n) => animateCount(n));
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    document.querySelectorAll('.stat-strip').forEach((strip) => io.observe(strip));
  }

  /* ---------- 6. Magnetic / tilt buttons ---------- */
  function initMagnetic() {
    if (reduceMotion || matchMedia('(hover: none)').matches) return;
    document.querySelectorAll('.btn-primary, .btn-ghost').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.28}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- 7. Video reel cards (click to play / mute toggle) ---------- */
  function initReelCards() {
    document.querySelectorAll('.reel-card').forEach((card) => {
      const video = card.querySelector('video');
      if (!video) return;
      const playBtn = card.querySelector('.reel-play');

      const setPlayingState = (playing) => {
        card.classList.toggle('is-playing', playing);
      };

      const toggle = () => {
        if (video.paused) {
          document.querySelectorAll('.reel-card video').forEach((v) => {
            if (v !== video) {
              v.pause();
              v.closest('.reel-card').classList.remove('is-playing');
            }
          });
          video.muted = false;
          video.currentTime = 0;
          video.play().catch(() => {
            video.muted = true;
            video.play();
          });
          setPlayingState(true);
        } else {
          video.pause();
          setPlayingState(false);
        }
      };

      playBtn && playBtn.addEventListener('click', toggle);
      video.addEventListener('ended', () => setPlayingState(false));
      video.addEventListener('click', toggle);
    });
  }

  /* ---------- 8. Hero parallax (subtle, desktop only) ---------- */
  function initParallax() {
    const media = document.getElementById('hero-media');
    if (!media || reduceMotion || matchMedia('(hover: none)').matches) return;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        media.style.transform = `translateY(${y * 0.18}px) scale(1.06)`;
      }
    }, { passive: true });
  }

  /* ---------- 9. Smooth scroll for in-page anchors ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const target = id && document.getElementById(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-ready');
    initProgressBar();
    initHeaderScroll();
    initMobileNav();
    initReveal();
    initCounters();
    initMagnetic();
    initReelCards();
    initParallax();
    initSmoothScroll();
  });
})();
