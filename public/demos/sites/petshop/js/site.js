import '../../../comum/toast.js';

const header = document.querySelector('.tm-top');
const toggle = header.querySelector('.tm-menu');
const nav = header.querySelector('.tm-nav');
const compact = window.matchMedia('(max-width: 880px)');

const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

const setOpen = (open) => {
  toggle.setAttribute('aria-expanded', String(open));
  header.classList.toggle('is-open', open);
};

toggle.addEventListener('click', () => setOpen(!isOpen()));

nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) setOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !isOpen()) return;
  setOpen(false);
  toggle.focus();
});

document.addEventListener('click', (event) => {
  if (isOpen() && !header.contains(event.target)) setOpen(false);
});

compact.addEventListener('change', () => setOpen(false));
