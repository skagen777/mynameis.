document.addEventListener('DOMContentLoaded', () => {
  const tiles = document.querySelectorAll('.mosaic-tile');

  tiles.forEach((tile) => {
    tile.addEventListener('pointermove', (event) => {
      const rect = tile.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      tile.style.setProperty('--mx', `${x * 4}px`);
      tile.style.setProperty('--my', `${y * 4}px`);
    });

    tile.addEventListener('pointerleave', () => {
      tile.style.removeProperty('--mx');
      tile.style.removeProperty('--my');
    });
  });
});
