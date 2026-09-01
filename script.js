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

const form = document.getElementById('lead-form');
const formNote = document.getElementById('form-note');
const LEAD_EMAIL = 'Heihetravel@yandex.ru';

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const payload = {
    name: data.get('name') || '',
    phone: data.get('phone') || '',
    dates: data.get('dates') || '',
    message: data.get('message') || '',
    _subject: 'Новая заявка с сайта Heihetravel',
  };

  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;
  if (formNote) formNote.textContent = 'Отправляем заявку…';

  fetch(`https://formsubmit.co/ajax/${LEAD_EMAIL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Request failed');
      if (formNote) {
        formNote.textContent = 'Спасибо! Заявка отправлена, мы свяжемся с вами в ближайшее время.';
      }
      form.reset();
    })
    .catch(() => {
      if (formNote) {
        formNote.innerHTML = `Не удалось отправить заявку автоматически. Напишите нам на <a href="mailto:${LEAD_EMAIL}">${LEAD_EMAIL}</a> или в мессенджер — мы обязательно ответим.`;
      }
    })
    .finally(() => {
      if (submitBtn) submitBtn.disabled = false;
    });
});

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealItems.length) {
  document.documentElement.classList.add('js-anim');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -10% 0px' }
  );

  revealItems.forEach((item) => observer.observe(item));
}

const parallaxItems = document.querySelectorAll('[data-parallax]');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallax || 0.08);
    item.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
  });
});

const galleries = document.querySelectorAll('.photo-gallery');

if (galleries.length) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox__close" type="button" aria-label="Закрыть">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
    </button>
    <button class="lightbox__prev" type="button" aria-label="Предыдущее фото">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
    </button>
    <div class="lightbox__frame">
      <img class="lightbox__img" src="" alt="" />
      <span class="lightbox__counter"></span>
    </div>
    <button class="lightbox__next" type="button" aria-label="Следующее фото">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7" /></svg>
    </button>
  `;
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector('.lightbox__img');
  const lbCounter = lightbox.querySelector('.lightbox__counter');
  const lbPrev = lightbox.querySelector('.lightbox__prev');
  const lbNext = lightbox.querySelector('.lightbox__next');
  const lbClose = lightbox.querySelector('.lightbox__close');

  let activeGroup = [];
  let activeIndex = 0;

  function showSlide(index) {
    activeIndex = (index + activeGroup.length) % activeGroup.length;
    const img = activeGroup[activeIndex];
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCounter.textContent = `${activeIndex + 1} / ${activeGroup.length}`;
    const multiple = activeGroup.length > 1;
    lbPrev.style.display = multiple ? '' : 'none';
    lbNext.style.display = multiple ? '' : 'none';
  }

  function openLightbox(group, index) {
    activeGroup = group;
    showSlide(index);
    lightbox.classList.add('is-open');
    document.body.classList.add('menu-open');
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }

  galleries.forEach((gallery) => {
    const imgs = Array.from(gallery.querySelectorAll('img'));
    imgs.forEach((img, index) => {
      img.addEventListener('click', () => openLightbox(imgs, index));
    });
  });

  lbPrev.addEventListener('click', () => showSlide(activeIndex - 1));
  lbNext.addEventListener('click', () => showSlide(activeIndex + 1));
  lbClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showSlide(activeIndex - 1);
    if (event.key === 'ArrowRight') showSlide(activeIndex + 1);
  });
}
