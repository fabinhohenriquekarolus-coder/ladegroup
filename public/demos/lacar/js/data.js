export const today = '2026-10-14';

export const capacity = 2;

export const openHour = 8;

export const closeHour = 18;

export const weekDays = ['2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15', '2026-10-16', '2026-10-17'];

export const portes = [
  { id: 'moto', label: 'Moto' },
  { id: 'hatch', label: 'Hatch' },
  { id: 'sedan', label: 'Sedan' },
  { id: 'suv', label: 'SUV' },
  { id: 'picape', label: 'Picape' },
];

export const services = [
  {
    id: 'simples',
    name: 'Lavagem simples',
    text: 'Externa, com secagem e pretinho nos pneus.',
    minutes: 40,
    prices: { moto: 30, hatch: 45, sedan: 50, suv: 60, picape: 70 },
  },
  {
    id: 'completa',
    name: 'Lavagem completa',
    text: 'Externa e interna, com aspiração e limpeza do painel.',
    minutes: 60,
    prices: { moto: 45, hatch: 70, sedan: 80, suv: 90, picape: 110 },
  },
  {
    id: 'higienizacao',
    name: 'Higienização interna',
    text: 'Bancos, carpete e teto com extratora.',
    minutes: 180,
    prices: { moto: null, hatch: 180, sedan: 200, suv: 240, picape: 260 },
  },
  {
    id: 'polimento',
    name: 'Polimento',
    text: 'Correção leve de riscos e brilho na pintura.',
    minutes: 240,
    prices: { moto: 150, hatch: 250, sedan: 280, suv: 320, picape: 380 },
  },
];

export const clients = [
  { id: 'c1', name: 'Marcos Andrade', visits: 9, lastVisit: '2026-10-12', total: 760 },
  { id: 'c2', name: 'Juliana Ramos', visits: 4, lastVisit: '2026-10-12', total: 690 },
  { id: 'c3', name: 'Carlos Pereira', visits: 7, lastVisit: '2026-10-14', total: 980 },
  { id: 'c4', name: 'Renata Souza', visits: 5, lastVisit: '2026-10-12', total: 1120 },
  { id: 'c5', name: 'Diego Martins', visits: 3, lastVisit: '2026-10-13', total: 580 },
  { id: 'c6', name: 'Patrícia Lima', visits: 11, lastVisit: '2026-10-14', total: 815 },
  { id: 'c7', name: 'Bruno Teixeira', visits: 6, lastVisit: '2026-10-13', total: 1430 },
  { id: 'c8', name: 'Aline Ferreira', visits: 8, lastVisit: '2026-10-14', total: 540 },
  { id: 'c9', name: 'Rafael Costa', visits: 2, lastVisit: '2026-10-13', total: 410 },
  { id: 'c10', name: 'Tiago Moura', visits: 12, lastVisit: '2026-10-12', total: 395 },
  { id: 'c11', name: 'Camila Rocha', visits: 1, lastVisit: '2026-10-13', total: 45 },
  { id: 'c12', name: 'Eduardo Nunes', visits: 0, lastVisit: null, total: 0 },
  { id: 'c13', name: 'Fernanda Alves', visits: 5, lastVisit: '2026-08-22', total: 610 },
  { id: 'c14', name: 'Gustavo Ribeiro', visits: 3, lastVisit: '2026-08-30', total: 290 },
];

export const appointments = [
  { id: 'a1', date: '2026-10-12', start: '08:00', service: 'completa', porte: 'suv', client: 'c1', status: 'concluido', origin: 'whatsapp' },
  { id: 'a2', date: '2026-10-12', start: '08:30', service: 'polimento', porte: 'sedan', client: 'c4', status: 'concluido', origin: 'manual' },
  { id: 'a3', date: '2026-10-12', start: '09:30', service: 'simples', porte: 'hatch', client: 'c6', status: 'concluido', origin: 'whatsapp' },
  { id: 'a4', date: '2026-10-12', start: '13:30', service: 'higienizacao', porte: 'suv', client: 'c2', status: 'concluido', origin: 'whatsapp' },
  { id: 'a5', date: '2026-10-12', start: '14:00', service: 'completa', porte: 'hatch', client: 'c8', status: 'concluido', origin: 'whatsapp' },
  { id: 'a6', date: '2026-10-12', start: '16:00', service: 'simples', porte: 'moto', client: 'c10', status: 'concluido', origin: 'whatsapp' },
  { id: 'a7', date: '2026-10-13', start: '08:00', service: 'simples', porte: 'sedan', client: 'c3', status: 'concluido', origin: 'whatsapp' },
  { id: 'a8', date: '2026-10-13', start: '09:00', service: 'completa', porte: 'suv', client: 'c9', status: 'concluido', origin: 'whatsapp' },
  { id: 'a9', date: '2026-10-13', start: '10:00', service: 'completa', porte: 'picape', client: 'c7', status: 'concluido', origin: 'manual' },
  { id: 'a10', date: '2026-10-13', start: '10:30', service: 'polimento', porte: 'suv', client: 'c5', status: 'concluido', origin: 'whatsapp' },
  { id: 'a11', date: '2026-10-13', start: '14:00', service: 'simples', porte: 'hatch', client: 'c11', status: 'concluido', origin: 'whatsapp' },
  { id: 'a12', date: '2026-10-13', start: '15:30', service: 'completa', porte: 'sedan', client: 'c12', status: 'cancelado', origin: 'whatsapp' },
  { id: 'a13', date: '2026-10-14', start: '08:00', service: 'completa', porte: 'suv', client: 'c6', status: 'concluido', origin: 'whatsapp' },
  { id: 'a14', date: '2026-10-14', start: '08:30', service: 'higienizacao', porte: 'sedan', client: 'c3', status: 'concluido', origin: 'manual' },
  { id: 'a15', date: '2026-10-14', start: '10:00', service: 'simples', porte: 'hatch', client: 'c8', status: 'concluido', origin: 'whatsapp' },
  { id: 'a16', date: '2026-10-14', start: '13:00', service: 'polimento', porte: 'picape', client: 'c7', status: 'confirmado', origin: 'whatsapp' },
  { id: 'a17', date: '2026-10-14', start: '14:00', service: 'completa', porte: 'sedan', client: 'c4', status: 'confirmado', origin: 'whatsapp' },
  { id: 'a18', date: '2026-10-14', start: '15:30', service: 'simples', porte: 'suv', client: 'c1', status: 'agendado', origin: 'whatsapp' },
  { id: 'a19', date: '2026-10-15', start: '08:00', service: 'completa', porte: 'hatch', client: 'c5', status: 'confirmado', origin: 'whatsapp' },
  { id: 'a20', date: '2026-10-15', start: '09:00', service: 'higienizacao', porte: 'suv', client: 'c9', status: 'agendado', origin: 'manual' },
  { id: 'a21', date: '2026-10-15', start: '10:30', service: 'simples', porte: 'sedan', client: 'c12', status: 'confirmado', origin: 'whatsapp' },
  { id: 'a22', date: '2026-10-15', start: '14:00', service: 'completa', porte: 'suv', client: 'c13', status: 'agendado', origin: 'whatsapp' },
  { id: 'a23', date: '2026-10-16', start: '08:00', service: 'polimento', porte: 'sedan', client: 'c2', status: 'confirmado', origin: 'whatsapp' },
  { id: 'a24', date: '2026-10-16', start: '08:30', service: 'completa', porte: 'moto', client: 'c10', status: 'confirmado', origin: 'whatsapp' },
  { id: 'a25', date: '2026-10-16', start: '10:00', service: 'simples', porte: 'hatch', client: 'c6', status: 'agendado', origin: 'whatsapp' },
  { id: 'a26', date: '2026-10-16', start: '13:30', service: 'completa', porte: 'picape', client: 'c7', status: 'agendado', origin: 'whatsapp' },
  { id: 'a27', date: '2026-10-16', start: '15:00', service: 'simples', porte: 'sedan', client: 'c3', status: 'agendado', origin: 'whatsapp' },
  { id: 'a28', date: '2026-10-17', start: '08:00', service: 'completa', porte: 'sedan', client: 'c4', status: 'agendado', origin: 'whatsapp' },
  { id: 'a29', date: '2026-10-17', start: '08:00', service: 'simples', porte: 'hatch', client: 'c8', status: 'agendado', origin: 'whatsapp' },
  { id: 'a30', date: '2026-10-17', start: '09:30', service: 'completa', porte: 'suv', client: 'c11', status: 'agendado', origin: 'whatsapp' },
  { id: 'a31', date: '2026-10-17', start: '10:30', service: 'higienizacao', porte: 'hatch', client: 'c14', status: 'agendado', origin: 'whatsapp' },
];

export const cashDays = [
  { date: '2026-09-15', income: 780, visits: 9 },
  { date: '2026-09-16', income: 820, visits: 9 },
  { date: '2026-09-17', income: 905, visits: 10 },
  { date: '2026-09-18', income: 990, visits: 11 },
  { date: '2026-09-19', income: 1240, visits: 14 },
  { date: '2026-09-21', income: 760, visits: 8 },
  { date: '2026-09-22', income: 840, visits: 9 },
  { date: '2026-09-23', income: 870, visits: 10 },
  { date: '2026-09-24', income: 930, visits: 10 },
  { date: '2026-09-25', income: 1050, visits: 12 },
  { date: '2026-09-26', income: 1310, visits: 15 },
  { date: '2026-09-28', income: 790, visits: 9 },
  { date: '2026-09-29', income: 860, visits: 10 },
  { date: '2026-09-30', income: 900, visits: 10 },
  { date: '2026-10-01', income: 905, visits: 10 },
  { date: '2026-10-02', income: 1010, visits: 11 },
  { date: '2026-10-03', income: 1290, visits: 14 },
  { date: '2026-10-05', income: 830, visits: 9 },
  { date: '2026-10-06', income: 880, visits: 10 },
  { date: '2026-10-07', income: 925, visits: 10 },
  { date: '2026-10-08', income: 1005, visits: 11 },
  { date: '2026-10-09', income: 1095, visits: 12 },
  { date: '2026-10-10', income: 1395, visits: 13 },
  { date: '2026-10-12', income: 755, visits: 6 },
  { date: '2026-10-13', income: 615, visits: 5 },
  { date: '2026-10-14', income: 335, visits: 3 },
];

export const expenses = [
  { date: '2026-09-18', label: 'Shampoo e cera', category: 'Produtos', amount: 420 },
  { date: '2026-09-25', label: 'Conta de água', category: 'Água e energia', amount: 310 },
  { date: '2026-09-29', label: 'Microfibras e escovas', category: 'Produtos', amount: 160 },
  { date: '2026-10-01', label: 'Aluguel do galpão', category: 'Aluguel', amount: 1800 },
  { date: '2026-10-02', label: 'Shampoo automotivo', category: 'Produtos', amount: 380 },
  { date: '2026-10-05', label: 'Conta de energia', category: 'Água e energia', amount: 290 },
  { date: '2026-10-08', label: 'Manutenção da lavadora', category: 'Manutenção', amount: 250 },
  { date: '2026-10-10', label: 'Conta de água', category: 'Água e energia', amount: 270 },
  { date: '2026-10-13', label: 'Cera e pretinho', category: 'Produtos', amount: 210 },
];

export const monthByService = [
  { service: 'simples', count: 52, revenue: 2390 },
  { service: 'completa', count: 41, revenue: 3480 },
  { service: 'higienizacao', count: 12, revenue: 2560 },
  { service: 'polimento', count: 9, revenue: 2610 },
];

export const monthByHour = [
  { hour: 8, count: 14 },
  { hour: 9, count: 16 },
  { hour: 10, count: 21 },
  { hour: 11, count: 12 },
  { hour: 13, count: 10 },
  { hour: 14, count: 17 },
  { hour: 15, count: 13 },
  { hour: 16, count: 8 },
  { hour: 17, count: 3 },
];

export const questions = [
  { id: 'semana', text: 'Quanto entrou essa semana?' },
  { id: 'gasto', text: 'Onde estou gastando mais?' },
  { id: 'servico', text: 'Qual serviço rende mais?' },
  { id: 'pico', text: 'Qual o horário mais cheio?' },
];
