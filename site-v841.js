document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const entry = document.getElementById('entryScreen');
  const enter = document.getElementById('enterArchive');

  function revealArchive(){
    if (!entry) return;

    entry.classList.add('is-leaving');
    body.classList.add('archive-entered');
    body.classList.remove('is-locked');

    window.setTimeout(() => {
      entry.classList.add('is-hidden');
    }, 850);
  }

  // Always show the poster whenever index.html is opened or refreshed.
  if (entry && enter){
    entry.classList.remove('is-hidden', 'is-leaving');
    body.classList.remove('archive-entered');
    body.classList.add('is-locked');
    enter.addEventListener('click', revealArchive);
  }

  // Mobile: first tap previews the product, second tap opens detail page.
  const touchMode = window.matchMedia('(hover: none)').matches;
  if (!touchMode) return;

  const tiles = [...document.querySelectorAll('[data-touch-tile]')];
  let timer = null;

  function clearPreview(except = null){
    tiles.forEach(tile => {
      if (tile !== except) tile.classList.remove('is-preview');
    });
  }

  tiles.forEach(tile => {
    tile.addEventListener('click', event => {
      if (!tile.classList.contains('is-preview')){
        event.preventDefault();
        clearTimeout(timer);
        clearPreview(tile);
        tile.classList.add('is-preview');
        timer = window.setTimeout(() => {
          tile.classList.remove('is-preview');
        }, 4200);
      }
    });
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('[data-touch-tile]')){
      clearTimeout(timer);
      clearPreview();
    }
  });
});
