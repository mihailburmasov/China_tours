const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const form = document.getElementById('lead-form');
const note = document.getElementById('form-note');

if (form && note) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    note.textContent = 'Спасибо! Мы получили ваш запрос и скоро свяжемся с вами.';
    form.reset();
  });
}
