let state = { items: [], i: 0 };
export function initLightbox() {
  const dlg = document.querySelector('dialog.lb');
  if (!dlg || dlg.dataset.ready) return;
  dlg.dataset.ready = '1';
  const img = dlg.querySelector('img');
  const cap = dlg.querySelector('figcaption');
  const show = () => {
    const a = state.items[state.i];
    img.src = a.getAttribute('href');
    img.alt = a.dataset.alt || '';
    cap.textContent = `${a.dataset.alt || ''}  (${state.i + 1} of ${state.items.length})`;
    const multi = state.items.length > 1;
    dlg.querySelector('.lb__prev').hidden = !multi;
    dlg.querySelector('.lb__next').hidden = !multi;
  };
  const step = (d) => { state.i = (state.i + d + state.items.length) % state.items.length; show(); };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-lightbox]');
    if (!a) return;
    e.preventDefault();
    state.items = [...document.querySelectorAll(`a[data-lightbox="${CSS.escape(a.dataset.lightbox)}"]`)];
    state.i = state.items.indexOf(a);
    show();
    dlg.showModal();
  });
  dlg.querySelector('.lb__close').addEventListener('click', () => dlg.close());
  dlg.querySelector('.lb__prev').addEventListener('click', () => step(-1));
  dlg.querySelector('.lb__next').addEventListener('click', () => step(1));
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
}
