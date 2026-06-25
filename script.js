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
  initEmailCopy();

  function initEmailCopy() {
    var copyBtn = document.querySelector(".contact-link--copy");
    if (!copyBtn) return;

    var originalText = copyBtn.textContent;
    var resetTimer;

    function showCopied() {
      copyBtn.textContent = "복사 완료!";
      copyBtn.classList.add("is-copied");
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove("is-copied");
      }, 2000);
    }

    function fallbackCopy(email) {
      var textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();

      try {
        if (document.execCommand("copy")) {
          showCopied();
        }
      } catch (err) {
        /* ignore */
      }

      document.body.removeChild(textarea);
    }

    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email") || originalText.trim();

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showCopied).catch(function () {
          fallbackCopy(email);
        });
        return;
      }

      fallbackCopy(email);
    });
  }
})();
