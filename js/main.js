import { initHomePage } from "./home.js";
import { initServicesPage } from "./services.js";
import { initAboutPage } from "./about.js";
import { initContactPage } from "./contact.js";
import { initServicePage } from "./service-page.js";

const pageInitializers = {
  home: initHomePage,
  services: initServicesPage,
  about: initAboutPage,
  contact: initContactPage,
  service: initServicePage
};

document.addEventListener("DOMContentLoaded", () => {
  initSiteHeader();
  initFaqAccordions();
  initCookieBanner();
  initYear();

  const page = document.body.dataset.page;
  if (pageInitializers[page]) {
    pageInitializers[page]();
  }
});

function initSiteHeader() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("#site-navigation");
  const submenuItems = Array.from(document.querySelectorAll(".site-nav__item--has-submenu"));
  const body = document.body;
  let updateHeaderState = () => {};

  const closeSubmenus = () => {
    submenuItems.forEach((item) => {
      item.classList.remove("is-submenu-open");
      item
        .querySelector(".site-nav__submenu-toggle")
        ?.setAttribute("aria-expanded", "false");
    });
  };

  if (header) {
    updateHeaderState = () => {
      if (header.classList.contains("is-menu-open")) {
        header.classList.remove("is-scrolled");
        return;
      }

      header.classList.toggle("is-scrolled", window.scrollY > 20);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
  }

  if (!toggle || !navigation) {
    return;
  }

  const closeMenu = () => {
    navigation.classList.remove("is-open");
    header?.classList.remove("is-menu-open");
    body.classList.remove("has-menu-open");
    toggle.setAttribute("aria-expanded", "false");
    closeSubmenus();
    updateHeaderState();
  };

  const openMenu = () => {
    navigation.classList.add("is-open");
    header?.classList.add("is-menu-open");
    header?.classList.remove("is-scrolled");
    body.classList.add("has-menu-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", () => {
    const isOpen = navigation.classList.contains("is-open");
    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (navigation.classList.contains("is-open")) {
      closeMenu();
      return;
    }

    closeSubmenus();
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 1100) {
        closeMenu();
      }
    });
  });

  submenuItems.forEach((item) => {
    const button = item.querySelector(".site-nav__submenu-toggle");
    if (!button) {
      return;
    }

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const isOpen = item.classList.contains("is-submenu-open");
      closeSubmenus();

      if (!isOpen) {
        item.classList.add("is-submenu-open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    if (!event.target.closest(".site-nav__item--has-submenu")) {
      closeSubmenus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) {
      closeMenu();
      closeSubmenus();
    }
  });

  if (window.innerWidth > 1100) {
    closeMenu();
  }
}

function initFaqAccordions() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const button = item.querySelector("button");
    if (!button) {
      return;
    }

    button.addEventListener("click", () => {
      const isOpen = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
      const icon = button.querySelector("[data-faq-icon]");
      if (icon) {
        icon.textContent = isOpen ? "-" : "+";
      }
    });
  });
}

function initYear() {
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}

function initCookieBanner() {
  const storageKey = "sunmatch_cookie_consent_v1";

  try {
    if (window.localStorage.getItem(storageKey)) {
      return;
    }
  } catch {
    return;
  }

  const banner = document.createElement("section");
  banner.className = "cookie-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", "Cookie consent");
  banner.innerHTML = `
    <div class="cookie-banner__content">
      <div class="cookie-banner__copy">
        <strong>Cookie Notice</strong>
        <p>
          SunMatch uses cookies to support core site functionality and understand platform usage.
          Read our <a href="cookie-policy.html">Cookie Policy</a>.
        </p>
      </div>
      <div class="cookie-banner__actions">
        <button class="btn btn--outline cookie-banner__button" type="button" data-cookie-choice="declined">Decline</button>
        <button class="btn btn--accent cookie-banner__button" type="button" data-cookie-choice="accepted">Accept</button>
      </div>
    </div>
  `;

  const saveChoice = (value) => {
    try {
      window.localStorage.setItem(storageKey, value);
    } catch {
      return;
    }

    banner.classList.add("is-hiding");
    window.setTimeout(() => banner.remove(), 220);
  };

  banner.querySelectorAll("[data-cookie-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      saveChoice(button.getAttribute("data-cookie-choice") || "accepted");
    });
  });

  document.body.appendChild(banner);
}
