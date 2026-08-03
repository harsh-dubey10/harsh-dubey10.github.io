// =========================================================
// CONFIG — edit these to personalize quickly
// =========================================================
const CLASSES = [
  "AI/ML Engineer",
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
// Init
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  rotateClasses(document.getElementById("classText"));
  runFooterLine();
  initScrollReveal();
  initMobileMenu();
});
