const DATA_URL = 'data/desserts.json';

const overlay      = document.getElementById('dessert-modal');
const modalImg     = document.getElementById('modal-img');
const modalCat     = document.getElementById('modal-category');
const modalTitle   = document.getElementById('modal-title');
const modalDesc    = document.getElementById('modal-desc');
const modalPortion = document.getElementById('modal-portion');
const modalRating  = document.getElementById('modal-rating');
const modalIngr    = document.getElementById('modal-ingredients');
const modalReviews = document.getElementById('modal-reviews');
const modalPrice   = document.getElementById('modal-price');
const closeBtn     = document.getElementById('modal-close');
const closeBtnAlt  = document.getElementById('modal-close-btn');

export async function fetchDesserts() {
  try {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new TypeError('Se esperaba un arreglo de postres del archivo JSON');
    }

    return data;
  } catch (error) {
    console.error('[fetchDesserts] Error al cargar los datos:', error);
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
      aria-label="Ver detalles de ${dessert.name}"
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
    ? `<div class="menu-card__unavailable" aria-label="No disponible actualmente">No Disponible</div>`
    : '';

  return `
    <article
      class="menu-card reveal reveal--scale"
      role="listitem"
      data-id="${dessert.id}"
      data-category="${dessert.category}"
      tabindex="${dessert.available ? '0' : '-1'}"
      aria-label="${dessert.available ? `Ver detalles de ${dessert.name}` : `${dessert.name} — no disponible actualmente`}"
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
          <span class="menu-card__rating" aria-label="Calificación: ${dessert.rating} de 5 (${dessert.reviews} reseñas)">
            ${dessert.rating} (${dessert.reviews})
          </span>
        </div>
      </div>
    </article>
  `;
}

export function openDessertModal(dessert) {
  if (!overlay) return;

  if (modalImg)     { modalImg.src = dessert.image; modalImg.alt = dessert.name; }
  if (modalCat)     modalCat.textContent     = dessert.category;
  if (modalTitle)   modalTitle.textContent   = dessert.name;
  if (modalDesc)    modalDesc.textContent    = dessert.description;
  if (modalPortion) modalPortion.textContent = dessert.portion;
  if (modalRating)  modalRating.textContent  = `★ ${dessert.rating} / 5`;
  if (modalIngr)    modalIngr.textContent    = dessert.ingredients.join(', ');
  if (modalReviews) modalReviews.textContent = `${dessert.reviews} reseñas`;
  if (modalPrice)   modalPrice.textContent   = `S/ ${dessert.price.toFixed(2)}`;

  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  closeBtn?.focus();
}

export function closeDessertModal() {
  if (!overlay) return;

  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

export function initModal(onClose) {
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