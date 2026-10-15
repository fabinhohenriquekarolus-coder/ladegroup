export const today = '2026-10-14';

export const now = '15:10';

export const openTime = '09:00';

export const closeTime = '20:00';

export const services = [
  { id: 'corte', name: 'Corte', minutes: 40, price: 45 },
  { id: 'barba', name: 'Barba', minutes: 30, price: 35 },
  { id: 'combo', name: 'Corte e barba', minutes: 60, price: 70 },
  { id: 'acabamento', name: 'Pezinho e acabamento', minutes: 15, price: 15 },
  { id: 'sobrancelha', name: 'Sobrancelha', minutes: 15, price: 20 },
  { id: 'pigmentacao', name: 'Pigmentação', minutes: 45, price: 60 },
];

export const barbers = [
  { id: 'tonho', name: 'Tonho', rate: 0.45, breakStart: '12:00', breakEnd: '13:00' },
  { id: 'rafa', name: 'Rafa', rate: 0.4, breakStart: '12:30', breakEnd: '13:30' },
  { id: 'leo', name: 'Léo', rate: 0.4, breakStart: '13:00', breakEnd: '14:00' },
];

export const productRate = 0.1;

export const clubPayout = 20;

export const appointments = [
  { id: 't1', barber: 'tonho', start: '09:00', service: 'combo', client: 'Marcelo P.', payment: 'pix' },
  { id: 't2', barber: 'tonho', start: '10:00', service: 'corte', client: 'Diego S.', payment: 'cartao' },
  { id: 't3', barber: 'tonho', start: '10:40', service: 'barba', client: 'Paulo R.', payment: 'dinheiro' },
  { id: 't4', barber: 'tonho', start: '11:20', service: 'corte', client: 'André M.', payment: 'clube' },
  { id: 't5', barber: 'tonho', start: '13:00', service: 'combo', client: 'Vinícius A.', payment: 'cartao' },
  { id: 't6', barber: 'tonho', start: '14:00', service: 'corte', client: 'Bruno L.', payment: 'clube' },
  { id: 't7', barber: 'tonho', start: '14:50', service: 'pigmentacao', client: 'Renato C.', payment: 'pix' },
  { id: 't8', barber: 'tonho', start: '16:20', service: 'corte', client: 'Gustavo F.', payment: 'pix' },
  { id: 't9', barber: 'tonho', start: '17:30', service: 'combo', client: 'Felipe N.', payment: 'cartao' },
  { id: 't10', barber: 'tonho', start: '19:00', service: 'corte', client: 'Matheus O.', payment: 'pix' },
  { id: 'r1', barber: 'rafa', start: '09:30', service: 'corte', client: 'Lucas D.', payment: 'clube' },
  { id: 'r2', barber: 'rafa', start: '10:15', service: 'barba', client: 'Thiago V.', payment: 'dinheiro' },
  { id: 'r3', barber: 'rafa', start: '11:00', service: 'combo', client: 'Rodrigo B.', payment: 'clube' },
  { id: 'r4', barber: 'rafa', start: '12:00', service: 'acabamento', client: 'Júlio E.', payment: 'pix' },
  { id: 'r5', barber: 'rafa', start: '13:30', service: 'corte', client: 'Fernando G.', payment: 'cartao' },
  { id: 'r6', barber: 'rafa', start: '14:15', service: 'corte', client: 'Samuel K.', payment: 'clube' },
  { id: 'r7', barber: 'rafa', start: '15:00', service: 'combo', client: 'Igor T.', payment: 'cartao' },
  { id: 'r8', barber: 'rafa', start: '16:30', service: 'barba', client: 'Leandro H.', payment: 'pix' },
  { id: 'r9', barber: 'rafa', start: '18:00', service: 'corte', client: 'Caetano J.', payment: 'clube' },
  { id: 'l1', barber: 'leo', start: '09:00', service: 'corte', client: 'Alan W.', payment: 'cartao' },
  { id: 'l2', barber: 'leo', start: '09:45', service: 'sobrancelha', client: 'Wesley Q.', payment: 'pix' },
  { id: 'l3', barber: 'leo', start: '10:30', service: 'combo', client: 'Roberto Z.', payment: 'clube' },
  { id: 'l4', barber: 'leo', start: '11:30', service: 'corte', client: 'Murilo Y.', payment: 'dinheiro' },
  { id: 'l5', barber: 'leo', start: '12:15', service: 'barba', client: 'Davi U.', payment: 'pix' },
  { id: 'l6', barber: 'leo', start: '14:00', service: 'corte', client: 'Heitor I.', payment: 'clube' },
  { id: 'l7', barber: 'leo', start: '14:45', service: 'acabamento', client: 'Enzo X.', payment: 'pix' },
  { id: 'l8', barber: 'leo', start: '15:30', service: 'combo', client: 'Arthur P.', payment: 'cartao' },
  { id: 'l9', barber: 'leo', start: '17:00', service: 'corte', client: 'Nicolas R.', payment: 'pix' },
  { id: 'l10', barber: 'leo', start: '18:15', service: 'pigmentacao', client: 'Pedro S.', payment: 'cartao' },
];

export const queue = [
  { id: 'w1', name: 'Caio', service: 'corte', arrived: '14:52' },
  { id: 'w2', name: 'Henrique', service: 'barba', arrived: '15:01' },
  { id: 'w3', name: 'Otávio', service: 'sobrancelha', arrived: '15:06' },
];

export const products = [
  { barber: 'tonho', name: 'Pomada modeladora', price: 45, payment: 'pix' },
  { barber: 'tonho', name: 'Shampoo para barba', price: 32, payment: 'cartao' },
  { barber: 'rafa', name: 'Óleo para barba', price: 39, payment: 'pix' },
  { barber: 'leo', name: 'Pomada modeladora', price: 45, payment: 'dinheiro' },
];

export const plans = [
  { id: 'corte', name: 'Clube Corte', price: 89, includes: 'Cortes à vontade no mês' },
  { id: 'completo', name: 'Clube Completo', price: 129, includes: 'Corte e barba à vontade no mês' },
];

export const subscribers = [
  { id: 's1', name: 'André M.', plan: 'completo', renewal: '2026-10-28', uses: 3 },
  { id: 's2', name: 'Bruno L.', plan: 'corte', renewal: '2026-10-16', uses: 2 },
  { id: 's3', name: 'Rodrigo B.', plan: 'completo', renewal: '2026-10-10', uses: 4 },
  { id: 's4', name: 'Roberto Z.', plan: 'completo', renewal: '2026-11-02', uses: 1 },
  { id: 's5', name: 'Marcos T.', plan: 'corte', renewal: '2026-10-14', uses: 2 },
  { id: 's6', name: 'Samuel K.', plan: 'corte', renewal: '2026-10-22', uses: 2 },
  { id: 's7', name: 'Igor C.', plan: 'completo', renewal: '2026-10-08', uses: 3 },
  { id: 's8', name: 'Heitor I.', plan: 'corte', renewal: '2026-10-30', uses: 1 },
  { id: 's9', name: 'Caetano J.', plan: 'corte', renewal: '2026-10-19', uses: 2 },
  { id: 's10', name: 'Lucas D.', plan: 'completo', renewal: '2026-10-25', uses: 3 },
];
