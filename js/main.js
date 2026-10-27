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
 * Validates the signup form, prevents duplicate emails, and saves enquiries locally.
 */
const initSignupForm = () => {
  const signupForm = document.querySelector("#signup-form");
  const formMessage = document.querySelector("#form-message");

  if (!signupForm || !formMessage) {
    return;
  }

  const fields = [
    { input: signupForm.elements.name, error: document.querySelector("#name-error") },
    { input: signupForm.elements.email, error: document.querySelector("#email-error") },
    { input: signupForm.elements.plan, error: document.querySelector("#plan-error") },
    { input: signupForm.elements.terms, error: document.querySelector("#terms-error") },
  ];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const getFieldError = (field) => {
    const { input } = field;

    if (input.name === "name" && input.value.trim().length < 2) {
      return "Please enter at least 2 characters for your name.";
    }

    if (input.name === "email" && !emailPattern.test(input.value.trim())) {
      return "Please enter a valid email address.";
    }

    if (input.name === "plan" && !input.value) {
      return "Please select a plan.";
    }

    if (input.name === "terms" && !input.checked) {
      return "Please agree before submitting your enquiry.";
    }

    return "";
  };

  const updateFieldError = (field) => {
    const errorMessage = getFieldError(field);
    field.input.setAttribute("aria-invalid", String(Boolean(errorMessage)));
    field.error.textContent = errorMessage;
    return errorMessage;
  };

  const showFormMessage = (message) => {
    formMessage.textContent = message;
    formMessage.focus();
  };

  fields.forEach((field) => {
    const eventName = field.input.type === "checkbox" || field.input.tagName === "SELECT" ? "change" : "input";

    field.input.addEventListener(eventName, () => {
      if (field.input.getAttribute("aria-invalid") === "true") {
        updateFieldError(field);
      }

      formMessage.textContent = "";
    });
  });

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const invalidFields = fields.filter((field) => updateFieldError(field));

    if (invalidFields.length > 0) {
      formMessage.textContent = "";
      invalidFields[0].input.focus();
      return;
    }

    let signups;

    try {
      const savedSignups = localStorage.getItem("signups");
      signups = savedSignups ? JSON.parse(savedSignups) : [];
    } catch {
      showFormMessage("We couldn’t read saved signups in this browser. Please check your browser storage settings and try again.");
      return;
    }

    if (!Array.isArray(signups)) {
      showFormMessage("Saved signup data is in an unexpected format. We couldn’t save your enquiry.");
      return;
    }

    const name = signupForm.elements.name.value.trim();
    const email = signupForm.elements.email.value.trim();
    const plan = signupForm.elements.plan.value;
    const alreadySignedUp = signups.some((signup) =>
      signup && typeof signup.email === "string" && signup.email.toLowerCase() === email.toLowerCase()
    );

    if (alreadySignedUp) {
      showFormMessage("You've already signed up");
      return;
    }

    signups.push({ name, email, plan, createdAt: new Date().toISOString() });

    try {
      localStorage.setItem("signups", JSON.stringify(signups));
    } catch {
      showFormMessage("We couldn’t save your enquiry in this browser. Please check available storage and try again.");
      return;
    }

    signupForm.reset();
    fields.forEach((field) => {
      field.input.removeAttribute("aria-invalid");
      field.error.textContent = "";
    });
    showFormMessage("Thanks! Your enquiry has been saved in this browser. The King Manu team will be in touch.");
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
