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

  if (slides.length > 0) {
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
  }

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

  /* ===== BEFORE / AFTER COMPARISON ===== */
  const comparisonSliders = document.querySelectorAll('[data-comparison-slider]');

  comparisonSliders.forEach(function (slider) {
    const range = slider.querySelector('.comparison-range');
    if (!range) return;

    function updateComparison() {
      const value = Math.max(0, Math.min(100, Number(range.value)));
      const afterAmount = 100 - value;
      slider.style.setProperty('--comparison-position', value + '%');
      range.setAttribute('aria-valuetext', value + '% before image and ' + afterAmount + '% after image');
    }

    range.addEventListener('input', updateComparison);
    range.addEventListener('dragstart', function (e) {
      e.preventDefault();
    });
    updateComparison();
  });

  /* ===== SERVICES RAIL ===== */
  const servicesRail = document.querySelector('[data-services-rail]');
  const servicesTrack = document.querySelector('[data-services-track]');
  const servicesRailShell = document.querySelector('[data-services-rail-shell]');
  const servicesPrev = document.querySelector('[data-services-prev]');
  const servicesNext = document.querySelector('[data-services-next]');

  if (servicesRail && servicesTrack) {
    const originalCards = Array.from(servicesTrack.children);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let loopWidth = 0;
    let isPaused = false;
    let isDragging = false;
    let dragMoved = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let lastFrame = performance.now();
    let resumeTimer;

    originalCards.forEach(function (card) {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('inert', '');
      clone.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach(function (element) {
        element.setAttribute('tabindex', '-1');
      });
      servicesTrack.appendChild(clone);
    });

    function measureLoop() {
      const firstClone = servicesTrack.children[originalCards.length];
      loopWidth = firstClone ? firstClone.offsetLeft - servicesTrack.children[0].offsetLeft : 0;
      updateRailAffordances();
    }

    function updateRailAffordances() {
      if (!servicesRailShell) return;
      const canScrollLeft = servicesRail.scrollLeft > 3;
      const canScrollRight = servicesRail.scrollWidth - servicesRail.clientWidth - servicesRail.scrollLeft > 3;
      servicesRailShell.classList.toggle('can-scroll-left', canScrollLeft);
      servicesRailShell.classList.toggle('can-scroll-right', canScrollRight);

      if (servicesPrev) {
        servicesPrev.disabled = !canScrollLeft;
        servicesPrev.setAttribute('aria-hidden', String(!canScrollLeft));
      }
      if (servicesNext) {
        servicesNext.disabled = !canScrollRight;
        servicesNext.setAttribute('aria-hidden', String(!canScrollRight));
      }
    }

    function pauseRail() {
      isPaused = true;
      window.clearTimeout(resumeTimer);
      servicesRail.classList.remove('is-autoplaying');
    }

    function resumeRail(delay) {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(function () {
        isPaused = false;
        lastFrame = performance.now();
        if (!reducedMotion.matches) servicesRail.classList.add('is-autoplaying');
      }, delay || 0);
    }

    function normalizeScroll() {
      if (!loopWidth) return;
      while (servicesRail.scrollLeft >= loopWidth) servicesRail.scrollLeft -= loopWidth;
      while (servicesRail.scrollLeft < 0) servicesRail.scrollLeft += loopWidth;
      updateRailAffordances();
    }

    function animateRail(now) {
      const canAutoplay = !reducedMotion.matches;
      const autoplayActive = canAutoplay && !isPaused && !isDragging && Boolean(loopWidth);
      servicesRail.classList.toggle('is-autoplaying', autoplayActive);
      if (autoplayActive) {
        servicesRail.scrollLeft += Math.min(now - lastFrame, 32) * 0.036;
        normalizeScroll();
      }
      lastFrame = now;
      window.requestAnimationFrame(animateRail);
    }

    const servicesInteractionArea = servicesRailShell || servicesRail;
    servicesInteractionArea.addEventListener('mouseenter', pauseRail);
    servicesInteractionArea.addEventListener('mouseleave', function () { resumeRail(250); });
    servicesInteractionArea.addEventListener('focusin', pauseRail);
    servicesInteractionArea.addEventListener('focusout', function () { resumeRail(600); });
    servicesRail.addEventListener('wheel', function () {
      pauseRail();
      resumeRail(1200);
    }, { passive: true });
    servicesRail.addEventListener('scroll', updateRailAffordances, { passive: true });

    function scrollRailByCard(direction) {
      const firstCard = servicesTrack.children[0];
      const secondCard = servicesTrack.children[1];
      const cardStep = firstCard && secondCard ? secondCard.offsetLeft - firstCard.offsetLeft : servicesRail.clientWidth * 0.8;
      pauseRail();
      servicesRail.scrollBy({
        left: direction * cardStep,
        behavior: reducedMotion.matches ? 'auto' : 'smooth'
      });
      resumeRail(1500);
    }

    if (servicesPrev) {
      servicesPrev.addEventListener('pointerdown', pauseRail);
      servicesPrev.addEventListener('click', function () { scrollRailByCard(-1); });
    }

    if (servicesNext) {
      servicesNext.addEventListener('pointerdown', pauseRail);
      servicesNext.addEventListener('click', function () { scrollRailByCard(1); });
    }

    servicesRail.addEventListener('pointerdown', function (e) {
      pauseRail();
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      isDragging = true;
      dragMoved = false;
      dragStartX = e.clientX;
      dragStartScroll = servicesRail.scrollLeft;
      servicesRail.classList.add('is-dragging');
      servicesRail.setPointerCapture(e.pointerId);
    });

    servicesRail.addEventListener('pointermove', function (e) {
      if (!isDragging) return;
      const distance = e.clientX - dragStartX;
      if (Math.abs(distance) > 4) dragMoved = true;
      servicesRail.scrollLeft = dragStartScroll - distance;
      normalizeScroll();
    });

    function endRailDrag(e) {
      if (isDragging && servicesRail.hasPointerCapture(e.pointerId)) {
        servicesRail.releasePointerCapture(e.pointerId);
      }
      isDragging = false;
      servicesRail.classList.remove('is-dragging');
      resumeRail(e.pointerType === 'touch' ? 1500 : 900);
    }

    servicesRail.addEventListener('pointerup', endRailDrag);
    servicesRail.addEventListener('pointercancel', endRailDrag);
    servicesRail.addEventListener('click', function (e) {
      if (dragMoved) {
        e.preventDefault();
        e.stopPropagation();
        dragMoved = false;
      }
    }, true);

    window.addEventListener('resize', measureLoop);
    measureLoop();
    window.requestAnimationFrame(animateRail);
  }

  /* ===== SCROLL REVEAL ===== */
  const revealEls = document.querySelectorAll(
    '.gallery-item, .testimonial-card, .about-img-primary, .about-img-secondary, .about-story-intro, .about-proof-item, .about-story-link, .contact-info, .section-header'
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

  /* ===== MGM PROCESS SCROLL SEQUENCE ===== */
  const processSection = document.getElementById('process');
  const processPanels = processSection ? processSection.querySelectorAll('.process-panel') : [];
  const processCta = processSection ? processSection.querySelector('.process-cta') : null;
  const processCtaLink = processCta ? processCta.querySelector('a') : null;
  const mobileProcessQuery = window.matchMedia('(max-width: 768px)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let mobileProcessObserver = null;
  let scrollFramePending = false;

  const processTimings = [
    { start: 0.04, end: 0.25, direction: -1 },
    { start: 0.16, end: 0.37, direction: 1 },
    { start: 0.28, end: 0.49, direction: -1 },
    { start: 0.40, end: 0.61, direction: 1 }
  ];

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  function updateProcessScroll() {
    if (!processSection || mobileProcessQuery.matches || reducedMotionQuery.matches) return;

    const scrollDistance = Math.max(processSection.offsetHeight - window.innerHeight, 1);
    const progress = clamp((window.scrollY - processSection.offsetTop) / scrollDistance, 0, 1);
    const entryDistance = Math.min(window.innerWidth * 0.72, 900);

    processPanels.forEach(function (panel, index) {
      const timing = processTimings[index];
      const localProgress = clamp((progress - timing.start) / (timing.end - timing.start), 0, 1);
      const easedProgress = easeOutCubic(localProgress);
      const x = timing.direction * entryDistance * (1 - easedProgress);
      panel.style.setProperty('--panel-x', x.toFixed(2) + 'px');
      panel.style.setProperty('--panel-opacity', clamp(localProgress * 1.7, 0, 1).toFixed(3));
    });

    if (processCta) {
      const ctaProgress = clamp((progress - 0.62) / 0.07, 0, 1);
      processCta.style.setProperty('--cta-opacity', ctaProgress.toFixed(3));
      processCta.style.setProperty('--cta-y', ((1 - ctaProgress) * 12).toFixed(2) + 'px');
      processCta.classList.toggle('is-inactive', ctaProgress < 0.01);
      if (processCtaLink) {
        if (ctaProgress < 0.01) processCtaLink.setAttribute('tabindex', '-1');
        else processCtaLink.removeAttribute('tabindex');
      }
    }
  }

  function setupProcessMode() {
    if (!processSection) return;

    if (mobileProcessObserver) {
      mobileProcessObserver.disconnect();
      mobileProcessObserver = null;
    }

    if (reducedMotionQuery.matches) {
      processPanels.forEach(function (panel) {
        panel.classList.add('mobile-visible');
        panel.style.removeProperty('--panel-x');
        panel.style.removeProperty('--panel-opacity');
      });
      if (processCta) {
        processCta.classList.remove('is-inactive');
        processCta.style.removeProperty('--cta-opacity');
        processCta.style.removeProperty('--cta-y');
        if (processCtaLink) processCtaLink.removeAttribute('tabindex');
      }
      return;
    }

    if (mobileProcessQuery.matches) {
      processPanels.forEach(function (panel) {
        panel.classList.remove('mobile-visible');
        panel.style.removeProperty('--panel-x');
        panel.style.removeProperty('--panel-opacity');
      });
      if (processCta) {
        processCta.classList.remove('is-inactive');
        processCta.style.removeProperty('--cta-opacity');
        processCta.style.removeProperty('--cta-y');
        if (processCtaLink) processCtaLink.removeAttribute('tabindex');
      }

      if ('IntersectionObserver' in window) {
        mobileProcessObserver = new IntersectionObserver(function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('mobile-visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.18 });

        processPanels.forEach(function (panel) {
          mobileProcessObserver.observe(panel);
        });
      } else {
        processPanels.forEach(function (panel) {
          panel.classList.add('mobile-visible');
        });
      }
    } else {
      processPanels.forEach(function (panel) {
        panel.classList.remove('mobile-visible');
      });
      updateProcessScroll();
    }
  }

  if (processSection) {
    document.documentElement.classList.add('process-enhanced');
    setupProcessMode();
  }

  function runScrollUpdates() {
    updateNavbar();
    checkStatsInView();
    checkReveal();
    updateProcessScroll();
    updateActiveNav();
    scrollFramePending = false;
  }

  function requestScrollUpdates() {
    if (scrollFramePending) return;
    scrollFramePending = true;
    requestAnimationFrame(runScrollUpdates);
  }

  window.addEventListener('scroll', requestScrollUpdates, { passive: true });
  requestScrollUpdates();

  let processResizeFrame = null;
  window.addEventListener('resize', function () {
    if (processResizeFrame !== null) cancelAnimationFrame(processResizeFrame);
    processResizeFrame = requestAnimationFrame(function () {
      processResizeFrame = null;
      setupProcessMode();
      requestScrollUpdates();
    });
  });

  if (typeof reducedMotionQuery.addEventListener === 'function') {
    reducedMotionQuery.addEventListener('change', setupProcessMode);
  }

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
  const contactFormToggle = document.getElementById('contact-form-toggle');
  const contactFormToggleLabel = document.getElementById('contact-form-toggle-label');
  const contactFormPanel = document.getElementById('contact-form-panel');
  const contactLayout = document.querySelector('.contact-layout');
  let contactPanelTimer;

  if (contactFormToggle && contactFormPanel && contactLayout) {
    contactLayout.classList.add('is-collapsible');
    contactFormPanel.hidden = true;
    contactFormPanel.setAttribute('inert', '');

    contactFormToggle.addEventListener('click', function () {
      const isOpening = contactFormToggle.getAttribute('aria-expanded') === 'false';
      window.clearTimeout(contactPanelTimer);
      contactFormToggle.setAttribute('aria-expanded', String(isOpening));
      contactFormToggleLabel.textContent = isOpening ? 'Close Contact Form' : 'Open Contact Form';

      if (isOpening) {
        contactFormPanel.hidden = false;
        contactFormPanel.removeAttribute('inert');
        window.requestAnimationFrame(function () {
          contactFormPanel.classList.add('is-open');
        });
      } else {
        contactFormPanel.setAttribute('inert', '');
        contactFormPanel.classList.remove('is-open');

        if (reducedMotionQuery.matches) {
          contactFormPanel.hidden = true;
        } else {
          contactPanelTimer = window.setTimeout(function () {
            contactFormPanel.hidden = true;
          }, 400);
        }
      }
    });
  }

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

})();
