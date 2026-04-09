const body = document.body;
const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primaryNav");
const themeToggle = document.getElementById("themeToggle");
const rtlToggle = document.getElementById("rtlToggle");
const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 8);
};

const closeDropdowns = (except = null) => {
  dropdownToggles.forEach((toggle) => {
    const item = toggle.closest(".has-dropdown");
    if (!item || item === except) return;
    item.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
};

const setTheme = (mode) => {
  if (!themeToggle) return;
  const icon = themeToggle.querySelector("i");
  if (mode === "dark") {
    body.classList.add("dark-mode");
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
    themeToggle.setAttribute("aria-pressed", "true");
  } else {
    body.classList.remove("dark-mode");
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
    themeToggle.setAttribute("aria-pressed", "false");
  }
};

const setRtl = (enabled) => {
  if (!rtlToggle) return;
  body.classList.toggle("rtl", enabled);
  rtlToggle.setAttribute("aria-pressed", enabled ? "true" : "false");
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (navToggle && primaryNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    if (!isOpen) {
      closeDropdowns();
    }
  });
}

dropdownToggles.forEach((toggle) => {
  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    const item = toggle.closest(".has-dropdown");
    if (!item) return;
    const willOpen = !item.classList.contains("open");
    closeDropdowns(item);
    item.classList.toggle("open", willOpen);
    toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });
});

document.addEventListener("click", (event) => {
  const clickedInsideNav = event.target.closest(".nav");
  const clickedHamburger = event.target.closest(".hamburger");
  if (!clickedInsideNav && !clickedHamburger) {
    closeDropdowns();
    body.classList.remove("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
    }
  }
});

const storedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

if (storedTheme) {
  setTheme(storedTheme);
} else {
  setTheme(prefersDark.matches ? "dark" : "light");
}

prefersDark.addEventListener("change", (event) => {
  if (!localStorage.getItem("theme")) {
    setTheme(event.matches ? "dark" : "light");
  }
});

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = body.classList.contains("dark-mode") ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  });
}

const storedRtl = localStorage.getItem("rtl") === "true";
setRtl(storedRtl);

if (rtlToggle) {
  rtlToggle.addEventListener("click", () => {
    const nextRtl = !body.classList.contains("rtl");
    setRtl(nextRtl);
    localStorage.setItem("rtl", nextRtl ? "true" : "false");
  });
}

const passwordToggles = document.querySelectorAll("[data-toggle]");
passwordToggles.forEach((button) => {
  const targetId = button.getAttribute("data-toggle");
  const targetInput = document.getElementById(targetId);
  if (!targetInput) return;
  const icon = button.querySelector("i");
  const label = button.querySelector(".toggle-label");
  button.addEventListener("click", () => {
    const isPassword = targetInput.type === "password";
    targetInput.type = isPassword ? "text" : "password";
    button.setAttribute("aria-pressed", isPassword ? "true" : "false");
    button.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    if (label) {
      label.textContent = isPassword ? "Hide" : "Show";
    }
    if (icon) {
      icon.classList.toggle("fa-eye", !isPassword);
      icon.classList.toggle("fa-eye-slash", isPassword);
    }
  });
});

const markActiveNav = () => {
  const path = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav a");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const cleanHref = href.split("#")[0].split("?")[0];
    if (cleanHref === path) {
      link.classList.add("active");
      const parentDropdown = link.closest(".has-dropdown");
      if (parentDropdown) {
        const toggle = parentDropdown.querySelector(".dropdown-toggle");
        if (toggle) {
          toggle.classList.add("active");
        }
      }
    }
  });
};

markActiveNav();

const parallaxLayers = document.querySelectorAll("[data-parallax]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let parallaxTicking = false;

const revealItems = document.querySelectorAll("[data-reveal]");

const initReveal = () => {
  revealItems.forEach((item) => {
    item.classList.add("reveal");
    const delay = parseInt(item.dataset.delay || "0", 10);
    if (!Number.isNaN(delay) && delay > 0) {
      item.style.transitionDelay = `${delay * 120}ms`;
    }
  });

  if (prefersReducedMotion.matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
};

if (revealItems.length) {
  initReveal();
}

const pricingToggle = document.getElementById("pricingToggle");
const pricingCards = document.querySelectorAll(".pricing-card[data-monthly]");

const updatePricing = () => {
  if (!pricingToggle) return;
  const isYearly = pricingToggle.checked;
  pricingCards.forEach((card) => {
    const amountEl = card.querySelector(".price-amount");
    const cycleEl = card.querySelector(".price-cycle");
    const monthly = card.dataset.monthly;
    const yearly = card.dataset.yearly;
    if (amountEl) {
      amountEl.textContent = isYearly ? yearly : monthly;
    }
    if (cycleEl) {
      cycleEl.textContent = isYearly ? "/yr" : "/mo";
    }
  });
};

if (pricingToggle && pricingCards.length) {
  updatePricing();
  pricingToggle.addEventListener("change", updatePricing);
}

const testimonialCarousel = document.querySelector(".testimonial-carousel");
const testimonialTrack = testimonialCarousel?.querySelector(".testimonial-track");
const testimonialCards = testimonialTrack?.querySelectorAll(".testimonial-card") ?? [];
let testimonialTimer = null;

const startTestimonialAutoScroll = () => {
  if (!testimonialCarousel || !testimonialTrack || testimonialTimer || prefersReducedMotion.matches || testimonialCards.length < 2) return;
  const gapValue = parseFloat(getComputedStyle(testimonialTrack).columnGap || getComputedStyle(testimonialTrack).gap || "0");
  const step = () => {
    const cardWidth = testimonialCards[0].getBoundingClientRect().width;
    const maxScroll = testimonialCarousel.scrollWidth - testimonialCarousel.clientWidth;
    if (maxScroll <= 0) return;
    const nextScroll = testimonialCarousel.scrollLeft + cardWidth + gapValue;
    if (testimonialCarousel.scrollLeft + testimonialCarousel.clientWidth >= testimonialCarousel.scrollWidth - 2) {
      testimonialCarousel.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      testimonialCarousel.scrollTo({ left: nextScroll, behavior: "smooth" });
    }
  };
  testimonialTimer = window.setInterval(step, 5000);
};

const stopTestimonialAutoScroll = () => {
  if (!testimonialTimer) return;
  window.clearInterval(testimonialTimer);
  testimonialTimer = null;
};

if (testimonialCarousel && testimonialCards.length > 1) {
  startTestimonialAutoScroll();
  testimonialCarousel.addEventListener("mouseenter", stopTestimonialAutoScroll);
  testimonialCarousel.addEventListener("mouseleave", startTestimonialAutoScroll);
  testimonialCarousel.addEventListener("focusin", stopTestimonialAutoScroll);
  testimonialCarousel.addEventListener("focusout", startTestimonialAutoScroll);
}

const updateParallax = () => {
  parallaxTicking = false;
  const scrollY = window.scrollY;
  parallaxLayers.forEach((layer) => {
    const speed = parseFloat(layer.dataset.speed || "0.05");
    layer.style.setProperty("--parallax", `${scrollY * speed}px`);
  });
};

const requestParallax = () => {
  if (parallaxTicking) return;
  parallaxTicking = true;
  window.requestAnimationFrame(updateParallax);
};

if (parallaxLayers.length && !prefersReducedMotion.matches) {
  updateParallax();
  window.addEventListener("scroll", requestParallax, { passive: true });
}

prefersReducedMotion.addEventListener("change", (event) => {
  if (event.matches) {
    parallaxLayers.forEach((layer) => layer.style.setProperty("--parallax", "0px"));
    window.removeEventListener("scroll", requestParallax);
    revealItems.forEach((item) => item.classList.add("is-visible"));
    stopTestimonialAutoScroll();
  } else if (parallaxLayers.length) {
    updateParallax();
    window.addEventListener("scroll", requestParallax, { passive: true });
  }

  if (!event.matches && testimonialCarousel && testimonialCards.length > 1) {
    startTestimonialAutoScroll();
  }
});
// reveal animation
const revealElements = document.querySelectorAll('[data-reveal]');

const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.9;

  revealElements.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;

    if (boxTop < triggerBottom) {
      el.classList.add('show');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();
const counters = document.querySelectorAll('.stat-number');

const animateCounters = () => {
  counters.forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-target'));
    let count = 0;

    const increment = target / 100;

    const update = () => {
      count += increment;

      if (count < target) {
        counter.innerText = Math.floor(count);
        requestAnimationFrame(update);
      } else {
        counter.innerText = target;
      }
    };

    update();
  });
};

let triggered = false;
const statsSection = document.querySelector('.stats-section');

if (statsSection) {
  window.addEventListener('scroll', () => {
    const top = statsSection.getBoundingClientRect().top;

    if (!triggered && top < window.innerHeight) {
      animateCounters();
      triggered = true;
    }
  });
}
const cards = document.querySelectorAll('.app-card');

cards.forEach((card, index) => {
  setInterval(() => {
    card.style.transform = `translateY(${Math.sin(Date.now() / 800 + index) * 6}px)`;
  }, 50);
});
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-tab");

    // remove active
    tabButtons.forEach(b => b.classList.remove("active"));
    tabPanels.forEach(p => p.classList.remove("active"));

    // add active
    btn.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});
const filterBtns = document.querySelectorAll(".category-btn");
const articles = document.querySelectorAll(".article-card");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.getAttribute("data-filter");

    // active state
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // filter articles
    articles.forEach(card => {
      const category = card.getAttribute("data-category");

      if (filter === "all" || category === filter) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});
const newsletterForm = document.querySelector(".newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Subscribed successfully!");
  });
}
