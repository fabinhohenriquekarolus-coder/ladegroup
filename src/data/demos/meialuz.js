export const colors = {
  ferrugem: { name: 'Ferrugem', hex: '#b4532a' },
  noite: { name: 'Noite', hex: '#232a3b' },
  areia: { name: 'Areia', hex: '#d9cdb8' },
  salvia: { name: 'Sálvia', hex: '#98a58d' },
  blush: { name: 'Blush', hex: '#e8c9bc' },
  grafite: { name: 'Grafite', hex: '#3b3a40' },
  cru: { name: 'Cru', hex: '#efe6d3' },
  giz: { name: 'Azul-giz', hex: '#9db3c9' },
};

export const categories = [
  { id: 'todos', label: 'Tudo' },
  { id: 'vestidos', label: 'Vestidos' },
  { id: 'camisas', label: 'Camisas' },
  { id: 'calcas', label: 'Calças' },
  { id: 'casacos', label: 'Casacos' },
  { id: 'acessorios', label: 'Acessórios' },
];

export const sizes = ['P', 'M', 'G'];

export const products = [
  { id: 'aurora', cat: 'vestidos', art: 'dress', name: 'Vestido Aurora', price: 38900, tile: '#ecd9cc', colors: ['ferrugem', 'noite', 'areia'] },
  { id: 'lua', cat: 'vestidos', art: 'dress', name: 'Vestido Lua Cheia', price: 42900, tile: '#dfe3d6', colors: ['salvia', 'blush', 'grafite'] },
  { id: 'prado', cat: 'camisas', art: 'shirt', name: 'Camisa Linho Prado', price: 25900, tile: '#e3e9ef', colors: ['cru', 'giz', 'ferrugem'] },
  { id: 'ripa', cat: 'camisas', art: 'shirt', name: 'Camisa Ripa', price: 23900, tile: '#ece5d8', colors: ['noite', 'areia', 'salvia'] },
  { id: 'dia', cat: 'calcas', art: 'pants', name: 'Calça Alfaiataria Dia', price: 32900, tile: '#e6e0d6', colors: ['grafite', 'areia', 'noite'] },
  { id: 'sol', cat: 'calcas', art: 'pants', name: 'Calça Pregas Sol', price: 34900, tile: '#f0dfd2', colors: ['cru', 'ferrugem', 'salvia'] },
  { id: 'entretempo', cat: 'casacos', art: 'coat', name: 'Casaco Entretempo', price: 58900, tile: '#d8dce6', colors: ['noite', 'areia', 'ferrugem'] },
  { id: 'trench', cat: 'casacos', art: 'coat', name: 'Trench Leve', price: 64900, tile: '#ebe3d4', colors: ['areia', 'grafite', 'blush'] },
  { id: 'meialua', cat: 'acessorios', art: 'bag', name: 'Bolsa Meia-Lua', price: 27900, tile: '#e7d3c6', colors: ['ferrugem', 'grafite', 'cru'] },
  { id: 'cesto', cat: 'acessorios', art: 'bag', name: 'Bolsa Cesto', price: 21900, tile: '#e4e8dc', colors: ['areia', 'salvia', 'noite'] },
  { id: 'seda', cat: 'acessorios', art: 'scarf', name: 'Lenço Seda Mate', price: 13900, tile: '#e9dde6', colors: ['blush', 'giz', 'ferrugem'] },
  { id: 'brisa', cat: 'acessorios', art: 'scarf', name: 'Lenço Brisa', price: 11900, tile: '#dde6e8', colors: ['giz', 'cru', 'noite'] },
];

export const looks = [
  { no: '01', title: 'Aurora e Trench Leve', text: 'Para o fim de tarde que esfria sem avisar.', art: ['dress', 'coat'], tones: ['#b4532a', '#d9cdb8'], bg: '#e8c9bc' },
  { no: '02', title: 'Linho Prado e Alfaiataria', text: 'A camisa que atravessa a semana inteira.', art: ['shirt', 'pants'], tones: ['#efe6d3', '#3b3a40'], bg: '#9db3c9' },
  { no: '03', title: 'Lua Cheia e Meia-Lua', text: 'Uma noite longa, sem pressa de ir embora.', art: ['dress', 'bag'], tones: ['#232a3b', '#b4532a'], bg: '#98a58d' },
];

export const promises = [
  { title: 'Séries pequenas', text: 'Cada peça é produzida em poucas unidades. Quando acaba, acaba.' },
  { title: 'Troca em 30 dias', text: 'Não serviu ou não era o que você imaginou? A troca é por nossa conta.' },
  { title: 'Frete grátis', text: 'Em compras acima de R$ 350, para qualquer endereço do país.' },
];

export const freeShipping = 35000;

export const money = (cents) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
