
document.addEventListener('DOMContentLoaded', () => {
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
        timer = setTimeout(() => tile.classList.remove('is-preview'), 4000);
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
