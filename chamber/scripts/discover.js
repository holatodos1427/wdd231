
import { places } from '../data/discover.mjs';


const placesGrid     = document.getElementById('places-grid');
const visitorBanner  = document.getElementById('visitor-message');
const visitorText    = document.getElementById('visitor-text');
const visitorClose   = document.getElementById('visitor-close');


function buildCard(place) {
  const article = document.createElement('article');
  article.className = 'place-card';

  article.innerHTML = `
    <figure>
      <img
        src="images/${place.image}"
        alt="${place.alt}"
        loading="lazy"
        width="300"
        height="200"
      />
    </figure>
    <div class="place-card-body">
      <h2>${place.name}</h2>
      <address>${place.address}</address>
      <p>${place.description}</p>
      <button class="btn-learn-more" type="button"
              aria-label="Learn more about ${place.name}">
        Learn More
      </button>
    </div>`;

  return article;
}

// this should render all the place cards in the grid
places.forEach(place => {
  placesGrid.appendChild(buildCard(place));
});

//  message using localStorage

const STORAGE_KEY = 'discoverLastVisit';
const now         = Date.now();
const lastVisit   = localStorage.getItem(STORAGE_KEY);

localStorage.setItem(STORAGE_KEY, now);

let message = '';

if (!lastVisit) {
  message = 'Welcome! Let us know if you have any questions.';
} else {
  const msPerDay   = 1000 * 60 * 60 * 24;
  const daysSince  = Math.floor((now - Number(lastVisit)) / msPerDay);

  if (daysSince < 1) {

    message = 'Back so soon! Awesome!';
  } else {
    const dayWord = daysSince === 1 ? 'day' : 'days';
    message = `You last visit was ${daysSince} ${dayWord} ago.`;
  }
}

visitorText.textContent = message;
visitorBanner.hidden    = false;

visitorClose.addEventListener('click', () => {
  visitorBanner.hidden = true;
});