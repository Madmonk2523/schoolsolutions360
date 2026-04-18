(function () {
  "use strict";

  const navToggle = document.getElementById("navToggle");
  const primaryNav = document.getElementById("primaryNav");
  const yearEl = document.getElementById("year");
  const revealEls = document.querySelectorAll(".reveal");
  const quoteForm = document.querySelector(".quote-form");
  const formNote = document.getElementById("formNote");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = primaryNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    });

    primaryNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth < 860 && primaryNav.classList.contains("open")) {
          primaryNav.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
          document.body.classList.remove("menu-open");
        }
      });
    });

    document.addEventListener("click", function (event) {
      const clickedInsideNav = primaryNav.contains(event.target);
      const clickedToggle = navToggle.contains(event.target);
      if (!clickedInsideNav && !clickedToggle && primaryNav.classList.contains("open")) {
        primaryNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && primaryNav.classList.contains("open")) {
        primaryNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 860) {
        primaryNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      }
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -30px 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  if (quoteForm) {
    quoteForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (formNote) {
        formNote.textContent = "Request received. Thank you. Our team will contact you shortly at the email or phone provided.";
        formNote.classList.add("success");
      }

      quoteForm.reset();
    });
  }
})();
