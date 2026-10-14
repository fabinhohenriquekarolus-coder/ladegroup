const toast = document.createElement('div');
toast.className = 'demo-toast';
toast.setAttribute('role', 'status');
toast.hidden = true;
document.body.append(toast);

let timer;

const show = (message) => {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(timer);
  timer = setTimeout(() => {
    toast.hidden = true;
  }, 3400);
};

document.addEventListener('demo:toast', (event) => show(event.detail));

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-demo-action]');
  if (!trigger) return;
  event.preventDefault();
  show(trigger.dataset.demoAction);
});
