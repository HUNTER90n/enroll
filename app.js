/**
 * CyberLearn Academy — Interactive Landing Page
 * Professional Edition — WhatsApp: 923005381443
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─── DOM Elements ──────────────────────────────────────────
  const canvas        = document.getElementById('animation-canvas');
  const ctx           = canvas.getContext('2d');
  const loadingScreen = document.getElementById('loading-screen');
  const loaderText    = document.getElementById('loader-text');
  const loaderBarFill = document.getElementById('loader-progress-bar');
  const scrollTrack   = document.getElementById('scroll-track-element');
  const heroHeadings  = document.getElementById('hero-headings');
  const orbLeft       = document.getElementById('orb-left');
  const orbRight      = document.getElementById('orb-right');
  const orbCenter     = document.getElementById('orb-center');
  const modalBackdrop = document.getElementById('form-modal-backdrop');
  const modalWrapper  = document.getElementById('form-modal-wrapper');
  const closeModalBtn = document.getElementById('close-modal-trigger');
  const enrollForm    = document.getElementById('whatsapp-enrollment-form');
  const stickyWidget  = document.getElementById('floating-sticky-cta');
  const mainHeader    = document.getElementById('main-header');

  // ─── Animation State ───────────────────────────────────────
  const totalFrames = 240;
  const images      = [];
  let currentFrame  = 1;
  let targetFrame   = 1;
  let scrollPercent = 0;
  let isAllLoaded   = false;

  const pad = (num, size) => {
    let s = '000' + num;
    return s.substring(s.length - size);
  };

  // ─── 1. Image Preloader ────────────────────────────────────
  let loadedCount = 0;

  const preloadImages = () => new Promise((resolve) => {
    for (let i = 1; i <= totalFrames; i++) {
      const img      = new Image();
      const frameStr = pad(i, 3);

      img.onload  = onLoad;
      img.onerror = onLoad;
      img.src     = `./images/ezgif-frame-${frameStr}.jpg`;
      images.push(img);
    }

    function onLoad() {
      loadedCount++;
      const progress = Math.round((loadedCount / totalFrames) * 100);
      loaderText.textContent    = `${progress}%`;
      loaderBarFill.style.width = `${progress}%`;

      if (loadedCount >= totalFrames) {
        isAllLoaded = true;
        setTimeout(() => {
          loadingScreen.classList.add('loaded');
          document.body.style.overflow = 'auto';
          resolve();
        }, 600);
      }
    }
  });

  // ─── 2. Canvas Rendering ───────────────────────────────────
  const resizeCanvas = () => {
    const dpr      = window.devicePixelRatio || 1;
    canvas.width   = window.innerWidth  * dpr;
    canvas.height  = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    if (isAllLoaded) drawFrame();
  };

  const drawFrame = () => {
    const idx    = Math.min(Math.max(Math.floor(currentFrame), 1), totalFrames);
    const img    = images[idx - 1];
    if (!img) return;

    const dpr    = window.devicePixelRatio || 1;
    const cW     = canvas.width  / dpr;
    const cH     = canvas.height / dpr;
    ctx.clearRect(0, 0, cW, cH);

    const iW  = img.naturalWidth  || img.width;
    const iH  = img.naturalHeight || img.height;
    const iR  = iW / iH;
    const cR  = cW / cH;

    let dW, dH;
    if (cR > iR) { dH = cH; dW = cH * iR; }
    else          { dW = cW; dH = cW / iR; }

    ctx.drawImage(img, (cW - dW) / 2, (cH - dH) / 2, dW, dH);
  };

  // ─── 3. Scroll Handler ─────────────────────────────────────
  const onScroll = () => {
    const total = scrollTrack.scrollHeight - window.innerHeight;
    if (total <= 0) return;

    scrollPercent = Math.min(Math.max(window.scrollY / total, 0), 1);
    targetFrame   = 1 + scrollPercent * (totalFrames - 1);

    // Hero overlay fade/rise
    if (heroHeadings) {
      const opacity   = Math.max(1 - scrollPercent * 3.5, 0);
      const translateY = -scrollPercent * 160;
      heroHeadings.style.opacity   = opacity;
      heroHeadings.style.transform = `translateY(${translateY}px)`;
      heroHeadings.style.pointerEvents = opacity <= 0.01 ? 'none' : 'auto';
    }

    // Sticky widget
    scrollPercent > 0.15
      ? stickyWidget.classList.add('visible')
      : stickyWidget.classList.remove('visible');

    // Header "scrolled" state
    mainHeader && (window.scrollY > 60
      ? mainHeader.classList.add('scrolled')
      : mainHeader.classList.remove('scrolled'));
  };

  // ─── 4. Scroll Reveal (IntersectionObserver) ───────────────
  const initScrollReveal = () => {
    const targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  };

  // ─── 5. Modal Controllers ──────────────────────────────────
  const openModal = (preselect = '') => {
    modalBackdrop.classList.add('open');
    modalWrapper.classList.add('open');
    document.body.style.overflow = 'hidden';
    stickyWidget.classList.remove('visible');

    if (preselect) {
      document.querySelectorAll('input[name="course-selection"]').forEach(chk => {
        chk.checked = (chk.value === preselect || (preselect === 'bundle' && chk.id === 'chk-bundle'));
      });
      if (preselect === 'bundle') toggleBundle(true);
    }
  };

  const closeModal = () => {
    modalBackdrop.classList.remove('open');
    modalWrapper.classList.remove('open');
    document.body.style.overflow = 'auto';
    if (scrollPercent > 0.15) stickyWidget.classList.add('visible');
  };

  // Open triggers
  document.querySelectorAll('.open-modal-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal();
    });
  });

  // Card-specific pre-select
  document.getElementById('card-hacking').addEventListener('click',  () => openModal('Linux & Ethical Hacking'));
  document.getElementById('card-webdev').addEventListener('click',   () => openModal('Web Development (HTML/CSS/JS)'));
  document.getElementById('card-creative').addEventListener('click', () => openModal('Animated Website Design'));

  // Close
  closeModalBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  // Keyboard close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalWrapper.classList.contains('open')) closeModal();
  });

  // ─── 6. Bundle Checkbox Sync ───────────────────────────────
  const chkBundle         = document.getElementById('chk-bundle');
  const courseCheckboxes  = document.querySelectorAll('input[name="course-selection"]:not(#chk-bundle)');

  const toggleBundle = (state) => courseCheckboxes.forEach(c => (c.checked = state));

  if (chkBundle) {
    chkBundle.addEventListener('change', () => toggleBundle(chkBundle.checked));
  }
  courseCheckboxes.forEach(chk => {
    chk.addEventListener('change', () => {
      if (!chk.checked && chkBundle.checked) chkBundle.checked = false;
      if (Array.from(courseCheckboxes).every(c => c.checked)) chkBundle.checked = true;
    });
  });

  // ─── 7. Countdown Timer ────────────────────────────────────
  const initCountdown = () => {
    const hoursEl = document.getElementById('timer-hours');
    const minsEl  = document.getElementById('timer-minutes');
    const secsEl  = document.getElementById('timer-seconds');
    const KEY     = 'cyberlearn_urgency_v2';

    const now = Date.now();
    let target = parseInt(localStorage.getItem(KEY) || '0');
    if (!target || target < now) {
      target = now + 24 * 60 * 60 * 1000;
      localStorage.setItem(KEY, target.toString());
    }

    const tick = () => {
      let diff = target - Date.now();
      if (diff < 0) {
        target = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem(KEY, target.toString());
        diff = 24 * 60 * 60 * 1000;
      }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1000);
      hoursEl.textContent = String(h).padStart(2, '0');
      minsEl.textContent  = String(m).padStart(2, '0');
      secsEl.textContent  = String(s).padStart(2, '0');
    };

    tick();
    setInterval(tick, 1000);
  };

  // ─── 8. 3D Card Tilt ───────────────────────────────────────
  document.querySelectorAll('.course-card, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r  = card.getBoundingClientRect();
      const rX = -((e.clientY - r.top)  / r.height - 0.5) * 14;
      const rY =  ((e.clientX - r.left) / r.width  - 0.5) * 14;
      card.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ─── 9. FAQ Accordion ──────────────────────────────────────
  document.querySelectorAll('.faq-item').forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const icon    = item.querySelector('.faq-icon');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-icon').textContent = '+';
      });
      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        icon.textContent = '−';
      }
    });
  });

  // ─── 10. WhatsApp Form Submit ──────────────────────────────
  // Academy number: 0300-5381443 → international: 923005381443
  const ACADEMY_WA = '923005381443';

  if (enrollForm) {
    enrollForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = document.getElementById('modal-name').value.trim();
      const message = document.getElementById('modal-message').value.trim();
      const courses = [];
      document.querySelectorAll('input[name="course-selection"]:checked')
        .forEach(chk => courses.push(chk.value));

      if (!name) {
        alert('Please enter your Full Name.');
        return;
      }
      if (courses.length === 0) {
        alert('Please select at least one Course Pathway.');
        return;
      }

      let text = `Hello! I want to enroll in CyberLearn Academy.\n\n`;
      text    += `Name: ${name}\n`;
      text    += `Course(s): ${courses.join(', ')}\n`;
      if (message) text += `Message: ${message}\n`;
      text    += `\nI am interested in joining the next cohort.`;

      window.open(`https://wa.me/${ACADEMY_WA}?text=${encodeURIComponent(text)}`, '_blank');
      closeModal();
      enrollForm.reset();
    });
  }

  // ─── 11. Mouse Parallax Orbs ───────────────────────────────
  window.addEventListener('mousemove', (e) => {
    const mx = e.clientX / window.innerWidth  - 0.5;
    const my = e.clientY / window.innerHeight - 0.5;
    if (orbLeft)   orbLeft.style.transform   = `translate(${mx*38}px, ${my*38}px)`;
    if (orbRight)  orbRight.style.transform  = `translate(${mx*-56}px, ${my*-56}px) scale(1.04)`;
    if (orbCenter) orbCenter.style.transform = `translate(-50%,-50%) translate(${mx*22}px, ${my*22}px)`;
  });

  // ─── 12. Smooth Navbar Anchors ─────────────────────────────
  const navMap = {
    'nav-item-programs':   'course-section',
    'nav-item-success':    'testimonials-section',
    'nav-item-inquiries':  'faq-section',
  };
  Object.entries(navMap).forEach(([btnId, targetId]) => {
    const el = document.getElementById(btnId);
    if (el) el.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const brandLogo = document.getElementById('hud-brand-logo');
  if (brandLogo) brandLogo.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── 13. LERP Render Loop ──────────────────────────────────
  const tick = () => {
    const diff = targetFrame - currentFrame;
    if (Math.abs(diff) > 0.002) {
      currentFrame += diff * 0.085;
      if (isAllLoaded) drawFrame();
    }
    requestAnimationFrame(tick);
  };

  // ─── 14. GSAP Cinematic Entrance ───────────────────────────
  const cinematic = () => {
    if (typeof gsap === 'undefined') return;
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });
    tl.fromTo('.hero-tag',       { opacity: 0, y: 18 }, { opacity: 1, y: 0, delay: 0.2 });
    tl.fromTo('.hero-title',     { opacity: 0, y: 36 }, { opacity: 1, y: 0 }, '-=0.9');
    tl.fromTo('.hero-desc',      { opacity: 0, y: 22 }, { opacity: 1, y: 0 }, '-=0.9');
    tl.fromTo('.hero-cta-group', { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, '-=0.9');
  };

  // ─── 15. Bootstrap ─────────────────────────────────────────
  document.body.style.overflow = 'hidden';
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('scroll', onScroll, { passive: true });

  preloadImages().then(() => {
    drawFrame();
    tick();
    initCountdown();
    initScrollReveal();
    cinematic();
  });
});
