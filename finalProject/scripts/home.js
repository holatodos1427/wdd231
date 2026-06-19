

import {
  fetchDesserts,
  buildFeaturedCard,
  openDessertModal,
  initModal,
} from './desserts.js';

const featuredGrid = document.getElementById('featured-grid');
const testimonialGrid = document.getElementById('testimonial-grid');

const TESTIMONIALS = [
  {
    name: 'Mariela R.',
    location: 'Arequipa',
    text: 'Crecí comiendo picarones en casa de mi abuela, y estos saben exactamente igual que aquellos recuerdos. La miel de higos de Elena es absolutamente mágica; compré un frasco extra para llevar a casa.',
    stars: 5,
  },
  {
    name: 'Joaquín T.',
    location: 'Lima (visiting)',
    text: 'Un amigo me llevó a un evento temprano un domingo y no tenía idea de lo que esperar. Ahora planifico mis viajes a Arequipa según el horario de Elena en fines de semana. Nada en Lima se acerca.',
    stars: 5,
  },
  {
    name: 'Sandra M.',
    location: 'Arequipa',
    text: 'Pedí el Combo Familiar para el cumpleaños de mi hija. Todo el mundo preguntó de dónde venían los picarones. Elena incluso incluyó una notita escrita a mano. ¡Un detalle muy especial!',
    stars: 5,
  },
];

function renderTestimonials() {
  if (!testimonialGrid) return;

  const html = TESTIMONIALS.map((t) => {
    const stars = '★'.repeat(t.stars) + '☆'.repeat(5 - t.stars);
    const initial = t.name.charAt(0).toUpperCase();

    return `
      <div class="testimonial-card reveal">
        <div class="testimonial-card-stars" aria-label="Rating: ${t.stars} out of 5">${stars}</div>
        <p class="testimonial-card-text">${t.text}</p>
        <div class="testimonial-card-author">
          <div class="testimonial-card-avatar" aria-hidden="true">${initial}</div>
          <div>
            <span class="testimonial-card-name">${t.name}</span>
            <span class="testimonial-card-location">${t.location}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  testimonialGrid.innerHTML = html;

  const newReveals = testimonialGrid.querySelectorAll('.reveal');
  newReveals.forEach((el) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
  });
}

async function renderFeaturedDesserts() {
  if (!featuredGrid) return;

  const desserts = await fetchDesserts();

  if (!desserts.length) {
    featuredGrid.innerHTML = `
      <p style="grid-column: 1/-1; text-align:center; color: var(--color-text-muted); padding: 2rem 0;">
        Unable to load desserts right now. Please try again later.
      </p>
    `;
    return;
  }

  const featured = desserts
    .filter((d) => d.available)
    .filter((d) => d.tags.includes('popular') || d.tags.includes('traditional'))
    .slice(0, 4);

  featuredGrid.innerHTML = featured.map(buildFeaturedCard).join('');

  const cards = featuredGrid.querySelectorAll('.reveal');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(card);
  });

  featuredGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.featured-card');
    if (!card) return;

    const id = parseInt(card.dataset.id, 10);
    const dessert = desserts.find((d) => d.id === id);
    if (dessert) openDessertModal(dessert);
  });

  featuredGrid.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.featured-card');
    if (!card) return;
    e.preventDefault();
    const id = parseInt(card.dataset.id, 10);
    const dessert = desserts.find((d) => d.id === id);
    if (dessert) openDessertModal(dessert);
  });

  featuredGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.featured-card');
    if (!card) return;
    const id = card.dataset.id;
    try {
      localStorage.setItem('gde_last_viewed', JSON.stringify({ id, timestamp: Date.now() }));
    } catch { }
  });
}

initModal();

renderFeaturedDesserts();
renderTestimonials();
