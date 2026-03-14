/* ============================================================
   School Solutions 360 — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     DOM References
  ---------------------------------------------------------- */
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const navMenu     = document.getElementById('navMenu');
  const navLinks    = document.querySelectorAll('.nav-link');
  const footerYear  = document.getElementById('footerYear');
  const sections    = document.querySelectorAll('section[id]');
  const revealEls   = document.querySelectorAll('.reveal');


  /* ----------------------------------------------------------
     Footer Year
  ---------------------------------------------------------- */
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }


  /* ----------------------------------------------------------
     Sticky Navbar — scroll class toggle
  ---------------------------------------------------------- */
  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run on load in case page starts scrolled


  /* ----------------------------------------------------------
     Mobile Hamburger Menu
  ---------------------------------------------------------- */
  function openMenu() {
    hamburger.classList.add('open');
    navMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when a nav link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (
      navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close menu when window is resized above mobile breakpoint
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });


  /* ----------------------------------------------------------
     Smooth Scrolling for anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
        10
      ) || 80;

      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    });
  });


  /* ----------------------------------------------------------
     Active Nav Link Highlighting on Scroll
  ---------------------------------------------------------- */
  function setActiveNavLink() {
    let currentSection = '';
    const navHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
      10
    ) || 80;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - navHeight - 60;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveNavLink, { passive: true });
  setActiveNavLink();


  /* ----------------------------------------------------------
     Scroll Reveal Animations — IntersectionObserver
  ---------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // Animate once
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all elements if IntersectionObserver is not supported
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ----------------------------------------------------------
     Solution Card — subtle tilt on mouse move
  ---------------------------------------------------------- */
  const tiltCards = document.querySelectorAll('.solution-card, .why-card');

  tiltCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform =
        'translateY(-6px) perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });


  /* ----------------------------------------------------------
     Portal Cards — parallax gradient shift on hover
  ---------------------------------------------------------- */
  const portalCards = document.querySelectorAll('.portal-card');

  portalCards.forEach(function (card) {
    const inner = card.querySelector('.portal-card-inner');
    if (!inner) return;

    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top)  / rect.height) * 100;

      inner.style.backgroundPosition = xPct + '% ' + yPct + '%';
    });

    card.addEventListener('mouseleave', function () {
      inner.style.backgroundPosition = '';
    });
  });


  /* ----------------------------------------------------------
     Float Card — pause animation on hover for readability
  ---------------------------------------------------------- */
  const floatCards = document.querySelectorAll('.float-card');

  floatCards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      card.style.animationPlayState = 'paused';
    });
    card.addEventListener('mouseleave', function () {
      card.style.animationPlayState = 'running';
    });
  });


  /* ----------------------------------------------------------
     Button ripple effect
  ---------------------------------------------------------- */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top  - size / 2;

      ripple.style.cssText = [
        'position:absolute',
        'border-radius:50%',
        'background:rgba(255,255,255,0.25)',
        'width:' + size + 'px',
        'height:' + size + 'px',
        'left:' + x + 'px',
        'top:' + y + 'px',
        'transform:scale(0)',
        'animation:rippleAnim 0.55s linear',
        'pointer-events:none',
      ].join(';');

      // Ensure btn has overflow:hidden for ripple
      const prevPosition = window.getComputedStyle(btn).position;
      if (prevPosition === 'static') btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);

      ripple.addEventListener('animationend', function () {
        ripple.remove();
      });
    });
  });

  // Inject ripple keyframe once
  if (!document.getElementById('rippleStyle')) {
    const styleTag = document.createElement('style');
    styleTag.id = 'rippleStyle';
    styleTag.textContent =
      '@keyframes rippleAnim { to { transform: scale(3); opacity: 0; } }';
    document.head.appendChild(styleTag);
  }


  /* ----------------------------------------------------------
     Navbar CTA — add scrolled class immediately once
     so CTA button is always visible after nav becomes solid
  ---------------------------------------------------------- */
  window.addEventListener('load', function () {
    handleNavbarScroll();
    setActiveNavLink();
  });

})();
