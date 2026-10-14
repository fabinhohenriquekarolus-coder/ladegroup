export const services = [
  { id: 'corte', name: 'Corte', minutes: 40, price: 'R$ 70' },
  { id: 'coloracao', name: 'Coloração', minutes: 90, price: 'R$ 180' },
  { id: 'manicure', name: 'Manicure', minutes: 45, price: 'R$ 45' },
  { id: 'escova', name: 'Escova', minutes: 30, price: 'R$ 55' },
];

export const days = [
  { id: 'seg', label: 'Seg 12' },
  { id: 'ter', label: 'Ter 13' },
  { id: 'qua', label: 'Qua 14' },
  { id: 'qui', label: 'Qui 15' },
  { id: 'sex', label: 'Sex 16' },
];

export const firstHour = 9;
export const slotCount = 18;

export const clients = [
  { id: 'c1', name: 'Fernanda L.', visits: 12, last: 'há 9 dias', kind: 'recorrente' },
  { id: 'c2', name: 'Rita C.', visits: 7, last: 'há 3 semanas', kind: 'recorrente' },
  { id: 'c3', name: 'Bianca O.', visits: 1, last: 'há 5 dias', kind: 'nova' },
  { id: 'c4', name: 'Marcela P.', visits: 15, last: 'há 12 dias', kind: 'recorrente' },
  { id: 'c5', name: 'Sônia R.', visits: 2, last: 'há 1 mês', kind: 'nova' },
  { id: 'c6', name: 'Tatiane V.', visits: 5, last: 'há 2 semanas', kind: 'recorrente' },
];

export const appointments = [
  { day: 'seg', time: '09:00', service: 'corte', client: 'c1' },
  { day: 'seg', time: '10:30', service: 'coloracao', client: 'c2' },
  { day: 'seg', time: '14:00', service: 'manicure', client: 'c3' },
  { day: 'ter', time: '09:30', service: 'escova', client: 'c4' },
  { day: 'ter', time: '15:00', service: 'corte', client: 'c6' },
  { day: 'qua', time: '11:00', service: 'coloracao', client: 'c5' },
  { day: 'qui', time: '10:00', service: 'manicure', client: 'c1' },
  { day: 'sex', time: '16:00', service: 'escova', client: 'c3' },
];
