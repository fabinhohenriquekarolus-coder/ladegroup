const region = document.createElement('div');
region.className = 'demo-toast';
region.setAttribute('role', 'status');
region.setAttribute('aria-live', 'polite');
document.body.append(region);

let timer;

export const showToast = (message) => {
  region.textContent = message;
  region.classList.add('is-visible');
  clearTimeout(timer);
  timer = setTimeout(() => {
    region.classList.remove('is-visible');
  }, 3600);
};

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-demo-action]');
  if (!trigger) return;
  event.preventDefault();
  showToast(trigger.dataset.demoAction);
});
