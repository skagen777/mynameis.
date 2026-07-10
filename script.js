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

const cards = Array.from(document.querySelectorAll('.showcase-card'));
const currentLabel = document.getElementById('showcaseCurrent');
const gallery = document.getElementById('showcaseGallery');
const modal = document.getElementById('placeModal');
const modalPlaces = Array.from(document.querySelectorAll('.modal-place'));
const prevButton = document.querySelector('.showcase-prev');
const nextButton = document.querySelector('.showcase-next');

let activeIndex = 0;
let autoRotate = null;
let dragStart = null;
let wheelLock = false;

function renderShowcase() {
  cards.forEach((card, index) => {
    let state = 'next';
    if (index === activeIndex) state = 'active';
    else if (index === (activeIndex - 1 + cards.length) % cards.length) state = 'prev';
    card.dataset.state = state;
    card.setAttribute('aria-current', state === 'active' ? 'true' : 'false');
  });
  currentLabel.textContent = String(activeIndex + 1).padStart(2, '0');
}

function selectIndex(index, restart = true) {
  activeIndex = (index + cards.length) % cards.length;
  renderShowcase();
  if (restart) restartAuto();
}

function showNext() {
  selectIndex(activeIndex + 1);
}

function showPrev() {
  selectIndex(activeIndex - 1);
}

function openModal(product) {
  modalPlaces.forEach((place) => {
    place.classList.toggle('is-active', place.dataset.modalProduct === product);
  });
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  stopAuto();
  const dialog = modal.querySelector('.place-modal-dialog');
  dialog.scrollTop = 0;
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  restartAuto();
}

function stopAuto() {
  if (autoRotate) clearInterval(autoRotate);
  autoRotate = null;
}

function restartAuto() {
  stopAuto();
  autoRotate = setInterval(() => {
    activeIndex = (activeIndex + 1) % cards.length;
    renderShowcase();
  }, 4500);
}

cards.forEach((card, index) => {
  card.addEventListener('click', () => {
    if (index !== activeIndex) {
      selectIndex(index);
      return;
    }
    openModal(card.dataset.product);
  });
});

prevButton.addEventListener('click', showPrev);
nextButton.addEventListener('click', showNext);

document.querySelectorAll('[data-close-modal]').forEach((button) => {
  button.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (event) => {
  if (modal.classList.contains('is-open')) {
    if (event.key === 'Escape') closeModal();
    return;
  }
  if (event.key === 'ArrowLeft') showPrev();
  if (event.key === 'ArrowRight') showNext();
});

gallery.addEventListener('mouseenter', stopAuto);
gallery.addEventListener('mouseleave', restartAuto);

gallery.addEventListener('wheel', (event) => {
  if (wheelLock || Math.abs(event.deltaY) < 16) return;
  wheelLock = true;
  if (event.deltaY > 0) showNext();
  else showPrev();
  setTimeout(() => { wheelLock = false; }, 650);
}, { passive: true });

gallery.addEventListener('pointerdown', (event) => {
  dragStart = event.clientX;
  gallery.setPointerCapture(event.pointerId);
});

gallery.addEventListener('pointerup', (event) => {
  if (dragStart === null) return;
  const distance = event.clientX - dragStart;
  if (Math.abs(distance) > 45) {
    if (distance < 0) showNext();
    else showPrev();
  }
  dragStart = null;
});

renderShowcase();
restartAuto();
