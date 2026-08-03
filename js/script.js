// =========================================================
// CONFIG — edit these to personalize quickly
// =========================================================
const CLASSES = [
  "NLP Researcher",
  "Systems Builder",
  "Full-Stack Developer"
];
const FOOTER_LINE = "> thanks for scrolling this far";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// =========================================================
// Typewriter helper
// =========================================================
function typeText(el, text, speed = 45) {
  return new Promise((resolve) => {
    if (prefersReducedMotion) { el.textContent = text; resolve(); return; }
    let i = 0;
    el.textContent = "";
    const timer = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) { clearInterval(timer); resolve(); }
    }, speed);
  });
}

async function eraseText(el, speed = 20) {
  if (prefersReducedMotion) { el.textContent = ""; return; }
  for (let len = el.textContent.length; len >= 0; len--) {
    el.textContent = el.textContent.slice(0, len);
    await new Promise((r) => setTimeout(r, speed));
  }
}

// =========================================================
// Class rotator in the player card
// =========================================================
let classIndex = 0;
function rotateClasses(el) {
  const showNext = async () => {
    const current = CLASSES[classIndex % CLASSES.length];
    if (!prefersReducedMotion) {
      await eraseText(el);
      await typeText(el, current, 40);
    } else {
      el.textContent = current;
    }
    classIndex++;
  };
  showNext();
  if (!prefersReducedMotion) setInterval(showNext, 3000);
}

// =========================================================
// Footer line typewriter
// =========================================================
function runFooterLine() {
  const el = document.getElementById("footerText");
  if (el) typeText(el, FOOTER_LINE, 35);
}

// =========================================================
// Scroll reveal (also triggers stat bar fill)
// =========================================================
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => {
      el.classList.add("is-visible");
      el.querySelectorAll(".bar-fill").forEach((b) => b.classList.add("is-visible"));
    });
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          entry.target.querySelectorAll(".bar-fill").forEach((b) => b.classList.add("is-visible"));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => observer.observe(el));
}

// =========================================================
// Mobile menu
// =========================================================
function initMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobilePills");
  if (!btn || !menu) return;
  btn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    })
  );
}

// =========================================================
// Night sky — generate scattered stars
// =========================================================
function initStars() {
  const container = document.getElementById("journeyStars");
  if (!container) return;
  const count = 70;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.className = "star";
    star.style.top = Math.random() * 100 + "%";
    star.style.left = Math.random() * 100 + "%";
    const size = (Math.random() * 1.6 + 1).toFixed(1);
    star.style.width = size + "px";
    star.style.height = size + "px";
    star.style.animationDelay = (Math.random() * 3.4).toFixed(2) + "s";
    star.style.animationDuration = (2.6 + Math.random() * 2.4).toFixed(2) + "s";
    frag.appendChild(star);
  }
  container.appendChild(frag);
}

// =========================================================
// Trail (journey) click-to-expand waypoints
// =========================================================
function initTrail() {
  const toggles = document.querySelectorAll(".trail-toggle");
  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("aria-controls");
      const detail = document.getElementById(targetId);
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!isOpen));
      if (detail) detail.classList.toggle("is-open", !isOpen);
    });
  });
}

// =========================================================
// Hover-tilt cards
// =========================================================
function initTilt() {
  if (prefersReducedMotion) return;
  const cards = document.querySelectorAll(".tilt");
  const maxTilt = 6;
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - py) * maxTilt * 2;
      card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(700px) rotateX(0) rotateY(0) translateY(0)";
    });
  });
}

// =========================================================
// Stat bar count-up numbers (fires alongside bar-fill reveal)
// =========================================================
function animateCount(el, target, duration = 1100) {
  if (prefersReducedMotion) { el.textContent = target; return; }
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initBarCounters() {
  const bars = document.querySelectorAll(".bar-num");
  if (!bars.length) return;
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    bars.forEach((el) => { el.textContent = el.dataset.target; });
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target, parseInt(entry.target.dataset.target, 10));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  bars.forEach((el) => observer.observe(el));
}

// =========================================================
// Active nav pill highlighting on scroll
// =========================================================
function initActiveNav() {
  const sections = document.querySelectorAll("main section[id]");
  const pills = document.querySelectorAll(".pill");
  if (!sections.length || !pills.length || !("IntersectionObserver" in window)) return;

  const setActive = (id) => {
    pills.forEach((p) => {
      p.classList.toggle("is-active", p.getAttribute("href") === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );
  sections.forEach((s) => observer.observe(s));
}

// =========================================================
// Parallax on hero glow
// =========================================================
function initParallax() {
  if (prefersReducedMotion) return;
  const glow = document.querySelector(".player-card-glow");
  if (!glow) return;
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const offset = Math.min(window.scrollY * 0.15, 80);
      glow.style.transform = `translateY(${offset}px)`;
      ticking = false;
    });
  });
}

// =========================================================
// Init
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  rotateClasses(document.getElementById("classText"));
  runFooterLine();
  initScrollReveal();
  initMobileMenu();
  initStars();
  initTrail();
  initTilt();
  initBarCounters();
  initActiveNav();
  initParallax();
});
