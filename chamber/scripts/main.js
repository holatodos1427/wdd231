

const menuToggle = document.getElementById('menu-toggle');
const mainNav    = document.getElementById('main-nav');
const yearEl     = document.getElementById('current-year');
const dateEl     = document.getElementById('last-modified');


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



const today = new Date();

yearEl.textContent = today.getFullYear();
dateEl.textContent = today.toLocaleDateString('en-US', {
  year:  'numeric',
  month: 'long',
  day:   'numeric',
});
