import { html } from '../../../comum/html.js';
import { showToast } from '../../../comum/toast.js';
import { busy } from './data.js';
import { money, estimate, formatDuration, isAvailable, takenHours, missingFields, listInPortuguese, bookingSummary, hoursHint } from './rules.js';

const calc = document.querySelector('#calc');
const form = document.querySelector('#booking');
const dayButtons = [...document.querySelectorAll('#days [data-day]')];
const hourButtons = [...document.querySelectorAll('#hours [data-hour]')];
const hint = document.querySelector('#hours-hint');
const error = document.querySelector('#book-error');
const confirmation = document.querySelector('#confirm');
const allHours = hourButtons.map((button) => button.dataset.hour);

const itemOf = (input) => ({ label: input.dataset.label, price: Number(input.dataset.price), minutes: Number(input.dataset.minutes) });

const currentBath = () => {
  const size = itemOf(calc.querySelector('[name=size]:checked'));
  const extras = [...calc.querySelectorAll('[name=extra]:checked')].map(itemOf);
  return { items: [size, ...extras], result: estimate(size, extras) };
};

const renderCalc = () => {
  const { items, result } = currentBath();
  document.querySelector('#calc-total').textContent = money(result.price);
  document.querySelector('#calc-time').textContent = `Tempo aproximado: ${formatDuration(result.minutes)}`;
  document.querySelector('#calc-list').innerHTML = html`${items.map(
    (item) => html`<li><span>${item.label}</span><em>${money(item.price)}</em></li>`,
  )}`;
};

const selection = { day: '', hour: '' };

const press = (buttons, active) => buttons.forEach((button) => button.setAttribute('aria-pressed', String(button === active)));

const syncHours = () => {
  const taken = takenHours(busy, selection.day);
  hourButtons.forEach((button) => {
    const hour = button.dataset.hour;
    const isTaken = taken.includes(hour);
    button.disabled = !isAvailable(busy, selection.day, hour);
    button.classList.toggle('is-taken', isTaken);
    button.querySelector('.tm-slot').textContent = !selection.day ? '' : isTaken ? 'ocupado' : 'livre';
  });
  if (selection.hour && !isAvailable(busy, selection.day, selection.hour)) {
    selection.hour = '';
    press(hourButtons, null);
  }
  hint.textContent = hoursHint(busy, selection.day, allHours);
};

const markInvalid = (field, invalid) => {
  if (invalid) field.setAttribute('aria-invalid', 'true');
  else field.removeAttribute('aria-invalid');
};

calc.addEventListener('change', renderCalc);

document.querySelector('#calc-book').addEventListener('click', () => {
  form.elements.service.value = 'Banho e tosa';
});

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

[form.elements.tutor, form.elements.pet].forEach((field) =>
  field.addEventListener('input', () => {
    if (field.value.trim()) markInvalid(field, false);
  }),
);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const tutor = form.elements.tutor.value;
  const pet = form.elements.pet.value;
  const service = form.elements.service.value;
  const missing = missingFields({ tutor, pet, ...selection });
  markInvalid(form.elements.tutor, !tutor.trim());
  markInvalid(form.elements.pet, !pet.trim());
  if (missing.length) {
    error.textContent = `Falta informar ${listInPortuguese(missing)}.`;
    error.hidden = false;
    if (!tutor.trim()) form.elements.tutor.focus();
    else if (!pet.trim()) form.elements.pet.focus();
    else if (!selection.day) dayButtons[0].focus();
    else hourButtons.find((button) => !button.disabled)?.focus();
    return;
  }
  error.hidden = true;
  const summary = bookingSummary({ tutor, pet, service, ...selection }, currentBath().result);
  document.querySelector('#confirm-text').textContent = `${summary} Nada foi enviado.`;
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
  error.hidden = true;
  confirmation.hidden = true;
  form.hidden = false;
  form.elements.tutor.focus();
});

renderCalc();
syncHours();
