export const money = (cents) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const estimate = (size, extras) => {
  const items = [size, ...extras];
  return {
    price: items.reduce((sum, item) => sum + item.price, 0),
    minutes: items.reduce((sum, item) => sum + item.minutes, 0),
  };
};

export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} min`;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
};

export const takenHours = (busy, day) => busy[day] ?? [];

export const isAvailable = (busy, day, hour) => Boolean(day) && !takenHours(busy, day).includes(hour);

export const missingFields = ({ tutor, pet, day, hour }) => {
  const missing = [];
  if (!tutor.trim()) missing.push('seu nome');
  if (!pet.trim()) missing.push('o nome do pet');
  if (!day) missing.push('o dia');
  else if (!hour) missing.push('o horário');
  return missing;
};

export const listInPortuguese = (items) => {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;
};
