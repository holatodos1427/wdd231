const header = document.getElementById('site-header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const footerYear = document.getElementById('footer-year');
const revealEls = document.querySelectorAll('.reveal');
const statNums = document.querySelectorAll('.stat-number[data-target]');

if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

function handleHeaderScroll() {
  if (window.scrollY > 20) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleHeaderScroll, { passive: true });
handleHeaderScroll();

function openNav() {
  navMenu?.classList.add('is-open');
  navToggle?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  navMenu?.classList.remove('is-open');
  navToggle?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  if (isOpen) {
    closeNav();
  } else {
    openNav();
  }
});

navMenu?.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', closeNav);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navToggle?.getAttribute('aria-expanded') === 'true') {
    closeNav();
    navToggle.focus();
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach((el) => revealObserver.observe(el));

function animateCounter(el, target, duration = 1800) {
  const start      = performance.now();
  const isLarge    = target >= 1000;
  const suffix     = el.dataset.suffix || '';

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = Math.round(easeOutQuart(progress) * target);

    el.textContent = isLarge
      ? `${value.toLocaleString()}+${suffix}`
      : `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = isLarge
        ? `${target.toLocaleString()}+${suffix}`
        : `${target}${suffix}`;
    }
  }

  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target, 10);
        animateCounter(entry.target, target);
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statNums.forEach((el) => statObserver.observe(el));
