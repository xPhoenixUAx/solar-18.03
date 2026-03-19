export function initHomePage() {
  initParallaxBanner();
  initHomeServicesCarousel();

  const form = document.querySelector("#home-compare-form");
  const select = document.querySelector("#home-service-select");
  const chips = document.querySelectorAll("[data-home-service]");
  const status = document.querySelector("[data-home-status]");

  if (select && chips.length) {
    const syncChips = (value) => {
      chips.forEach((chip) => {
        chip.classList.toggle("is-active", chip.dataset.homeService === value);
      });
      if (status) {
        status.textContent = `Currently focused on: ${value}.`;
      }
    };

    syncChips(select.value);

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        select.value = chip.dataset.homeService;
        syncChips(select.value);
      });
    });

    select.addEventListener("change", () => {
      syncChips(select.value);
    });
  }

  if (!form || !status || !select) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const zip = form.querySelector("#home-zip")?.value.trim() || "your ZIP code";
    status.textContent = `Ready to compare ${select.value.toLowerCase()} options around ${zip}. Connect your quote flow or form handler to send this request live.`;
  });
}

function initParallaxBanner() {
  const section = document.querySelector("[data-parallax-section]");
  const bgLayer = document.querySelector("[data-parallax-bg]");
  const shadeLayer = document.querySelector("[data-parallax-shade]");
  const glowLayer = document.querySelector("[data-parallax-glow]");
  const gridLayer = document.querySelector("[data-parallax-grid]");

  if (!section || !bgLayer || !shadeLayer || !glowLayer || !gridLayer) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let ticking = false;

  const updateParallax = () => {
    ticking = false;

    if (window.innerWidth <= 720) {
      bgLayer.style.setProperty("--parallax-bg-offset", "0px");
      shadeLayer.style.setProperty("--parallax-shade-offset", "0px");
      glowLayer.style.setProperty("--parallax-glow-offset", "0px");
      gridLayer.style.setProperty("--parallax-grid-offset", "0px");
      return;
    }

    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    const progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
    const motionFactor = prefersReducedMotion.matches ? 0.35 : 1;
    const bgOffset = Math.max(-220, Math.min(220, progress * -196 * motionFactor));
    const shadeOffset = Math.max(-84, Math.min(84, progress * -68 * motionFactor));
    const glowOffset = Math.max(-260, Math.min(260, progress * -228 * motionFactor));
    const gridOffset = Math.max(-130, Math.min(130, progress * -112 * motionFactor));

    bgLayer.style.setProperty("--parallax-bg-offset", `${bgOffset}px`);
    shadeLayer.style.setProperty("--parallax-shade-offset", `${shadeOffset}px`);
    glowLayer.style.setProperty("--parallax-glow-offset", `${glowOffset}px`);
    gridLayer.style.setProperty("--parallax-grid-offset", `${gridOffset}px`);
  };

  const requestTick = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(updateParallax);
  };

  updateParallax();
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);
  prefersReducedMotion.addEventListener("change", requestTick);
}

function initHomeServicesCarousel() {
  const carousel = document.querySelector("[data-services-carousel]");
  const viewport = document.querySelector("[data-services-viewport]") || carousel?.querySelector(".home-services__viewport");
  const track = document.querySelector("[data-services-track]");
  const dots = document.querySelector("[data-services-dots]");
  const prevButton = document.querySelector("[data-services-prev]");
  const nextButton = document.querySelector("[data-services-next]");

  if (!carousel || !viewport || !track || !dots || !prevButton || !nextButton) {
    return;
  }

  const cards = Array.from(track.children);
  let currentPage = 0;
  let pagesCount = 1;
  let perView = 3;
  let currentOffset = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragDeltaX = 0;
  let dragPointerId = null;

  const getPerView = () => {
    if (window.innerWidth <= 720) {
      return 1;
    }

    if (window.innerWidth <= 960) {
      return 2;
    }

    return 3;
  };

  const renderDots = () => {
    dots.innerHTML = "";

    for (let index = 0; index < pagesCount; index += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = index === currentPage ? "is-active" : "";
      button.setAttribute("aria-label", `Go to services page ${index + 1}`);
      button.setAttribute("aria-pressed", index === currentPage ? "true" : "false");
      button.addEventListener("click", () => {
        currentPage = index;
        updateCarousel();
      });
      dots.append(button);
    }
  };

  const updateButtons = () => {
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage >= pagesCount - 1;
  };

  const updateTrackPosition = () => {
    const startIndex = currentPage * perView;
    const targetCard = cards[startIndex];
    currentOffset = targetCard ? targetCard.offsetLeft : 0;
    track.style.transform = `translate3d(${-currentOffset}px, 0, 0)`;
  };

  const updateCarousel = () => {
    perView = getPerView();
    pagesCount = Math.max(1, Math.ceil(cards.length / perView));
    currentPage = Math.min(currentPage, pagesCount - 1);
    renderDots();
    updateButtons();
    updateTrackPosition();
  };

  prevButton.addEventListener("click", () => {
    currentPage = Math.max(0, currentPage - 1);
    updateCarousel();
  });

  nextButton.addEventListener("click", () => {
    currentPage = Math.min(pagesCount - 1, currentPage + 1);
    updateCarousel();
  });

  const endDrag = (applySwipe = true) => {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    dragPointerId = null;
    track.classList.remove("is-dragging");

    if (applySwipe && window.innerWidth <= 720) {
      const threshold = Math.min(110, viewport.clientWidth * 0.18);
      if (dragDeltaX <= -threshold && currentPage < pagesCount - 1) {
        currentPage += 1;
      } else if (dragDeltaX >= threshold && currentPage > 0) {
        currentPage -= 1;
      }
    }

    dragDeltaX = 0;
    updateCarousel();
  };

  viewport.addEventListener("pointerdown", (event) => {
    if (window.innerWidth > 720 || event.pointerType === "mouse") {
      return;
    }

    isDragging = true;
    dragPointerId = event.pointerId;
    dragStartX = event.clientX;
    dragDeltaX = 0;
    track.classList.add("is-dragging");
    viewport.setPointerCapture?.(event.pointerId);
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!isDragging || event.pointerId !== dragPointerId) {
      return;
    }

    dragDeltaX = event.clientX - dragStartX;
    track.style.transform = `translate3d(${-(currentOffset - dragDeltaX)}px, 0, 0)`;
  });

  viewport.addEventListener("pointerup", (event) => {
    if (event.pointerId !== dragPointerId) {
      return;
    }

    endDrag(true);
  });

  viewport.addEventListener("pointercancel", () => {
    endDrag(false);
  });

  viewport.addEventListener("lostpointercapture", () => {
    endDrag(true);
  });

  window.addEventListener("resize", updateCarousel);
  updateCarousel();
}
