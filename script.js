(() => {
  "use strict";

  const primaryNumber = "918849383004"; // India country code + primary number
  const alternateNumber = "918734014469";

  // Mobile navigation
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    });
  });

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Accessible reveal-on-scroll animation; graceful fallback if unsupported
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Service cards pre-fill the enquiry form
  document.querySelectorAll(".service-select").forEach(button => {
    button.addEventListener("click", () => {
      const service = document.getElementById("service");
      service.value = button.dataset.service;
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
      window.setTimeout(() => document.getElementById("name").focus({ preventScroll: true }), 550);
    });
  });

  // Back-to-top button
  const backTop = document.getElementById("backTop");
  const updateBackTop = () => backTop.classList.toggle("visible", window.scrollY > 650);
  window.addEventListener("scroll", updateBackTop, { passive: true });
  updateBackTop();
  backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Build a WhatsApp message from the form. No data is saved on this website.
  const form = document.getElementById("bookingForm");
  const formStatus = document.getElementById("formStatus");

  form.addEventListener("submit", event => {
    event.preventDefault();
    formStatus.textContent = "";

    if (!form.reportValidity()) return;

    const customerPhone = document.getElementById("phone").value.trim();
    const digits = customerPhone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) {
      formStatus.textContent = "Please enter a valid phone number.";
      document.getElementById("phone").focus();
      return;
    }

    if (!document.getElementById("consent").checked) {
      formStatus.textContent = "Please confirm before opening WhatsApp.";
      return;
    }

    const details = {
      name: document.getElementById("name").value.trim(),
      phone: customerPhone,
      service: document.getElementById("service").value,
      locality: document.getElementById("locality").value.trim(),
      message: document.getElementById("message").value.trim(),
      language: document.getElementById("language").value
    };

    const message = [
      "Hello Prime AC Solution, I would like to enquire about AC service.",
      "",
      "Name: " + details.name,
      "My phone: " + details.phone,
      "Service: " + details.service,
      "Area: " + details.locality,
      details.message ? "Details: " + details.message : "",
      "Preferred language: " + details.language,
      "",
      "Please let me know the next steps and availability."
    ].filter(Boolean).join("\n");

    // Primary number is used by default. Change to alternateNumber if desired.
    const whatsappURL = "https://wa.me/" + primaryNumber + "?text=" + encodeURIComponent(message);
    formStatus.textContent = "Opening WhatsApp with your draft. Review it and press Send in WhatsApp.";
    const opened = window.open(whatsappURL, "_blank", "noopener,noreferrer");

    // If the browser blocks a new tab, provide a direct link in the status area.
    if (!opened) {
      formStatus.innerHTML = "";
      const fallback = document.createElement("a");
      fallback.href = whatsappURL;
      fallback.target = "_blank";
      fallback.rel = "noopener noreferrer";
      fallback.textContent = "Click here to open your WhatsApp enquiry";
      fallback.className = "text-link";
      formStatus.appendChild(fallback);
    }
  });

  // Keep both contact numbers easy to update in one place.
  const alternateLink = document.querySelector('a[href="tel:+918734014469"]');
  if (alternateLink) alternateLink.href = "tel:+" + alternateNumber;
})();
