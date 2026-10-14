export const services = [
  { id: 'banho', icon: 'drop', tone: 'sky', name: 'Banho e tosa', text: 'Produtos suaves, secagem sem estresse e tosa na máquina ou na tesoura, com hora marcada.' },
  { id: 'vet', icon: 'heart', tone: 'berry', name: 'Consulta veterinária', text: 'Check-up, vacinas e acompanhamento com quem conhece o seu pet pelo nome.' },
  { id: 'hotel', icon: 'home', tone: 'leaf', name: 'Hotelzinho', text: 'Diárias com passeios, brincadeiras e fotos para o tutor acompanhar.' },
  { id: 'loja', icon: 'tag', tone: 'sun', name: 'Loja e rações', text: 'Rações, petiscos, brinquedos e acessórios escolhidos a dedo.' },
];

export const sizes = [
  { id: 'p', label: 'Pequeno', hint: 'até 8 kg', price: 5500, minutes: 60 },
  { id: 'm', label: 'Médio', hint: '8 a 20 kg', price: 7500, minutes: 80 },
  { id: 'g', label: 'Grande', hint: 'acima de 20 kg', price: 10500, minutes: 100 },
];

export const extras = [
  { id: 'hidratacao', label: 'Hidratação de pelagem', price: 2500, minutes: 15 },
  { id: 'unhas', label: 'Corte de unhas', price: 1500, minutes: 10 },
  { id: 'dentes', label: 'Escovação de dentes', price: 1800, minutes: 10 },
  { id: 'higienica', label: 'Tosa higiênica', price: 2200, minutes: 15 },
];

export const days = ['Seg 12', 'Ter 13', 'Qua 14', 'Qui 15', 'Sex 16', 'Sáb 17'];

export const hours = ['09:00', '10:30', '13:00', '14:30', '16:00'];

export const busy = {
  'Seg 12': ['10:30', '16:00'],
  'Ter 13': ['09:00', '13:00', '14:30'],
  'Qua 14': ['09:00', '10:30'],
  'Qui 15': ['16:00'],
  'Sex 16': ['10:30', '13:00', '14:30', '16:00'],
  'Sáb 17': ['09:00'],
};

export const bookable = [
  { id: 'banho', label: 'Banho e tosa' },
  { id: 'vet', label: 'Consulta veterinária' },
  { id: 'hotel', label: 'Visita ao hotelzinho' },
];

export const promises = [
  { title: 'Hora marcada', text: 'Seu pet não espera em fila nem fica horas esperando o banho.' },
  { title: 'Fotos no fim', text: 'Mandamos uma foto do resultado para você buscar com o coração tranquilo.' },
  { title: 'Sem pressa', text: 'Pets mais sensíveis têm tempo extra, sem custo, para se acostumar.' },
];

export const money = (cents) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
