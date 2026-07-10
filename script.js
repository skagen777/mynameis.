document.addEventListener('DOMContentLoaded', () => {
  const touchCapable = window.matchMedia('(hover: none)').matches;
  if (!touchCapable) return;

  const tiles = [...document.querySelectorAll('[data-touch-tile]')];

  tiles.forEach((tile) => {
    tile.addEventListener('click', (event) => {
      if (!tile.classList.contains('touch-preview')) {
        event.preventDefault();
        tiles.forEach((other) => {
          if (other !== tile) other.classList.remove('touch-preview');
        });
        tile.classList.add('touch-preview');
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-touch-tile]')) {
      tiles.forEach((tile) => tile.classList.remove('touch-preview'));
    }
  });
});
