
//  directory

const btnGrid          = document.getElementById('btn-grid');
const btnList          = document.getElementById('btn-list');
const membersContainer = document.getElementById('members-container');

const svgPin   = `<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>`;
const svgPhone = `<svg viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/></svg>`;
const svgLink  = `<svg viewBox="0 0 24 24"><path d="M11 17H7a5 5 0 0 1 0-10h4v2H7a3 3 0 0 0 0 6h4v2zm2-3v-2H9v2h4zm1 3v-2h4a3 3 0 0 0 0-6h-4V7h4a5 5 0 0 1 0 10h-4z"/></svg>`;


let currentView = localStorage.getItem('chamberView') || 'grid';

function setView(view) {
  currentView = view;
  localStorage.setItem('chamberView', view);
  membersContainer.className = view;
  btnGrid.classList.toggle('active', view === 'grid');
  btnList.classList.toggle('active', view === 'list');
  if (window.membersData) renderMembers(window.membersData);
}

btnGrid.addEventListener('click', () => setView('grid'));
btnList.addEventListener('click', () => setView('list'));


function cardImageHTML(member) {
  const initials = member.name.split(' ').map(w => w[0]).slice(0, 2).join('');
  return `
    <div class="card-img-wrap">
      <img src="images/${member.image}" alt="${member.name}" loading="lazy"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"/>
      <div class="img-fallback" style="display:none;">${initials}</div>
    </div>`;
}

function renderGrid(members) {
  return members.map(m => `
    <article class="member-card">
      ${cardImageHTML(m)}
      <div class="card-body">
        <div class="card-header">
          <h2 class="card-name">${m.name}</h2>
        </div>
        <p class="card-detail">${svgPin}<span>${m.address}</span></p>
        <p class="card-detail">${svgPhone}<span>${m.phone}</span></p>
        <div class="card-link">
          <a href="${m.website}" target="_blank" rel="noopener noreferrer">
            ${svgLink} Visit website
          </a>
        </div>
      </div>
    </article>`
  ).join('');
}

function renderList(members) {
  return members.map(m => `
    <div class="member-row">
      <span class="row-name">${m.name}</span>
      <span class="row-info">${m.address}</span>
      <span class="row-info">${m.phone}</span>
      <span class="row-link">
        <a href="${m.website}" target="_blank" rel="noopener noreferrer">
          ${m.website.replace('https://', '')}
        </a>
      </span>
    </div>`
  ).join('');
}

function renderMembers(members) {
  membersContainer.innerHTML = currentView === 'grid'
    ? renderGrid(members)
    : renderList(members);
}

// data fetch

async function loadMembers() {
  membersContainer.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading members…</p>
    </div>`;

  try {
    const response = await fetch('data/members.json');

    if (!response.ok) {
      throw new Error(`Server answered with status: ${response.status}`);
    }

    const data = await response.json();
    window.membersData = data.members;
    renderMembers(data.members);

  } catch (error) {
    membersContainer.innerHTML = `<p class="loading" style="color:var(--clr-primary);">Could not load member data.</p>`;
    console.error('Caught an error successfully:', error.message);
  }
}


setView(currentView);
loadMembers();
