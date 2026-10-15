import '../../../comum/toast.js';

const head = document.querySelector('[data-head]');
const toggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('#menu-principal');
const wide = window.matchMedia('(min-width: 901px)');

const setOpen = (open) => {
  toggle.setAttribute('aria-expanded', String(open));
  head.classList.toggle('is-open', open);
};

toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

menu.addEventListener('click', (event) => {
  if (event.target.closest('a')) setOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || toggle.getAttribute('aria-expanded') !== 'true') return;
  setOpen(false);
  toggle.focus();
});

wide.addEventListener('change', (event) => {
  if (event.matches) setOpen(false);
});
