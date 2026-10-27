const faqButtons = document.querySelectorAll(".faq-question");

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const answer = document.getElementById(button.getAttribute("aria-controls"));
    button.setAttribute("aria-expanded", String(!isExpanded));
    button.closest(".faq-item").classList.toggle("is-open", !isExpanded);
    answer.hidden = isExpanded;
  });
});

const billingOptions = document.querySelectorAll(".billing-option");
const prices = document.querySelectorAll(".plan-price strong");
const priceNote = document.getElementById("price-note");

billingOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const period = option.dataset.period;

    billingOptions.forEach((item) => {
      const isActive = item === option;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    prices.forEach((price) => {
      price.textContent = price.dataset[period];
    });

    priceNote.textContent = period === "yearly"
      ? "Illustrative monthly equivalent when paid yearly. Ask in store for current availability and pricing."
      : "Example monthly estimates. Ask in store for current availability and pricing.";
  });
});

document.querySelectorAll("[data-plan]").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("plan").value = link.dataset.plan;
  });
});

const signupForm = document.getElementById("signup-form");
const formMessage = document.getElementById("form-message");

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!signupForm.reportValidity()) {
    return;
  }

  formMessage.textContent = "Thanks! This demo form is ready, but it does not send enquiries yet.";
  signupForm.reset();
  formMessage.focus();
});

document.getElementById("current-year").textContent = String(new Date().getFullYear());
