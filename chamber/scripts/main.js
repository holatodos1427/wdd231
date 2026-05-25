// ============================================================
//  main.js  —  Arequipa Chamber of Commerce
//  Shared across all pages: navigation toggle + footer dates
// ============================================================

// ── DOM References ───────────────────────────────────────────

const menuToggle = document.getElementById('menu-toggle');
const mainNav    = document.getElementById('main-nav');
const yearEl     = document.getElementById('current-year');
const dateEl     = document.getElementById('last-modified');

// ── Navigation ───────────────────────────────────────────────

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});

mainNav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

// ── Footer ───────────────────────────────────────────────────

const today = new Date();

yearEl.textContent = today.getFullYear();
dateEl.textContent = today.toLocaleDateString('en-US', {
  year:  'numeric',
  month: 'long',
  day:   'numeric',
});
