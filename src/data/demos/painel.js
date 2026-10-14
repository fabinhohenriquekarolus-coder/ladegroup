export const periods = {
  7: {
    label: 'Últimos 7 dias',
    kpis: { faturamento: 18420, pedidos: 126, ticket: 146, novos: 34 },
    deltas: { faturamento: 8.4, pedidos: 5.0, ticket: 3.2, novos: 12.0 },
    series: [
      ['Seg', 2100],
      ['Ter', 2450],
      ['Qua', 2300],
      ['Qui', 2650],
      ['Sex', 3400],
      ['Sáb', 3200],
      ['Dom', 2320],
    ],
    top: [
      ['Camiseta básica', 38],
      ['Calça jeans', 27],
      ['Kit de meias', 25],
      ['Jaqueta leve', 19],
      ['Boné', 17],
    ],
  },
  30: {
    label: 'Últimos 30 dias',
    kpis: { faturamento: 74900, pedidos: 512, ticket: 146, novos: 118 },
    deltas: { faturamento: 6.1, pedidos: 4.2, ticket: 1.8, novos: 9.5 },
    series: [
      ['Sem 1', 17200],
      ['Sem 2', 18100],
      ['Sem 3', 19400],
      ['Sem 4', 20200],
    ],
    top: [
      ['Camiseta básica', 151],
      ['Calça jeans', 112],
      ['Kit de meias', 98],
      ['Jaqueta leve', 77],
      ['Boné', 74],
    ],
  },
  90: {
    label: 'Últimos 90 dias',
    kpis: { faturamento: 231300, pedidos: 1585, ticket: 146, novos: 342 },
    deltas: { faturamento: 11.3, pedidos: 9.7, ticket: 1.5, novos: 14.8 },
    series: [
      ['1º mês', 71200],
      ['2º mês', 76800],
      ['3º mês', 83300],
    ],
    top: [
      ['Camiseta básica', 468],
      ['Calça jeans', 351],
      ['Kit de meias', 302],
      ['Jaqueta leve', 244],
      ['Boné', 220],
    ],
  },
};

export const kpiLabels = [
  ['faturamento', 'Faturamento', 'money'],
  ['pedidos', 'Pedidos', 'int'],
  ['ticket', 'Ticket médio', 'money'],
  ['novos', 'Clientes novos', 'int'],
];

export const orders = [
  { id: '#4821', client: 'Juliana M.', value: 'R$ 189,90', status: 'Enviado', tone: 'is-ok' },
  { id: '#4820', client: 'Pedro H.', value: 'R$ 96,00', status: 'Pago', tone: 'is-ok' },
  { id: '#4819', client: 'Camila R.', value: 'R$ 312,50', status: 'Aguardando pagamento', tone: 'is-warn' },
  { id: '#4818', client: 'Diego S.', value: 'R$ 74,90', status: 'Enviado', tone: 'is-ok' },
  { id: '#4817', client: 'Aline T.', value: 'R$ 158,00', status: 'Pago', tone: 'is-ok' },
];
