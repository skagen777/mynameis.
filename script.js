document.addEventListener('DOMContentLoaded', () => {
  const touchCapable = window.matchMedia('(hover: none)').matches;
  if (!touchCapable) return;

  const tiles = [...document.querySelectorAll('[data-touch-tile]')];
  let previewTimer = null;

  function clearPreview(except = null) {
    tiles.forEach((tile) => {
      if (tile !== except) tile.classList.remove('touch-preview');
    });
  }

  tiles.forEach((tile) => {
    tile.addEventListener('click', (event) => {
      if (!tile.classList.contains('touch-preview')) {
        event.preventDefault();
        clearTimeout(previewTimer);
        clearPreview(tile);
        tile.classList.add('touch-preview');
        previewTimer = window.setTimeout(() => {
          tile.classList.remove('touch-preview');
        }, 4500);
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-touch-tile]')) {
      clearTimeout(previewTimer);
      clearPreview();
    }
  });
});
