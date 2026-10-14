export const categories = [
  { id: 'todas', label: 'Todas' },
  { id: 'freios', label: 'Freios' },
  { id: 'filtros', label: 'Filtros' },
  { id: 'suspensao', label: 'Suspensão' },
  { id: 'motor', label: 'Motor' },
  { id: 'eletrica', label: 'Elétrica' },
];

export const lines = [
  { id: 'todas', label: 'Todas as linhas' },
  { id: 'leve', label: 'Linha leve' },
  { id: 'pesada', label: 'Linha pesada' },
];

export const parts = [
  { code: 'EN-1042', cat: 'freios', line: 'leve', name: 'Pastilha de freio dianteira', app: 'Compactos e sedãs 1.0 a 1.6, 2010 a 2021', stock: 240, price: 8990 },
  { code: 'EN-1055', cat: 'freios', line: 'leve', name: 'Disco de freio ventilado 280 mm', app: 'Sedãs médios e SUVs compactos, 2012 a 2022', stock: 86, price: 21900 },
  { code: 'EN-1218', cat: 'freios', line: 'pesada', name: 'Lona de freio traseira', app: 'Caminhões leves e médios, eixo traseiro', stock: 34, price: 15450 },
  { code: 'EN-3001', cat: 'filtros', line: 'leve', name: 'Filtro de óleo rosca M20', app: 'Motores 1.0 a 2.0 flex', stock: 620, price: 2790 },
  { code: 'EN-3014', cat: 'filtros', line: 'leve', name: 'Filtro de ar do motor', app: 'Compactos e hatches 1.0 a 1.6', stock: 410, price: 3980 },
  { code: 'EN-3077', cat: 'filtros', line: 'pesada', name: 'Filtro de combustível diesel', app: 'Utilitários e caminhões leves a diesel', stock: 128, price: 6850 },
  { code: 'EN-4120', cat: 'suspensao', line: 'leve', name: 'Amortecedor dianteiro pressurizado', app: 'Sedãs e hatches médios, 2014 a 2022', stock: 52, price: 18900 },
  { code: 'EN-4188', cat: 'suspensao', line: 'leve', name: 'Bieleta da barra estabilizadora', app: 'Compactos e hatches, eixo dianteiro', stock: 305, price: 4290 },
  { code: 'EN-4310', cat: 'suspensao', line: 'pesada', name: 'Pivô de suspensão reforçado', app: 'Caminhões leves e vans de carga', stock: 0, price: 12700 },
  { code: 'EN-5005', cat: 'motor', line: 'leve', name: 'Correia dentada 118 dentes', app: 'Motores 1.0 e 1.4, 8 e 16 válvulas', stock: 175, price: 5490 },
  { code: 'EN-5042', cat: 'motor', line: 'leve', name: 'Kit de distribuição completo', app: 'Motores 1.6 e 1.8 flex', stock: 41, price: 34900 },
  { code: 'EN-5120', cat: 'motor', line: 'leve', name: 'Vela de ignição de iridium', app: 'Motores flex 1.0 a 2.0', stock: 890, price: 3490 },
  { code: 'EN-6003', cat: 'eletrica', line: 'leve', name: 'Bateria 60 Ah livre de manutenção', app: 'Compactos, sedãs e hatches', stock: 64, price: 41900 },
  { code: 'EN-6050', cat: 'eletrica', line: 'pesada', name: 'Alternador 90 A reforçado', app: 'Utilitários e caminhões leves', stock: 12, price: 89900 },
  { code: 'EN-6102', cat: 'eletrica', line: 'leve', name: 'Sensor de temperatura do motor', app: 'Motores flex 1.0 a 1.8', stock: 0, price: 4790 },
];

export const kpis = [
  { value: '12 mil', label: 'códigos ativos' },
  { value: '24 h', label: 'entrega na região' },
  { value: '28 dias', label: 'faturamento para lojistas' },
];

export const benefits = [
  { icon: 'file', title: 'Cadastro com CNPJ', text: 'Aprovação rápida e acesso ao catálogo completo, com preço de lojista.' },
  { icon: 'bars', title: 'Faturamento em 28 dias', text: 'Limite de crédito definido na análise e revisto conforme o volume.' },
  { icon: 'truck', title: 'Entrega programada', text: 'Rotas fixas na região e retirada no balcão para pedidos urgentes.' },
  { icon: 'message', title: 'Atendente dedicado', text: 'Uma pessoa que conhece a sua oficina, por telefone ou WhatsApp.' },
];

export const tiers = [
  { min: 50, rate: 0.08 },
  { min: 10, rate: 0.05 },
];

export const money = (cents) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
