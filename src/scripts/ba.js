/** Wire up every [data-ba] slider under root (safe to call repeatedly). */
export function initBA(root) {
  root.querySelectorAll('[data-ba]').forEach((fig) => {
    if (fig.dataset.baReady) return;
    fig.dataset.baReady = '1';
    const range = fig.querySelector('.ba__range');
    const set = (v) => fig.style.setProperty('--pos', `${v}%`);
    range.addEventListener('input', () => set(range.value));
    set(range.value);
  });
}
