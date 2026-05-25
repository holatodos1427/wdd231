
// home page
// main.js nav and footer

// Configuration 

const LAT         = -16.4090;
const LON         = -71.5375;
const OWM_KEY     = '48f01f5bb6f3515d9a36e6299f466662';
const MEMBERS_URL = 'data/members.json';

// DOM References

const weatherNowEl = document.getElementById('weather-now');
const forecastEl   = document.getElementById('weather-forecast');
const spotlightsEl = document.getElementById('spotlights-container');

// helpers 

const dayName  = dt   => new Date(dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
const iconUrl  = code => `https://openweathermap.org/img/wn/${code}@2x.png`;
const initials = name => name.split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

function pickRandom(arr, n) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

// weather

async function loadWeather() {
  try {
    // actual conditions
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${OWM_KEY}&units=metric`
    );

    if (!currentResponse.ok) {
      throw new Error(`Server answered with status: ${currentResponse.status}`);
    }

    const w    = await currentResponse.json();
    const wind = Math.round(w.wind.speed * 3.6);

    weatherNowEl.innerHTML = `
      <div class="weather-current">
        <img class="weather-icon" src="${iconUrl(w.weather[0].icon)}" alt="${w.weather[0].description}" />
        <div class="weather-info">
          <p class="weather-temp">${Math.round(w.main.temp)}°C</p>
          <p class="weather-desc">${w.weather[0].description}</p>
        </div>
      </div>
      <p class="weather-meta">
        Feels like ${Math.round(w.main.feels_like)}°C · Humidity ${w.main.humidity}% · Wind ${wind} km/h
      </p>`;

    // 3days forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${OWM_KEY}&units=metric&cnt=40`
    );

    if (!forecastResponse.ok) {
      throw new Error(`Server answered with status: ${forecastResponse.status}`);
    }

    const forecastData = await forecastResponse.json();

    // it will keep the reading closest to noon for each upcoming day, skip today
    const today    = new Date().toDateString();
    const dailyMap = new Map();

    for (const item of forecastData.list) {
      const date = new Date(item.dt * 1000);
      const key  = date.toDateString();
      if (key === today) continue;
      if (!dailyMap.has(key) ||
          Math.abs(date.getHours() - 12) < Math.abs(new Date(dailyMap.get(key).dt * 1000).getHours() - 12)) {
        dailyMap.set(key, item);
      }
    }

    forecastEl.innerHTML = [...dailyMap.values()].slice(0, 3).map(item => `
      <div class="forecast-day">
        <span class="forecast-name">${dayName(item.dt)}</span>
        <img class="forecast-icon" src="${iconUrl(item.weather[0].icon)}" alt="${item.weather[0].description}" />
        <span class="forecast-temp">${Math.round(item.main.temp)}°C</span>
      </div>`).join('');

  } catch (error) {
    console.error('Caught an error successfully:', error.message);
    weatherNowEl.innerHTML = `<p class="weather-desc">Weather unavailable — try again later.</p>`;
  }
}

// member spotlights 

async function loadSpotlights() {
  try {
    const response = await fetch(MEMBERS_URL);

    if (!response.ok) {
      throw new Error(`Server answered with status: ${response.status}`);
    }

    const data    = await response.json();
    const members = data.members;

    if (!members?.length) {
      spotlightsEl.innerHTML = `<p class="loading">No members available.</p>`;
      return;
    }

    // this pick 3 random members and reshuffles on every page load
    spotlightsEl.innerHTML = pickRandom(members, Math.min(3, members.length)).map(m => `
      <article class="spotlight-card" aria-label="${m.name} spotlight">
        ${m.image
          ? `<img class="spotlight-logo" src="images/${m.image}" alt="${m.name} logo" loading="lazy"
                   onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'spotlight-logo-fallback',textContent:'${initials(m.name)}'}))"/>`
          : `<div class="spotlight-logo-fallback">${initials(m.name)}</div>`}
        <h3 class="spotlight-name">${m.name}</h3>
        <p class="spotlight-detail">📞 ${m.phone}<br>📍 ${m.address}</p>
        <p class="spotlight-desc">${m.description}</p>
        <a class="spotlight-website" href="${m.website}" target="_blank" rel="noopener noreferrer">
          Visit Website ↗
        </a>
      </article>`).join('');

  } catch (error) {
    console.error('Caught an error successfully:', error.message);
    spotlightsEl.innerHTML = `<p class="loading">Spotlights unavailable — please refresh.</p>`;
  }
}

// initialization

loadWeather();
loadSpotlights();
