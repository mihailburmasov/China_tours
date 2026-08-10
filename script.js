const toggle = document.querySelector('.menu-btn');
const panel = document.querySelector('.side-panel');
const overlay = document.querySelector('.overlay');
const closeBtn = document.querySelector('.side-panel__close');

function setMenuState(isOpen) {
  panel?.classList.toggle('open', isOpen);
  overlay?.classList.toggle('open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
  toggle?.setAttribute('aria-expanded', String(isOpen));
}

toggle?.addEventListener('click', () => {
  setMenuState(true);
});

closeBtn?.addEventListener('click', () => {
  setMenuState(false);
});

overlay?.addEventListener('click', () => {
  setMenuState(false);
});

document.querySelectorAll('.side-panel a').forEach((link) => {
  link.addEventListener('click', () => setMenuState(false));
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

const parallaxItems = document.querySelectorAll('[data-parallax]');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallax || 0.08);
    item.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
  });
});
