const DATA_URL = 'data/desserts.json';

export async function fetchDesserts() {
  try {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new TypeError('Expected an array of desserts from JSON data');
    }

    return data;
  } catch (error) {
    console.error('[fetchDesserts] Failed to load dessert data:', error);
    return [];
  }
}

export function buildFeaturedCard(dessert) {
  const tagHTML = dessert.tags
    .filter((t) => ['popular', 'seasonal', 'new'].includes(t))
    .map((t) => `<span class="featured-card__badge">${t}</span>`)
    .join('');

  return `
    <article
      class="featured-card reveal reveal--scale"
      role="listitem"
      data-id="${dessert.id}"
      tabindex="0"
      aria-label="View details for ${dessert.name}"
    >
      <div class="featured-card__img-wrap">
        <img
          src="${dessert.image}"
          alt="${dessert.name} — ${dessert.description.slice(0, 80)}…"
          loading="lazy"
          width="400"
          height="300"
        />
        ${tagHTML}
      </div>
      <div class="featured-card__body">
        <h3 class="featured-card__name">${dessert.name}</h3>
        <p class="featured-card__desc">${dessert.description}</p>
        <span class="featured-card__price">S/ ${dessert.price.toFixed(2)}</span>
      </div>
    </article>
  `;
}

export function buildMenuCard(dessert) {
  const tagHTML = dessert.tags
    .map((tag) => {
      const cls = tag === 'popular' ? 'tag--popular'
                : tag === 'seasonal' ? 'tag--seasonal'
                : '';
      return `<span class="tag ${cls}">${tag}</span>`;
    })
    .join('');

  const unavailableHTML = !dessert.available
    ? `<div class="menu-card__unavailable" aria-label="Currently unavailable">Currently Unavailable</div>`
    : '';

  return `
    <article
      class="menu-card reveal reveal--scale"
      role="listitem"
      data-id="${dessert.id}"
      data-category="${dessert.category}"
      tabindex="${dessert.available ? '0' : '-1'}"
      aria-label="${dessert.available ? `View details for ${dessert.name}` : `${dessert.name} — currently unavailable`}"
      ${!dessert.available ? 'aria-disabled="true"' : ''}
    >
      <div class="menu-card__img-wrap">
        <img
          src="${dessert.image}"
          alt="${dessert.name}"
          loading="lazy"
          width="400"
          height="300"
        />
        <div class="menu-card__tags" aria-hidden="true">${tagHTML}</div>
        ${unavailableHTML}
      </div>
      <div class="menu-card__body">
        <span class="menu-card__category">${dessert.category}</span>
        <h3 class="menu-card__name">${dessert.name}</h3>
        <p class="menu-card__desc">${dessert.description}</p>
        <div class="menu-card__footer">
          <span class="menu-card__price">S/ ${dessert.price.toFixed(2)}</span>
          <span class="menu-card__rating" aria-label="Rating: ${dessert.rating} out of 5 (${dessert.reviews} reviews)">
            ${dessert.rating} (${dessert.reviews})
          </span>
        </div>
      </div>
    </article>
  `;
}

export function openDessertModal(dessert) {
  const overlay     = document.getElementById('dessert-modal');
  const img         = document.getElementById('modal-img');
  const category    = document.getElementById('modal-category');
  const title       = document.getElementById('modal-title');
  const desc        = document.getElementById('modal-desc');
  const portion     = document.getElementById('modal-portion');
  const rating      = document.getElementById('modal-rating');
  const ingredients = document.getElementById('modal-ingredients');
  const reviews     = document.getElementById('modal-reviews');
  const price       = document.getElementById('modal-price');

  if (!overlay) return;

  if (img) { img.src = dessert.image; img.alt = dessert.name; }
  if (category) category.textContent = dessert.category;
  if (title) title.textContent = dessert.name;
  if (desc) desc.textContent = dessert.description;
  if (portion) portion.textContent = dessert.portion;
  if (rating) rating.textContent = `★ ${dessert.rating} / 5`;
  if (ingredients) ingredients.textContent = dessert.ingredients.join(', ');
  if (reviews) reviews.textContent = `${dessert.reviews} reviews`;
  if (price) price.textContent = `S/ ${dessert.price.toFixed(2)}`;

  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('modal-close');
  closeBtn?.focus();
}

export function closeDessertModal() {
  const overlay = document.getElementById('dessert-modal');
  if (!overlay) return;

  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

export function initModal(onClose) {
  const overlay  = document.getElementById('dessert-modal');
  const closeBtn = document.getElementById('modal-close');
  const closeBtnAlt = document.getElementById('modal-close-btn');

  function close() {
    closeDessertModal();
    onClose?.();
  }

  closeBtn?.addEventListener('click', close);
  closeBtnAlt?.addEventListener('click', close);

  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay?.classList.contains('is-open')) close();
  });
}
