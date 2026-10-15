export const setupTabs = (list, onChange) => {
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const select = (tab, focus) => {
    tabs.forEach((other) => {
      const active = other === tab;
      other.setAttribute('aria-selected', String(active));
      other.tabIndex = active ? 0 : -1;
      document.getElementById(other.getAttribute('aria-controls')).hidden = !active;
    });
    if (focus) tab.focus();
    onChange?.(tab);
  };
  tabs.forEach((tab) => tab.addEventListener('click', () => select(tab, false)));
  list.addEventListener('keydown', (event) => {
    const index = tabs.indexOf(document.activeElement);
    if (index === -1) return;
    const moves = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next = null;
    if (event.key in moves) next = tabs[(index + moves[event.key] + tabs.length) % tabs.length];
    if (event.key === 'Home') next = tabs[0];
    if (event.key === 'End') next = tabs[tabs.length - 1];
    if (!next) return;
    event.preventDefault();
    select(next, true);
  });
};
