import { busy } from '../../data/demos/tocamansa.js';

const money = (cents) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const toast = (message) => document.dispatchEvent(new CustomEvent('demo:toast', { detail: message }));

const calc = document.querySelector('#calc');
const total = document.querySelector('#calc-total');
const time = document.querySelector('#calc-time');
const list = document.querySelector('#calc-list');

const duration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours ? `${hours} h` : ''}${hours && rest ? ' ' : ''}${rest ? `${rest} min` : ''}`;
};

const renderCalc = () => {
  const size = calc.querySelector('[name=size]:checked');
  const extras = [...calc.querySelectorAll('[name=extra]:checked')];
  const items = [size, ...extras];
  const price = items.reduce((sum, input) => sum + Number(input.dataset.price), 0);
  const minutes = items.reduce((sum, input) => sum + Number(input.dataset.minutes), 0);
  total.textContent = money(price);
  time.textContent = `Tempo aproximado: ${duration(minutes)}`;
  list.innerHTML = items
    .map((input) => `<li><span>${input.dataset.label}</span><em>${money(Number(input.dataset.price))}</em></li>`)
    .join('');
};

calc.addEventListener('change', renderCalc);

const form = document.querySelector('#booking');
const dayButtons = [...document.querySelectorAll('#days [data-day]')];
const hourButtons = [...document.querySelectorAll('#hours [data-hour]')];
const error = document.querySelector('#book-error');
const confirm = document.querySelector('#confirm');
const selection = { day: '', hour: '' };

const press = (buttons, active) => buttons.forEach((button) => button.setAttribute('aria-pressed', String(button === active)));

const syncHours = () => {
  const taken = busy[selection.day] ?? [];
  hourButtons.forEach((button) => {
    button.disabled = !selection.day || taken.includes(button.dataset.hour);
    button.title = taken.includes(button.dataset.hour) ? 'Horário ocupado' : '';
  });
  if (taken.includes(selection.hour)) {
    selection.hour = '';
    press(hourButtons, null);
  }
};

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
  const tutor = form.tutor.value.trim();
  const pet = form.pet.value.trim();
  const problems = [];
  if (!tutor) problems.push('seu nome');
  if (!pet) problems.push('o nome do pet');
  if (!selection.day) problems.push('o dia');
  else if (!selection.hour) problems.push('o horário');
  if (problems.length) {
    error.textContent = `Falta informar ${problems.join(', ')}.`;
    error.hidden = false;
    return;
  }
  error.hidden = true;
  document.querySelector('#confirm-text').textContent = `${pet}, com ${tutor}: ${form.service.value}, ${selection.day} às ${selection.hour}. Nada foi enviado.`;
  form.hidden = true;
  confirm.hidden = false;
  toast('Reserva de demonstração criada. Os dados ficam só no seu navegador.');
});

document.querySelector('#again').addEventListener('click', () => {
  form.reset();
  selection.day = '';
  selection.hour = '';
  press(dayButtons, null);
  press(hourButtons, null);
  syncHours();
  confirm.hidden = true;
  form.hidden = false;
});

renderCalc();
