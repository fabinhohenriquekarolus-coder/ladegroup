import '../../../comum/toast.js';

const head = document.querySelector('.ml-head');
const toggle = document.querySelector('#menu-toggle');
const menu = document.querySelector('#menu');
const wide = window.matchMedia('(min-width: 961px)');

const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

const setMenu = (open) => {
  toggle.setAttribute('aria-expanded', String(open));
  head.classList.toggle('is-open', open);
};

export const closeMenu = () => setMenu(false);

toggle.addEventListener('click', () => setMenu(!isOpen()));

menu.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !isOpen()) return;
  closeMenu();
  toggle.focus();
});

document.addEventListener('click', (event) => {
  if (isOpen() && !head.contains(event.target)) closeMenu();
});

wide.addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});
