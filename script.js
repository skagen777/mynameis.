document.getElementById('year').textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const productOrder = ['korea', 'seoul', 'seongsu'];
const cards = [...document.querySelectorAll('.product-card')];
const carousel = document.getElementById('productCarousel');
const counter = document.getElementById('currentIndex');
const prevButton = document.querySelector('.gallery-prev');
const nextButton = document.querySelector('.gallery-next');
const detail = document.getElementById('productDetail');
const closeButton = document.querySelector('.detail-close');
const detailPanels = [...document.querySelectorAll('.detail-panel')];

let activeIndex = 0;
let autoTimer = null;
let pointerStartX = null;
let wheelLocked = false;

function circularDistance(index, active) {
  const total = productOrder.length;
  const forward = (index - active + total) % total;
  const backward = (active - index + total) % total;
  if (forward === 0) return 'center';
  if (forward <= backward) return 'right';
  return 'left';
}

function renderCarousel() {
  cards.forEach((card, index) => {
    const position = circularDistance(index, activeIndex);
    card.dataset.position = position;
    card.setAttribute('aria-current', position === 'center' ? 'true' : 'false');
  });
  counter.textContent = String(activeIndex + 1).padStart(2, '0');
}

function goTo(index, userInitiated = true) {
  activeIndex = (index + productOrder.length) % productOrder.length;
  renderCarousel();
  if (userInitiated) restartAutoRotate();
}

function next() {
  goTo(activeIndex + 1);
}

function prev() {
  goTo(activeIndex - 1);
}

function openDetail(product) {
  detailPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.detail === product);
  });
  detail.classList.add('open');
  detail.setAttribute('aria-hidden', 'false');
  document.body.classList.add('detail-open');
  stopAutoRotate();
  detail.scrollTop = 0;
}

function closeDetail() {
  detail.classList.remove('open');
  detail.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('detail-open');
  restartAutoRotate();
}

function startAutoRotate() {
  stopAutoRotate();
  autoTimer = window.setInterval(() => {
    activeIndex = (activeIndex + 1) % productOrder.length;
    renderCarousel();
  }, 4300);
}

function stopAutoRotate() {
  if (autoTimer) window.clearInterval(autoTimer);
  autoTimer = null;
}

function restartAutoRotate() {
  startAutoRotate();
}

cards.forEach((card, index) => {
  card.addEventListener('click', () => {
    if (index !== activeIndex) {
      goTo(index);
      return;
    }
    openDetail(card.dataset.product);
  });
});

prevButton.addEventListener('click', prev);
nextButton.addEventListener('click', next);
closeButton.addEventListener('click', closeDetail);

detail.addEventListener('click', (event) => {
  if (event.target === detail) closeDetail();
});

document.addEventListener('keydown', (event) => {
  if (detail.classList.contains('open')) {
    if (event.key === 'Escape') closeDetail();
    return;
  }
  if (event.key === 'ArrowRight') next();
  if (event.key === 'ArrowLeft') prev();
  if (event.key === 'Enter') openDetail(productOrder[activeIndex]);
});

carousel.addEventListener('wheel', (event) => {
  if (wheelLocked) return;
  if (Math.abs(event.deltaY) < 12 && Math.abs(event.deltaX) < 12) return;
  wheelLocked = true;
  if (event.deltaY > 0 || event.deltaX > 0) next();
  else prev();
  window.setTimeout(() => { wheelLocked = false; }, 650);
}, { passive: true });

carousel.addEventListener('pointerdown', (event) => {
  pointerStartX = event.clientX;
  carousel.setPointerCapture(event.pointerId);
});

carousel.addEventListener('pointerup', (event) => {
  if (pointerStartX === null) return;
  const distance = event.clientX - pointerStartX;
  if (Math.abs(distance) > 45) {
    if (distance < 0) next();
    else prev();
  }
  pointerStartX = null;
});

carousel.addEventListener('mouseenter', stopAutoRotate);
carousel.addEventListener('mouseleave', startAutoRotate);
carousel.addEventListener('focusin', stopAutoRotate);
carousel.addEventListener('focusout', startAutoRotate);

renderCarousel();
startAutoRotate();
