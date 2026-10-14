export const sizes = [
  { id: 'media', label: 'Média', note: '6 fatias' },
  { id: 'grande', label: 'Grande', note: '8 fatias' },
];

export const categories = [
  { id: 'salgadas', label: 'Salgadas' },
  { id: 'doces', label: 'Doces' },
  { id: 'bebidas', label: 'Bebidas' },
];

export const dishes = [
  { id: 'margherita', cat: 'salgadas', art: 'margherita', name: 'Margherita da Casa', desc: 'Tomate pelado, muçarela de búfala, manjericão e fio de azeite.', media: 4400, grande: 5600 },
  { id: 'calabresa', cat: 'salgadas', art: 'calabresa', name: 'Calabresa Acebolada', desc: 'Calabresa curada, cebola roxa e orégano sobre muçarela.', media: 4200, grande: 5400 },
  { id: 'queijos', cat: 'salgadas', art: 'queijos', name: 'Quatro Queijos', desc: 'Muçarela, provolone, gorgonzola e parmesão.', media: 4800, grande: 6200 },
  { id: 'portuguesa', cat: 'salgadas', art: 'portuguesa', name: 'Portuguesa do Forno', desc: 'Presunto, ovo, cebola, azeitona e muçarela.', media: 4600, grande: 5900 },
  { id: 'frango', cat: 'salgadas', art: 'frango', name: 'Frango com Catupiry', desc: 'Frango desfiado temperado e catupiry cremoso.', media: 4500, grande: 5800 },
  { id: 'funghi', cat: 'salgadas', art: 'funghi', name: 'Funghi e Rúcula', desc: 'Cogumelos salteados na manteiga, rúcula e lascas de parmesão.', media: 4900, grande: 6300 },
  { id: 'chocolate', cat: 'doces', art: 'chocolate', name: 'Chocolate com Morango', desc: 'Ganache de chocolate meio amargo e morangos frescos.', media: 4000, grande: 5100 },
  { id: 'banana', cat: 'doces', art: 'banana', name: 'Banana com Canela', desc: 'Banana caramelizada, canela e açúcar queimado.', media: 3800, grande: 4800 },
  { id: 'romeu', cat: 'doces', art: 'romeu', name: 'Romeu e Julieta', desc: 'Muçarela derretida e goiabada cremosa.', media: 3900, grande: 4900 },
  { id: 'refri', cat: 'bebidas', name: 'Refrigerante 2 L', desc: 'Cola, guaraná ou limão. Gelado.', media: 1200 },
  { id: 'suco', cat: 'bebidas', name: 'Suco de laranja 500 ml', desc: 'Espremido na hora, sem açúcar.', media: 1000 },
  { id: 'agua', cat: 'bebidas', name: 'Água com gás 500 ml', desc: 'Gelada, com limão a pedido.', media: 600 },
];

export const neighborhoods = [
  { id: 'centro', name: 'Centro', fee: 500, time: '25 a 35 min' },
  { id: 'acacias', name: 'Jardim das Acácias', fee: 600, time: '30 a 40 min' },
  { id: 'serena', name: 'Vila Serena', fee: 700, time: '35 a 45 min' },
  { id: 'aurora', name: 'Parque Aurora', fee: 800, time: '40 a 50 min' },
  { id: 'bela', name: 'Bela Vista', fee: 900, time: '45 a 55 min' },
];

export const steps = [
  { title: 'Escolha', text: 'Monte o pedido no cardápio, com tamanho e bebida.' },
  { title: 'Confirme', text: 'Informe o bairro e veja a taxa e o prazo antes de fechar.' },
  { title: 'Receba', text: 'A pizza sai do forno e vai direto para a sua porta.' },
];

export const money = (cents) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
