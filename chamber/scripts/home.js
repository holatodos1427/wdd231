// ============================================================
//  home.js  —  Arequipa Chamber · Home Page
//  Requires: main.js (nav + footer)
// ============================================================

// ── Configuration ────────────────────────────────────────────

const LAT         = -16.4090;
const LON         = -71.5375;
const OWM_KEY     = '48f01f5bb6f3515d9a36e6299f466662';
const MEMBERS_URL = 'data/members.json';

// ── DOM References ───────────────────────────────────────────

const weatherNowEl  = document.getElementById('weather-now');
const forecastEl    = document.getElementById('weather-forecast');
const spotlightsEl  = document.getElementById('spotlights-container');

// ── Helpers ──────────────────────────────────────────────────

const dayName  = dt   => new Date(dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
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

// ── Weather ──────────────────────────────────────────────────

async function loadWeather() {
  try {
    // Current conditions
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${OWM_KEY}&units=metric`
    );

    if (!currentResponse.ok) {
      throw new Error(`Server answered with status: ${currentResponse.status}`);
    }

    const w    = await currentResponse.json();
    const wind = Math.round(w.wind.speed * 3.6); // m/s → km/h

    // Render current weather matching the wireframe detail list
    weatherNowEl.innerHTML = `
      <div class="weather-current">
        <img class="weather-icon" src="${iconUrl(w.weather[0].icon)}" alt="${w.weather[0].description}" />
        <div>
          <p class="weather-temp">${Math.round(w.main.temp)}°C</p>
          <p class="weather-desc">${w.weather[0].description}</p>
        </div>
      </div>
      <div class="weather-details">
        High: ${Math.round(w.main.temp_max)}°C<br>
        Low: ${Math.round(w.main.temp_min)}°C<br>
        Humidity: ${w.main.humidity}%<br>
        Wind: ${wind} km/h<br>
        Sunrise: ${new Date(w.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}<br>
        Sunset: ${new Date(w.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </div>`;

    // 3-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${OWM_KEY}&units=metric&cnt=40`
    );

    if (!forecastResponse.ok) {
      throw new Error(`Server answered with status: ${forecastResponse.status}`);
    }

    const forecastData = await forecastResponse.json();

    // One reading per day, closest to noon, skip today
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

    // Render forecast as a vertical list like the wireframe
    forecastEl.innerHTML = [...dailyMap.values()].slice(0, 3).map(item => `
      <div class="forecast-row">
        <span class="forecast-row-name">${dayName(item.dt)}:</span>
        <img class="forecast-row-icon" src="${iconUrl(item.weather[0].icon)}" alt="${item.weather[0].description}" />
        <span class="forecast-row-temp">${Math.round(item.main.temp)}°C</span>
      </div>`).join('');

  } catch (error) {
    console.error('Caught an error successfully:', error.message);
    weatherNowEl.innerHTML = `<p class="loading-inline">Weather unavailable — try again later.</p>`;
  }
}

// ── Member Spotlights ─────────────────────────────────────────

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

    // Pick 3 random members, reshuffles on every page load
    spotlightsEl.innerHTML = pickRandom(members, Math.min(3, members.length)).map(m => {
      const logoHtml = m.image
        ? `<img class="spotlight-logo"
                src="images/${m.image}"
                alt="${m.name} logo"
                loading="lazy"
                onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'spotlight-logo-fallback',textContent:'${initials(m.name)}'}))"/>`
        : `<div class="spotlight-logo-fallback">${initials(m.name)}</div>`;

      return `
        <article class="spotlight-card" aria-label="${m.name} spotlight">
          <div class="spotlight-logo-wrap">${logoHtml}</div>
          <div class="spotlight-info">
            <h3 class="spotlight-name">${m.name}</h3>
            <p class="spotlight-tagline">${m.description}</p>
            <p class="spotlight-detail">
              <strong>EMAIL:</strong> info@${m.website.replace('https://www.','').replace('https://','')}<br>
              <strong>PHONE:</strong> ${m.phone}<br>
              <strong>URL:</strong> <a class="spotlight-website" href="${m.website}" target="_blank" rel="noopener noreferrer">${m.website.replace('https://','')}</a>
            </p>
          </div>
        </article>`;
    }).join('');

  } catch (error) {
    console.error('Caught an error successfully:', error.message);
    spotlightsEl.innerHTML = `<p class="loading">Spotlights unavailable — please refresh.</p>`;
  }
}

// ── Init ─────────────────────────────────────────────────────

loadWeather();
loadSpotlights();
