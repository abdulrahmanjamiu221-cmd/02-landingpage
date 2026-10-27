/**
 * Opens or closes the mobile navigation and supports link selection and Escape.
 */
const initMobileMenu = () => {
  const menuToggle = document.querySelector(".site-header__menu-toggle");
  const navigation = document.querySelector(".site-header__nav");

  if (!menuToggle || !navigation) {
    return;
  }

  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navigation.classList.remove("site-header__nav--open");
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
    navigation.classList.toggle("site-header__nav--open", !isExpanded);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuToggle.focus();
    }
  });
};

/**
 * Animates FAQ panels and keeps only one answer expanded at a time.
 */
const initAccordion = () => {
  const faqButtons = document.querySelectorAll(".faq__question");

  const setPanelExpanded = (button, panel, isExpanded) => {
    button.setAttribute("aria-expanded", String(isExpanded));
    button.closest(".faq__item").classList.toggle("faq__item--open", isExpanded);

    if (isExpanded) {
      panel.hidden = false;
      panel.classList.remove("faq__answer--open");
      void panel.offsetHeight;
      panel.classList.add("faq__answer--open");
      return;
    }

    if (panel.hidden) {
      return;
    }

    panel.addEventListener("transitionend", (event) => {
      if (event.target === panel && !panel.classList.contains("faq__answer--open")) {
        panel.hidden = true;
      }
    }, { once: true });
    panel.classList.remove("faq__answer--open");
  };

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      faqButtons.forEach((otherButton) => {
        if (otherButton !== button && otherButton.getAttribute("aria-expanded") === "true") {
          const otherPanel = document.getElementById(otherButton.getAttribute("aria-controls"));
          setPanelExpanded(otherButton, otherPanel, false);
        }
      });

      setPanelExpanded(button, panel, !isExpanded);
    });
  });
};

/**
 * Switches displayed prices between monthly and yearly billing.
 */
const initPricingToggle = () => {
  const pricingSwitch = document.querySelector(".pricing__switch");
  const prices = document.querySelectorAll(".pricing-card__price strong");
  const savingsBadge = document.querySelector(".pricing__saving");
  const priceNote = document.querySelector(".pricing__note");

  if (!pricingSwitch) {
    return;
  }

  pricingSwitch.addEventListener("click", () => {
    const isYearly = pricingSwitch.getAttribute("aria-checked") !== "true";
    const period = isYearly ? "yearly" : "monthly";

    pricingSwitch.setAttribute("aria-checked", String(isYearly));
    prices.forEach((price) => {
      price.textContent = price.dataset[period];
    });

    if (savingsBadge) {
      savingsBadge.hidden = !isYearly;
    }

    if (priceNote) {
      priceNote.textContent = isYearly
        ? "Illustrative monthly equivalent when paid yearly. Ask in store for current availability and pricing."
        : "Example monthly estimates. Ask in store for current availability and pricing.";
    }
  });
};

/**
 * Adds a subtle shadow to the sticky header after the page scrolls.
 */
const initHeaderShadow = () => {
  const header = document.querySelector(".site-header");

  if (!header) {
    return;
  }

  const updateHeaderShadow = () => {
    header.classList.toggle("site-header--scrolled", window.scrollY > 10);
  };

  window.addEventListener("scroll", updateHeaderShadow, { passive: true });
  updateHeaderShadow();
};

/**
 * Connects pricing cards to the signup form's plan selection.
 */
const initPlanSelection = () => {
  const planSelect = document.querySelector("#plan");

  if (!planSelect) {
    return;
  }

  document.querySelectorAll("[data-plan]").forEach((link) => {
    link.addEventListener("click", () => {
      planSelect.value = link.dataset.plan;
    });
  });
};

/**
 * Validates the demo signup form and announces its non-sending status.
 */
const initSignupForm = () => {
  const signupForm = document.querySelector("#signup-form");
  const formMessage = document.querySelector("#form-message");

  if (!signupForm || !formMessage) {
    return;
  }

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!signupForm.reportValidity()) {
      return;
    }

    formMessage.textContent = "Thanks! This demo form is ready, but it does not send enquiries yet.";
    signupForm.reset();
    formMessage.focus();
  });
};

/**
 * Sets the footer copyright year from the visitor's current date.
 */
const initFooterYear = () => {
  const year = document.querySelector("#current-year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
};

/**
 * Initializes every page interaction once the document has been parsed.
 */
const init = () => {
  initMobileMenu();
  initAccordion();
  initPricingToggle();
  initHeaderShadow();
  initPlanSelection();
  initSignupForm();
  initFooterYear();
};

document.addEventListener("DOMContentLoaded", init, { once: true });
