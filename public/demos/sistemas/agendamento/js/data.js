export const services = {
  corte: { name: 'Corte', minutes: 40, price: 'R$ 70' },
  coloracao: { name: 'Coloração', minutes: 90, price: 'R$ 180' },
  manicure: { name: 'Manicure', minutes: 45, price: 'R$ 45' },
  escova: { name: 'Escova', minutes: 30, price: 'R$ 55' },
};

export const pros = {
  ana: { name: 'Ana', color: '#0a6fb0', soft: '#d6eaf7' },
  beto: { name: 'Beto', color: '#13806a', soft: '#d2f0e7' },
  carla: { name: 'Carla', color: '#b8651b', soft: '#fbe5cf' },
};

export const days = [
  { id: 0, short: 'Seg', number: 12 },
  { id: 1, short: 'Ter', number: 13 },
  { id: 2, short: 'Qua', number: 14, today: true },
  { id: 3, short: 'Qui', number: 15 },
  { id: 4, short: 'Sex', number: 16 },
  { id: 5, short: 'Sáb', number: 17 },
];

export const clients = [
  {
    id: 'c1',
    name: 'Fernanda Lima',
    since: '2023',
    visits: 24,
    last: 'há 9 dias',
    pref: 'Corte',
    tags: ['recorrente'],
    note: 'Prefere horários no fim da tarde.',
  },
  {
    id: 'c2',
    name: 'Rita Campos',
    since: '2024',
    visits: 11,
    last: 'há 3 semanas',
    pref: 'Coloração',
    tags: ['recorrente'],
    note: 'Alérgica a amônia. Usar linha sem amônia.',
  },
  {
    id: 'c3',
    name: 'Bianca Oliveira',
    since: '2026',
    visits: 2,
    last: 'há 5 dias',
    pref: 'Manicure',
    tags: ['nova'],
    note: 'Primeira visita indicada por Fernanda.',
  },
  {
    id: 'c4',
    name: 'Marcela Paiva',
    since: '2022',
    visits: 38,
    last: 'há 12 dias',
    pref: 'Escova',
    tags: ['recorrente'],
    note: 'Gosta de café com leite na chegada.',
  },
  {
    id: 'c5',
    name: 'Sônia Ribeiro',
    since: '2026',
    visits: 3,
    last: 'há 1 mês',
    pref: 'Coloração',
    tags: ['nova'],
    note: 'Quer testar tons mais claros.',
  },
  {
    id: 'c6',
    name: 'Tatiane Vieira',
    since: '2024',
    visits: 9,
    last: 'há 2 semanas',
    pref: 'Corte',
    tags: ['recorrente'],
    note: 'Prefere atendimento com a Ana.',
  },
];

export const appointments = [
  { day: 0, start: '09:00', service: 'corte', pro: 'ana', client: 'c1', status: 'confirmado' },
  { day: 0, start: '09:30', service: 'manicure', pro: 'carla', client: 'c3', status: 'confirmado' },
  { day: 0, start: '10:30', service: 'coloracao', pro: 'beto', client: 'c2', status: 'confirmado' },
  { day: 0, start: '14:00', service: 'escova', pro: 'ana', client: 'c4', status: 'aguardando' },
  { day: 0, start: '15:00', service: 'manicure', pro: 'carla', client: 'c5', status: 'confirmado' },
  { day: 1, start: '09:00', service: 'escova', pro: 'beto', client: 'c4', status: 'confirmado' },
  { day: 1, start: '10:00', service: 'corte', pro: 'ana', client: 'c6', status: 'confirmado' },
  { day: 1, start: '11:00', service: 'coloracao', pro: 'carla', client: 'c2', status: 'aguardando' },
  { day: 1, start: '15:30', service: 'corte', pro: 'beto', client: 'c1', status: 'confirmado' },
  { day: 2, start: '08:30', service: 'manicure', pro: 'carla', client: 'c3', status: 'confirmado' },
  { day: 2, start: '09:30', service: 'coloracao', pro: 'ana', client: 'c5', status: 'confirmado' },
  { day: 2, start: '11:00', service: 'corte', pro: 'beto', client: 'c6', status: 'aguardando' },
  { day: 2, start: '11:30', service: 'escova', pro: 'carla', client: 'c4', status: 'confirmado' },
  { day: 2, start: '14:00', service: 'corte', pro: 'ana', client: 'c1', status: 'confirmado' },
  { day: 2, start: '16:00', service: 'manicure', pro: 'beto', client: 'c2', status: 'aguardando' },
  { day: 3, start: '10:00', service: 'corte', pro: 'beto', client: 'c3', status: 'confirmado' },
  { day: 3, start: '13:30', service: 'coloracao', pro: 'ana', client: 'c4', status: 'confirmado' },
  { day: 3, start: '16:30', service: 'escova', pro: 'carla', client: 'c6', status: 'aguardando' },
  { day: 4, start: '09:00', service: 'coloracao', pro: 'carla', client: 'c1', status: 'confirmado' },
  { day: 4, start: '11:30', service: 'corte', pro: 'ana', client: 'c2', status: 'confirmado' },
  { day: 4, start: '14:30', service: 'manicure', pro: 'beto', client: 'c5', status: 'aguardando' },
  { day: 4, start: '17:00', service: 'escova', pro: 'ana', client: 'c3', status: 'confirmado' },
  { day: 5, start: '09:00', service: 'corte', pro: 'ana', client: 'c6', status: 'confirmado' },
  { day: 5, start: '10:00', service: 'coloracao', pro: 'beto', client: 'c4', status: 'confirmado' },
  { day: 5, start: '12:00', service: 'manicure', pro: 'carla', client: 'c5', status: 'aguardando' },
];

export const openHour = 8;

export const closeHour = 18;
