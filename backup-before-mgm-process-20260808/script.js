/* ============================================================
   MGM Floors LLC — JavaScript
   Features: Navbar scroll, Hero slider, Stat counters,
             Gallery filter + Lightbox, Reveal animations,
             Mobile menu, Contact form
   ============================================================ */

(function () {
  'use strict';

  /* ===== NAVBAR SCROLL ===== */
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ===== MOBILE MENU ===== */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const navLinkItems = navLinks.querySelectorAll('a');
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    navLinks.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    // Animate hamburger to X
    const lines = navToggle.querySelectorAll('.hamburger-line');
    lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    lines[1].style.opacity = '0';
    lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  }

  function closeMenu() {
    menuOpen = false;
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    const lines = navToggle.querySelectorAll('.hamburger-line');
    lines[0].style.transform = '';
    lines[1].style.opacity = '';
    lines[2].style.transform = '';
  }

  navToggle.addEventListener('click', function () {
    if (menuOpen) closeMenu();
    else openMenu();
  });

  navLinkItems.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* ===== HERO SLIDER ===== */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slide-dot');
  let currentSlide = 0;
  let sliderInterval;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function startSlider() {
    sliderInterval = setInterval(nextSlide, 5500);
  }

  function resetSlider() {
    clearInterval(sliderInterval);
    startSlider();
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      goToSlide(i);
      resetSlider();
    });
  });

  startSlider();

  /* ===== STAT COUNTERS ===== */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function easeOutQuad(t) {
    return t * (2 - t);
  }

  function animateCounter(el, target, duration) {
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuad(progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  function checkStatsInView() {
    if (statsAnimated) return;
    const strip = document.querySelector('.stats-strip');
    if (!strip) return;
    const rect = strip.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      statsAnimated = true;
      statNumbers.forEach(function (el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateCounter(el, target, 1800);
      });
    }
  }

  window.addEventListener('scroll', checkStatsInView, { passive: true });
  checkStatsInView();

  /* ===== GALLERY FILTER ===== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      galleryItems.forEach(function (item) {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'none';
          void item.offsetWidth; // reflow
          item.style.animation = 'galleryReveal 0.45s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* Gallery reveal animation via CSS injection */
  const styleTag = document.createElement('style');
  styleTag.textContent = '@keyframes galleryReveal { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }';
  document.head.appendChild(styleTag);

  /* ===== GALLERY LIGHTBOX ===== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let lightboxImages = [];
  let lightboxIndex = 0;

  function buildLightboxImages() {
    lightboxImages = [];
    galleryItems.forEach(function (item) {
      if (!item.classList.contains('hidden')) {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-overlay span');
        lightboxImages.push({
          src: img ? img.getAttribute('src') : '',
          alt: img ? img.getAttribute('alt') : '',
          caption: caption ? caption.textContent : ''
        });
      }
    });
  }

  function openLightbox(index) {
    buildLightboxImages();
    lightboxIndex = index;
    showLightboxImage(lightboxIndex);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showLightboxImage(index) {
    const data = lightboxImages[index];
    if (!data) return;
    lightboxImg.style.opacity = '0';
    setTimeout(function () {
      lightboxImg.setAttribute('src', data.src);
      lightboxImg.setAttribute('alt', data.alt);
      lightboxCaption.textContent = data.caption;
      lightboxImg.style.opacity = '1';
    }, 150);
  }

  lightboxClose.addEventListener('click', closeLightbox);

  lightboxPrev.addEventListener('click', function () {
    lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    showLightboxImage(lightboxIndex);
  });

  lightboxNext.addEventListener('click', function () {
    lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
    showLightboxImage(lightboxIndex);
  });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  /* Add lightbox transition for img opacity */
  lightboxImg.style.transition = 'opacity 0.2s ease';

  galleryItems.forEach(function (item, i) {
    item.addEventListener('click', function () {
      buildLightboxImages();
      // Find visible items to get right index
      const visibleItems = Array.from(galleryItems).filter(function (it) {
        return !it.classList.contains('hidden');
      });
      const visIdx = visibleItems.indexOf(item);
      openLightbox(visIdx);
    });
  });

  /* ===== SCROLL REVEAL ===== */
  const revealEls = document.querySelectorAll(
    '.service-card, .gallery-item, .testimonial-card, .about-visuals, .about-content, .contact-info, .contact-form, .section-header'
  );

  revealEls.forEach(function (el) {
    el.classList.add('reveal');
  });

  function checkReveal() {
    revealEls.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  checkReveal();

  /* Add staggered delays to service cards and gallery items */
  document.querySelectorAll('.service-card').forEach(function (el, i) {
    el.style.transitionDelay = (i * 0.07) + 's';
  });

  /* ===== SMOOTH SCROLL (fallback for older browsers) ===== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80);
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ===== CONTACT FORM ===== */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const formSubmit = document.getElementById('form-submit');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();

      if (!name || !email) {
        document.getElementById(!name ? 'form-name' : 'form-email').focus();
        return;
      }

      // Simulate submission
      formSubmit.textContent = 'Sending\u2026';
      formSubmit.disabled = true;
      formSubmit.style.opacity = '0.7';

      setTimeout(function () {
        contactForm.style.display = 'none';
        formSuccess.hidden = false;
      }, 1400);
    });
  }

  /* ===== ACTIVE NAV LINK ON SCROLL ===== */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinkEls.forEach(function (link) {
          link.classList.remove('active-nav');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active-nav');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

})();
