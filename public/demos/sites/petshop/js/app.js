import { html } from '../../../comum/html.js';
import { showToast } from '../../../comum/toast.js';
import { busy } from './data.js';
import { money, estimate, formatDuration, isAvailable, takenHours, missingFields, listInPortuguese } from './rules.js';

const calc = document.querySelector('#calc');
const form = document.querySelector('#booking');
const dayButtons = [...document.querySelectorAll('#days [data-day]')];
const hourButtons = [...document.querySelectorAll('#hours [data-hour]')];
const error = document.querySelector('#book-error');
const confirmation = document.querySelector('#confirm');

const itemOf = (input) => ({ label: input.dataset.label, price: Number(input.dataset.price), minutes: Number(input.dataset.minutes) });

const renderCalc = () => {
  const size = itemOf(calc.querySelector('[name=size]:checked'));
  const extras = [...calc.querySelectorAll('[name=extra]:checked')].map(itemOf);
  const result = estimate(size, extras);
  document.querySelector('#calc-total').textContent = money(result.price);
  document.querySelector('#calc-time').textContent = `Tempo aproximado: ${formatDuration(result.minutes)}`;
  document.querySelector('#calc-list').innerHTML = html`${[size, ...extras].map(
    (item) => html`<li><span>${item.label}</span><em>${money(item.price)}</em></li>`,
  )}`;
};

const selection = { day: '', hour: '' };

const press = (buttons, active) => buttons.forEach((button) => button.setAttribute('aria-pressed', String(button === active)));

const syncHours = () => {
  const taken = takenHours(busy, selection.day);
  hourButtons.forEach((button) => {
    const hour = button.dataset.hour;
    button.disabled = !isAvailable(busy, selection.day, hour);
    button.querySelector('.sr-only').textContent = taken.includes(hour) ? ', ocupado' : '';
  });
  if (selection.hour && !isAvailable(busy, selection.day, selection.hour)) {
    selection.hour = '';
    press(hourButtons, null);
  }
};

calc.addEventListener('change', renderCalc);

dayButtons.forEach((button) =>
  button.addEventListener('click', () => {
    selection.day = button.dataset.day;
    press(dayButtons, button);
    syncHours();
  }),
);

hourButtons.forEach((button) =>
  button.addEventListener('click', () => {
    selection.hour = button.dataset.hour;
    press(hourButtons, button);
  }),
);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const tutor = form.elements.tutor.value;
  const pet = form.elements.pet.value;
  const missing = missingFields({ tutor, pet, ...selection });
  if (missing.length) {
    error.textContent = `Falta informar ${listInPortuguese(missing)}.`;
    error.hidden = false;
    if (!tutor.trim()) form.elements.tutor.focus();
    else if (!pet.trim()) form.elements.pet.focus();
    return;
  }
  error.hidden = true;
  document.querySelector('#confirm-text').textContent = `${pet.trim()}, com ${tutor.trim()}: ${form.elements.service.value}, ${selection.day} às ${selection.hour}. Nada foi enviado.`;
  form.hidden = true;
  confirmation.hidden = false;
  confirmation.querySelector('h3').focus();
  showToast('Reserva de demonstração criada. Os dados ficam só no seu navegador.');
});

document.querySelector('#again').addEventListener('click', () => {
  form.reset();
  selection.day = '';
  selection.hour = '';
  press(dayButtons, null);
  press(hourButtons, null);
  syncHours();
  confirmation.hidden = true;
  form.hidden = false;
  form.elements.tutor.focus();
});

renderCalc();
syncHours();
