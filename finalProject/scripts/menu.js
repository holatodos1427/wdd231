import {
  fetchDesserts,
  buildMenuCard,
  openDessertModal,
  initModal,
} from './desserts.js';

const menuGrid = document.getElementById('menu-grid');
const menuEmpty = document.getElementById('menu-empty');
const itemsCount = document.getElementById('items-count');
const chips = document.querySelectorAll('.chip[data-filter]');

let allDesserts = [];
let activeFilter = 'all';

function getSavedFilter() {
  try {
    return localStorage.getItem('gde_menu_filter') || 'all';
  } catch {
    return 'all';
  }
}

function saveFilter(filter) {
  try {
    localStorage.setItem('gde_menu_filter', filter);
  } catch { }
}

function applyFilter(filter) {
  activeFilter = filter;
  saveFilter(filter);

  const filtered = filter === 'all'
    ? allDesserts
    : allDesserts.filter((d) => d.category === filter);

  if (itemsCount) itemsCount.textContent = filtered.length;
  if (menuEmpty) menuEmpty.hidden = filtered.length > 0;
  if (menuGrid) {
    menuGrid.innerHTML = filtered.map(buildMenuCard).join('');

    const cards = menuGrid.querySelectorAll('.reveal');
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${(i % 3) * 0.08}s`;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 }
      );
      observer.observe(card);
    });
  }

  chips.forEach((chip) => {
    const isActive = chip.dataset.filter === filter;
    chip.classList.toggle('is-active', isActive);
    chip.setAttribute('aria-pressed', String(isActive));
  });
}

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    applyFilter(chip.dataset.filter);
  });
});

menuGrid?.addEventListener('click', (e) => {
  const card = e.target.closest('.menu-card');
  if (!card || card.getAttribute('aria-disabled') === 'true') return;

  const id = parseInt(card.dataset.id, 10);
  const dessert = allDesserts.find((d) => d.id === id);
  if (dessert) {
    openDessertModal(dessert);
    try {
      localStorage.setItem('gde_last_viewed', JSON.stringify({ id, timestamp: Date.now() }));
    } catch { }
  }
});

menuGrid?.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.menu-card');
  if (!card || card.getAttribute('aria-disabled') === 'true') return;
  e.preventDefault();

  const id = parseInt(card.dataset.id, 10);
  const dessert = allDesserts.find((d) => d.id === id);
  if (dessert) openDessertModal(dessert);
});

function applyHashFilter() {
  const hash = window.location.hash.replace('#', '');
  const valid = ['all', 'picarones', 'buñuelos', 'combos', 'extras'];
  if (hash && valid.includes(hash)) {
    applyFilter(hash);
  }
}

async function init() {
  allDesserts = await fetchDesserts();

  if (!allDesserts.length && menuGrid) {
    menuGrid.innerHTML = `
      <p style="grid-column:1/-1; text-align:center; color:var(--color-text-muted); padding:2rem;">
        Unable to load the menu right now. Please try again later.
      </p>
    `;
    return;
  }

  const savedFilter = getSavedFilter();
  applyFilter(savedFilter);
  applyHashFilter();
}

init();
