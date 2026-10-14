export const clients = [
  {
    id: 'padaria',
    name: 'Padaria Modelo ME',
    regime: 'Simples Nacional',
    entries: [
      { id: 'e1', day: 2, date: '02/09', history: 'Vendas do balcão — semana 1', debit: 'Caixa', credit: 'Receita de vendas', value: 18420.5, doc: 'nf-0142.pdf' },
      { id: 'e2', day: 3, date: '03/09', history: 'Compra de farinha de trigo', debit: 'Estoque de insumos', credit: 'Fornecedores', value: 4280, doc: 'nf-compra-0931.xml' },
      { id: 'e3', day: 5, date: '05/09', history: 'Compra de farinha de trigo', debit: 'Estoque de insumos', credit: 'Fornecedores', value: 4280, doc: 'nf-compra-0931.xml', flag: 'Mesma nota fiscal lançada duas vezes (03/09 e 05/09), com o mesmo valor. Verifique se não é duplicidade.' },
      { id: 'e4', day: 8, date: '08/09', history: 'Pagamento de aluguel', debit: 'Despesa de aluguel', credit: 'Banco c/c', value: 3600, doc: 'recibo-aluguel.jpg' },
      { id: 'e5', day: 10, date: '10/09', history: 'Energia elétrica', debit: 'Despesa de energia', credit: 'Banco c/c', value: 2150, doc: 'conta-energia.pdf', flag: 'Valor 5 vezes maior que a média dos últimos seis meses (R$ 430,00). Confirme o documento.' },
      { id: 'e6', day: 12, date: '12/09', history: 'Folha de pagamento', debit: 'Despesa de pessoal', credit: 'Banco c/c', value: 9800, doc: 'holerite-agosto.pdf' },
      { id: 'e7', day: 15, date: '15/09', history: 'Pagamento da guia DAS', debit: 'Impostos a recolher', credit: 'Banco c/c', value: 1904.35, doc: 'guia-das.pdf' },
      { id: 'e8', day: 18, date: '18/09', history: 'Encomenda de bolos', debit: 'Clientes', credit: 'Receita de vendas', value: 2750, doc: 'nf-0151.pdf' },
      { id: 'e9', day: 22, date: '22/09', history: 'Compra de embalagens', debit: 'Estoque de insumos', credit: 'Fornecedores', value: 680.9, doc: 'nf-compra-0944.xml' },
    ],
    obligations: [
      { id: 'o1', name: 'Guia DAS', due: '15/10', day: 15, status: 'pendente', owner: 'MB' },
      { id: 'o2', name: 'DCTFWeb', due: '15/10', day: 15, status: 'pendente', owner: 'MB' },
      { id: 'o3', name: 'Folha de pagamento', due: '20/10', day: 20, status: 'entregue', owner: 'JC' },
      { id: 'o4', name: 'Declaração de ISS', due: '30/10', day: 30, status: 'pendente', owner: 'JC' },
    ],
    docs: [
      { id: 'd1', file: 'nf-0158.pdf', received: '23/09', kind: 'Nota fiscal de saída', account: 'Receita de vendas', confidence: 98 },
      { id: 'd2', file: 'recibo-manutencao.jpg', received: '24/09', kind: 'Recibo de despesa', account: 'Despesa de manutenção', confidence: 87 },
      { id: 'd3', file: 'extrato-setembro.ofx', received: '25/09', kind: 'Extrato bancário', account: 'Conciliação bancária', confidence: 99 },
    ],
  },
  {
    id: 'clinica',
    name: 'Clínica Exemplo Ltda',
    regime: 'Lucro Presumido',
    entries: [
      { id: 'e1', day: 1, date: '01/09', history: 'Honorários de consultas — semana 1', debit: 'Banco c/c', credit: 'Receita de serviços', value: 32800, doc: 'rps-0501.pdf' },
      { id: 'e2', day: 4, date: '04/09', history: 'Aluguel da sala', debit: 'Despesa de aluguel', credit: 'Banco c/c', value: 5400, doc: 'recibo-sala.pdf' },
      { id: 'e3', day: 6, date: '06/09', history: 'Material de consumo', debit: 'Despesa de material', credit: 'Fornecedores', value: 2315.4, doc: 'nf-compra-3012.xml' },
      { id: 'e4', day: 9, date: '09/09', history: 'Serviço de limpeza', debit: 'Despesa de serviços', credit: 'Banco c/c', value: 1200, doc: '', flag: 'Lançamento sem documento vinculado. Anexe a nota ou o recibo antes de fechar a competência.' },
      { id: 'e5', day: 12, date: '12/09', history: 'Honorários de consultas — semana 2', debit: 'Banco c/c', credit: 'Receita de serviços', value: 29150, doc: 'rps-0518.pdf' },
      { id: 'e6', day: 15, date: '15/09', history: 'Folha de pagamento', debit: 'Despesa de pessoal', credit: 'Banco c/c', value: 21400, doc: 'holerite-agosto.pdf' },
      { id: 'e7', day: 20, date: '20/09', history: 'Pagamento de ISS', debit: 'Impostos a recolher', credit: 'Banco c/c', value: 1640, doc: 'guia-iss.pdf' },
      { id: 'e8', day: 24, date: '24/09', history: 'Honorários de consultas — semana 4', debit: 'Banco c/c', credit: 'Receita de serviços', value: 30220, doc: 'rps-0544.pdf' },
    ],
    obligations: [
      { id: 'o1', name: 'DCTFWeb', due: '15/10', day: 15, status: 'pendente', owner: 'MB' },
      { id: 'o2', name: 'Folha de pagamento', due: '20/10', day: 20, status: 'pendente', owner: 'JC' },
      { id: 'o3', name: 'Declaração de ISS', due: '30/10', day: 30, status: 'pendente', owner: 'JC' },
      { id: 'o4', name: 'SPED Fiscal', due: '25/10', day: 25, status: 'entregue', owner: 'MB' },
    ],
    docs: [
      { id: 'd1', file: 'nf-compra-3055.xml', received: '22/09', kind: 'Nota fiscal de entrada', account: 'Despesa de material', confidence: 96 },
      { id: 'd2', file: 'boleto-internet.pdf', received: '23/09', kind: 'Conta de consumo', account: 'Despesa de telecomunicações', confidence: 94 },
    ],
  },
  {
    id: 'oficina',
    name: 'Oficina Demo EPP',
    regime: 'Simples Nacional',
    entries: [
      { id: 'e1', day: 2, date: '02/09', history: 'Serviços de mecânica — semana 1', debit: 'Caixa', credit: 'Receita de serviços', value: 14250, doc: 'nfse-0211.pdf' },
      { id: 'e2', day: 5, date: '05/09', history: 'Compra de peças', debit: 'Estoque de peças', credit: 'Fornecedores', value: 6120.75, doc: 'nf-compra-7710.xml' },
      { id: 'e3', day: 9, date: '09/09', history: 'Pagamento de aluguel', debit: 'Despesa de aluguel', credit: 'Banco c/c', value: 4100, doc: 'recibo-galpao.pdf' },
      { id: 'e4', day: 12, date: '12/09', history: 'Folha de pagamento', debit: 'Despesa de pessoal', credit: 'Banco c/c', value: 11800, doc: 'holerite-agosto.pdf' },
      { id: 'e5', day: 16, date: '16/09', history: 'Serviços de mecânica — semana 3', debit: 'Caixa', credit: 'Receita de serviços', value: 16900, doc: 'nfse-0226.pdf' },
      { id: 'e6', day: 19, date: '19/09', history: 'Pagamento da guia DAS', debit: 'Impostos a recolher', credit: 'Banco c/c', value: 1480.2, doc: 'guia-das.pdf' },
      { id: 'e7', day: 23, date: '23/09', history: 'Compra de ferramentas', debit: 'Imobilizado', credit: 'Fornecedores', value: 2390, doc: 'nf-compra-7752.xml' },
    ],
    obligations: [
      { id: 'o1', name: 'Guia DAS', due: '15/10', day: 15, status: 'entregue', owner: 'MB' },
      { id: 'o2', name: 'DCTFWeb', due: '15/10', day: 15, status: 'atrasada', owner: 'MB' },
      { id: 'o3', name: 'Folha de pagamento', due: '20/10', day: 20, status: 'pendente', owner: 'JC' },
    ],
    docs: [
      { id: 'd1', file: 'nf-compra-7790.xml', received: '24/09', kind: 'Nota fiscal de entrada', account: 'Estoque de peças', confidence: 97 },
      { id: 'd2', file: 'contrato-seguro.pdf', received: '25/09', kind: 'Contrato', account: 'Despesa de seguros', confidence: 84 },
      { id: 'd3', file: 'extrato-setembro.ofx', received: '25/09', kind: 'Extrato bancário', account: 'Conciliação bancária', confidence: 99 },
    ],
  },
];

export const reviewBelow = 90;
