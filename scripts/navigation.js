
const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('main-nav');

hamburger.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');

  hamburger.setAttribute('aria-expanded', isOpen);
  hamburger.innerHTML = isOpen ? '&#10005;' : '&#9776;';
});

document.addEventListener('click', (event) => {
  const clickedInsideNav    = mainNav.contains(event.target);
  const clickedHamburger    = hamburger.contains(event.target);

  if (!clickedInsideNav && !clickedHamburger && mainNav.classList.contains('open')) {
    mainNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '&#9776;';
  }
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '&#9776;';
  });
});
