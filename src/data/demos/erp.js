export const kpis = [
  { label: 'Clientes ativos', value: '48', foot: '3 novos no mês' },
  { label: 'Obrigações do mês', value: '126', foot: '92 entregues' },
  { label: 'Documentos a classificar', value: '14', foot: 'recebidos na semana', id: 'kpi-docs' },
  { label: 'Prazos em risco', value: '5', foot: 'vencem em até 3 dias' },
];

export const deadlines = [
  { day: '15', what: 'Guia DAS', detail: '18 clientes do Simples Nacional', badge: 'em 3 dias', tone: 'is-bad' },
  { day: '15', what: 'DCTFWeb', detail: '9 clientes', badge: 'em 3 dias', tone: 'is-bad' },
  { day: '20', what: 'Folha de pagamento', detail: '12 clientes', badge: 'em 8 dias', tone: 'is-warn' },
  { day: '25', what: 'SPED Fiscal', detail: '6 clientes', badge: 'em 13 dias', tone: '' },
  { day: '30', what: 'Declaração de ISS', detail: '14 clientes', badge: 'em 18 dias', tone: '' },
];

export const obligations = [
  { client: 'Padaria Modelo ME', name: 'Guia DAS', due: '15/10', status: 'pendente' },
  { client: 'Clínica Exemplo Ltda', name: 'DCTFWeb', due: '15/10', status: 'pendente' },
  { client: 'Oficina Demo EPP', name: 'Guia DAS', due: '15/10', status: 'entregue' },
  { client: 'Mercadinho Fictício Ltda', name: 'Folha de pagamento', due: '20/10', status: 'pendente' },
  { client: 'Transportes Exemplo Ltda', name: 'SPED Fiscal', due: '25/10', status: 'pendente' },
  { client: 'Studio Demonstração ME', name: 'Guia DAS', due: '15/10', status: 'entregue' },
  { client: 'Padaria Modelo ME', name: 'Folha de pagamento', due: '20/10', status: 'entregue' },
  { client: 'Clínica Exemplo Ltda', name: 'Declaração de ISS', due: '30/10', status: 'pendente' },
  { client: 'Oficina Demo EPP', name: 'DCTFWeb', due: '15/10', status: 'atrasada' },
  { client: 'Mercadinho Fictício Ltda', name: 'Guia DAS', due: '15/10', status: 'entregue' },
  { client: 'Transportes Exemplo Ltda', name: 'Folha de pagamento', due: '20/10', status: 'entregue' },
  { client: 'Studio Demonstração ME', name: 'Declaração de ISS', due: '30/10', status: 'pendente' },
];

export const statusTone = { entregue: 'is-ok', pendente: 'is-warn', atrasada: 'is-bad' };

export const docs = [
  { id: 'd1', file: 'nf-0142.pdf', client: 'Padaria Modelo ME', kind: 'Nota fiscal de saída', account: 'Receita de vendas', confidence: 98 },
  { id: 'd2', file: 'extrato-setembro.ofx', client: 'Clínica Exemplo Ltda', kind: 'Extrato bancário', account: 'Conciliação bancária', confidence: 99 },
  { id: 'd3', file: 'recibo-aluguel.jpg', client: 'Oficina Demo EPP', kind: 'Recibo de despesa', account: 'Despesa: aluguel', confidence: 88 },
  { id: 'd4', file: 'conta-energia.pdf', client: 'Mercadinho Fictício Ltda', kind: 'Conta de consumo', account: 'Despesa: energia elétrica', confidence: 95 },
  { id: 'd5', file: 'nf-compra-8831.xml', client: 'Transportes Exemplo Ltda', kind: 'Nota fiscal de entrada', account: 'Despesa: combustível', confidence: 96 },
  { id: 'd6', file: 'holerite-agosto.pdf', client: 'Studio Demonstração ME', kind: 'Folha de pagamento', account: 'Despesa: pessoal', confidence: 97 },
];

export const reviewBelow = 90;
