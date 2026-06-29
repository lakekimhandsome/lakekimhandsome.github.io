(function () {
  "use strict";

  function initLightbox() {
    var lightbox = document.getElementById("lightbox");
    if (!lightbox) return;

    var lightboxImage = lightbox.querySelector(".lightbox__image");
    var lightboxCaption = lightbox.querySelector(".lightbox__caption");
    var closeBtn = lightbox.querySelector(".lightbox__close");
    var prevBtn = lightbox.querySelector(".lightbox__prev");
    var nextBtn = lightbox.querySelector(".lightbox__next");
    var galleryItems = Array.prototype.slice.call(
      document.querySelectorAll("[data-lightbox-src]")
    );
    var currentIndex = 0;

    function openLightbox(index) {
      if (!galleryItems.length) return;

      currentIndex = index;
      var item = galleryItems[currentIndex];
      var src = item.getAttribute("data-lightbox-src");
      var caption = item.getAttribute("data-lightbox-caption") || "";

      lightboxImage.src = src;
      lightboxImage.alt = caption;
      lightboxCaption.textContent = caption;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");

      prevBtn.disabled = galleryItems.length <= 1;
      nextBtn.disabled = galleryItems.length <= 1;
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
      lightboxImage.removeAttribute("src");
    }

    function showRelative(step) {
      if (galleryItems.length <= 1) return;
      currentIndex = (currentIndex + step + galleryItems.length) % galleryItems.length;
      openLightbox(currentIndex);
    }

    galleryItems.forEach(function (item, index) {
      item.addEventListener("click", function () {
        openLightbox(index);
      });
    });

    closeBtn.addEventListener("click", closeLightbox);

    lightbox.querySelector(".lightbox__backdrop").addEventListener("click", closeLightbox);

    prevBtn.addEventListener("click", function () {
      showRelative(-1);
    });

    nextBtn.addEventListener("click", function () {
      showRelative(1);
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;

      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showRelative(-1);
      if (e.key === "ArrowRight") showRelative(1);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLightbox);
  } else {
    initLightbox();
  }
})();
