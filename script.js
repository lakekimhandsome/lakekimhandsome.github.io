(function () {
  "use strict";

  var header = document.getElementById("header");
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");
  var revealElements = document.querySelectorAll(".reveal");

  function handleScroll() {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  function toggleNav() {
    var isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen);
    navToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
  }

  function closeNav() {
    navLinks.classList.remove("open");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "메뉴 열기");
  }

  function initScrollReveal() {
    if (!("IntersectionObserver" in window)) {
      revealElements.forEach(function (el) {
        el.classList.add("visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  navToggle.addEventListener("click", toggleNav);

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = anchor.getAttribute("href");
      if (targetId === "#") return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      var offset = header.offsetHeight;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  initScrollReveal();
})();
