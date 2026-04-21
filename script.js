/* ============================================================
   MANICKAM AASAIMANI — Portfolio Script
   File: script.js
   
   Sections:
   1. DOM Ready Wrapper
   2. Mobile Menu
   3. Hero Image Slider
   4. Typewriter Effect
   5. Scroll Reveal Animation
   6. Skill Bar Animation
   7. Counter Animation (Profile Card)
   8. Active Nav Tab on Scroll
   9. Resume Editor (Edit / Download)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. MOBILE MENU ─────────────────────────────────────── */
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', function () {
    mobileMenu.classList.toggle('open');
  });

  // Close menu when any link is clicked
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    const clickedOutside = !mobileMenu.contains(e.target) && !hamburger.contains(e.target);
    if (clickedOutside) {
      mobileMenu.classList.remove('open');
    }
  });


  /* ── 2. HERO IMAGE SLIDER ───────────────────────────────── */
  const slides      = document.querySelectorAll('.hero-slide');
  const dots        = document.querySelectorAll('.slide-dot');
  const prevBtn     = document.getElementById('slidePrev');
  const nextBtn     = document.getElementById('slideNext');
  let   currentSlide = 0;
  let   slideTimer   = null;
  const SLIDE_INTERVAL = 5000; // 5 seconds

  // Go to a specific slide by index
  function goToSlide(index) {
    // Remove active class from current slide and dot
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    // Calculate new index (wrap around)
    currentSlide = (index + slides.length) % slides.length;

    // Add active class to new slide and dot
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  // Start auto-play timer
  function startAutoPlay() {
    clearInterval(slideTimer);
    slideTimer = setInterval(function () {
      goToSlide(currentSlide + 1);
    }, SLIDE_INTERVAL);
  }

  // Arrow button events
  prevBtn.addEventListener('click', function () {
    goToSlide(currentSlide - 1);
    startAutoPlay(); // reset timer on manual click
  });

  nextBtn.addEventListener('click', function () {
    goToSlide(currentSlide + 1);
    startAutoPlay();
  });

  // Dot click events
  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      goToSlide(index);
      startAutoPlay();
    });
  });

  // Touch/swipe support
  let touchStartX = 0;
  const heroSection = document.getElementById('home');

  heroSection.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  heroSection.addEventListener('touchend', function (e) {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
      startAutoPlay();
    }
  });

  // Pause on hover, resume on leave
  heroSection.addEventListener('mouseenter', function () { clearInterval(slideTimer); });
  heroSection.addEventListener('mouseleave', startAutoPlay);

  // Initialise
  goToSlide(0);
  startAutoPlay();


  /* ── 3. TYPEWRITER EFFECT ───────────────────────────────── */
  const typeEl = document.getElementById('typewriter');

  // List of roles to cycle through
  const roles = [
    'Full Stack Developer',
    'Java & Spring Boot Engineer',
    'AI-Integrated App Builder',
    'React & Angular Developer',
    'Freelance Developer'
  ];

  let roleIndex = 0;   // which role we're on
  let charIndex = 0;   // how many characters typed so far
  let isDeleting = false;

  function typeWrite() {
    if (!typeEl) return;

    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      // Typing forward
      typeEl.textContent = currentRole.slice(0, charIndex + 1);
      charIndex++;

      // Finished typing this role — pause then start deleting
      if (charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeWrite, 2000); // pause 2s before deleting
        return;
      }
    } else {
      // Deleting
      typeEl.textContent = currentRole.slice(0, charIndex - 1);
      charIndex--;

      // Finished deleting — move to next role
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    // Speed: delete faster than type
    const speed = isDeleting ? 45 : 85;
    setTimeout(typeWrite, speed);
  }

  // Start after small delay
  setTimeout(typeWrite, 800);


  /* ── 4. SCROLL REVEAL ANIMATION ────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // only animate once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(function (el, index) {
    // Stagger delay based on position in a group
    el.style.transitionDelay = (index % 4 * 80) + 'ms';
    revealObserver.observe(el);
  });


  /* ── 5. SKILL BAR ANIMATION ─────────────────────────────── */
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const barObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Set width from data-w attribute (e.g. "85%")
        entry.target.style.width = entry.target.dataset.w;
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  skillBars.forEach(function (bar) {
    barObserver.observe(bar);
  });


  /* ── 6. COUNTER ANIMATION (Profile Card) ────────────────── */
  const counterElements = document.querySelectorAll('[data-target]');

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix || '';
    const isFloat  = !Number.isInteger(target);
    const duration = 1400;
    const steps    = 40;
    let   step     = 0;

    const interval = setInterval(function () {
      step++;
      const eased = 1 - Math.pow(1 - step / steps, 3); // ease-out cubic
      const value = target * eased;
      el.textContent = (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;

      if (step >= steps) {
        clearInterval(interval);
        el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
      }
    }, duration / steps);
  }

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(function (el) {
    counterObserver.observe(el);
  });


  /* ── 7. ACTIVE NAV TAB ON SCROLL ────────────────────────── */
  const sections    = document.querySelectorAll('section[id]');
  const navTabs     = document.querySelectorAll('.nav-tab');
  const NAV_HEIGHT  = 48;

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navTabs.forEach(function (tab) {
          const href = tab.getAttribute('href');
          tab.classList.toggle('active', href === '#' + id);
        });
      }
    });
  }, {
    threshold: 0.4,
    rootMargin: '-' + NAV_HEIGHT + 'px 0px 0px 0px'
  });

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  // Smooth scroll with nav offset
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 10;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });


  /* ── 8. RESUME EDITOR ───────────────────────────────────── */
  const btnEdit      = document.getElementById('btnEdit');
  const btnDownPDF   = document.getElementById('btnDownPDF');
  const btnDownHTML  = document.getElementById('btnDownHTML');
  const resumeDoc    = document.getElementById('resumeDoc');
  const editIndicator = document.getElementById('editIndicator');
  let   editMode     = false;

  // Toggle edit mode
  btnEdit.addEventListener('click', function () {
    editMode = !editMode;

    // Enable/disable contenteditable on all editable elements in the resume
    resumeDoc.querySelectorAll('[contenteditable]').forEach(function (el) {
      el.setAttribute('contenteditable', editMode ? 'true' : 'false');
    });

    // Update button text and style
    btnEdit.textContent = editMode ? '✓ Done Editing' : '✏️ Edit Resume';
    btnEdit.style.background = editMode ? '#4ec9b0' : '';
    btnEdit.style.color = editMode ? '#fff' : '';

    // Show/hide floating indicator
    editIndicator.classList.toggle('visible', editMode);
  });

  // Download as PDF (uses browser print)
  btnDownPDF.addEventListener('click', function () {
    // Stop editing first
    if (editMode) btnEdit.click();

    // Open resume in new window and print it
    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Manickam Aasaimani — Resume</title>
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
          /* --- Print styles --- */
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Inter', sans-serif; background: white; color: #1e1e1e; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .resume-doc { max-width: 800px; margin: 0 auto; }

          /* Header */
          .resume-header { background: #1e3a8a; padding: 1.75rem 2rem; color: white; }
          .resume-name { font-size: 1.7rem; font-weight: 900; color: white; letter-spacing: -0.03em; margin-bottom: 0.2rem; }
          .resume-role { font-family: 'Fira Code', monospace; font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-bottom: 1rem; }
          .resume-contacts { display: flex; flex-wrap: wrap; gap: 0.5rem; }
          .resume-contact { font-family: 'Fira Code', monospace; font-size: 0.68rem; color: rgba(255,255,255,0.65); background: rgba(255,255,255,0.08); padding: 0.18rem 0.55rem; border-radius: 4px; }

          /* Body */
          .resume-body { padding: 1.5rem 2rem; }
          .resume-section { margin-bottom: 1.5rem; }
          .resume-section-title { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #007acc; margin-bottom: 0.75rem; padding-bottom: 0.3rem; border-bottom: 1px solid #dbeafe; display: flex; align-items: center; gap: 0.5rem; }
          .resume-section-title::after { content: ''; flex: 1; }
          .resume-item { margin-bottom: 0.85rem; }
          .resume-item-header { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.2rem; }
          .resume-item-title { font-size: 0.88rem; font-weight: 700; color: #1e1e1e; }
          .resume-item-date { font-family: 'Fira Code', monospace; font-size: 0.65rem; color: #007acc; background: #eff6ff; padding: 0.12rem 0.5rem; border-radius: 3px; }
          .resume-item-sub { font-family: 'Fira Code', monospace; font-size: 0.72rem; color: #007acc; margin-bottom: 0.3rem; margin-top: 0.1rem; }
          .resume-item-desc { font-size: 0.78rem; color: #444; line-height: 1.65; }
          .resume-item-desc li { padding-left: 0.9rem; position: relative; margin-bottom: 0.15rem; }
          .resume-item-desc li::before { content: '▸'; position: absolute; left: 0; color: #007acc; font-size: 0.62rem; top: 0.12rem; }
          .resume-skills-grid { display: flex; flex-wrap: wrap; gap: 0.35rem; }
          .resume-skill { font-family: 'Fira Code', monospace; font-size: 0.68rem; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; padding: 0.18rem 0.55rem; border-radius: 3px; }

          @media print { @page { margin: 0.5in; } }
        </style>
      </head>
      <body>
        ${resumeDoc.innerHTML}
      </body>
      </html>
    `);
    printWin.document.close();
    setTimeout(function () { printWin.print(); }, 600);
  });

  // Download as HTML file
  btnDownHTML.addEventListener('click', function () {
    const nameEl = resumeDoc.querySelector('.resume-name');
    const name   = nameEl ? nameEl.textContent.trim() : 'Resume';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${name} - Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #f8faff; display: flex; justify-content: center; padding: 2rem; }
    .resume-doc { max-width: 800px; width: 100%; background: #1e1e1e; border-radius: 10px; overflow: hidden; box-shadow: 0 12px 48px rgba(0,0,0,0.5); }
    .resume-header { background: #0b2a5c; padding: 1.75rem 2rem; }
    .resume-name { font-size: 1.7rem; font-weight: 900; color: white; letter-spacing: -0.03em; margin-bottom: 0.2rem; }
    .resume-role { font-family: 'Fira Code', monospace; font-size: 0.8rem; color: rgba(255,255,255,0.65); margin-bottom: 1rem; }
    .resume-contacts { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .resume-contact { font-family: 'Fira Code', monospace; font-size: 0.68rem; color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); padding: 0.2rem 0.6rem; border-radius: 4px; }
    .resume-body { padding: 1.5rem 2rem; color: #d4d4d4; }
    .resume-section { margin-bottom: 1.5rem; }
    .resume-section-title { font-family: 'Fira Code', monospace; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #007acc; margin-bottom: 0.75rem; padding-bottom: 0.3rem; border-bottom: 1px solid #3e3e42; }
    .resume-item { margin-bottom: 0.85rem; }
    .resume-item-header { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.2rem; }
    .resume-item-title { font-size: 0.88rem; font-weight: 700; color: #ffffff; }
    .resume-item-date { font-family: 'Fira Code', monospace; font-size: 0.65rem; color: #9cdcfe; background: rgba(86,156,214,0.1); border: 1px solid rgba(86,156,214,0.2); padding: 0.12rem 0.5rem; border-radius: 3px; }
    .resume-item-sub { font-family: 'Fira Code', monospace; font-size: 0.72rem; color: #9cdcfe; margin-bottom: 0.3rem; margin-top: 0.1rem; }
    .resume-item-desc { font-size: 0.78rem; color: #858585; line-height: 1.65; }
    .resume-item-desc li { padding-left: 0.9rem; position: relative; margin-bottom: 0.15rem; }
    .resume-item-desc li::before { content: '▸'; position: absolute; left: 0; color: #007acc; font-size: 0.62rem; top: 0.12rem; }
    .resume-skills-grid { display: flex; flex-wrap: wrap; gap: 0.35rem; }
    .resume-skill { font-family: 'Fira Code', monospace; font-size: 0.68rem; background: #37373d; color: #9cdcfe; border: 1px solid rgba(86,156,214,0.2); padding: 0.18rem 0.55rem; border-radius: 3px; }
  </style>
</head>
<body>
  ${resumeDoc.innerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = name.replace(/\s+/g, '_') + '_Resume.html';
    a.click();
    URL.revokeObjectURL(url);
  });

}); // end DOMContentLoaded
