import '../../../comum/toast.js';

const menu = document.querySelector('#menu-site');
const wide = window.matchMedia('(min-width: 881px)');

const isOpen = () => menu.matches(':popover-open');

const closeMenu = () => {
  if (isOpen()) menu.hidePopover();
};

menu.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

menu.addEventListener('focusout', (event) => {
  if (isOpen() && event.relatedTarget && !menu.contains(event.relatedTarget)) closeMenu();
});

wide.addEventListener('change', closeMenu);
