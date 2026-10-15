import lacarCover from '../../assets/previews/lacar-inicio.jpg';
import lacarDetail from '../../assets/previews/lacar-uso.jpg';
import crmCover from '../../assets/previews/crm-imobiliario-inicio.jpg';
import crmDetail from '../../assets/previews/crm-imobiliario-uso.jpg';
import erpCover from '../../assets/previews/erp-contabil-inicio.jpg';
import erpDetail from '../../assets/previews/erp-contabil-uso.jpg';
import painelCover from '../../assets/previews/painel-de-gestao-inicio.jpg';
import painelDetail from '../../assets/previews/painel-de-gestao-uso.jpg';
import barbeariaCover from '../../assets/previews/barbearia-inicio.jpg';
import barbeariaDetail from '../../assets/previews/barbearia-uso.jpg';
import agendaCover from '../../assets/previews/agendamento-inicio.jpg';
import agendaDetail from '../../assets/previews/agendamento-uso.jpg';
import pizzariaCover from '../../assets/previews/pizzaria-inicio.jpg';
import pizzariaDetail from '../../assets/previews/pizzaria-uso.jpg';
import petshopCover from '../../assets/previews/petshop-inicio.jpg';
import petshopDetail from '../../assets/previews/petshop-uso.jpg';
import modaCover from '../../assets/previews/moda-inicio.jpg';
import modaDetail from '../../assets/previews/moda-uso.jpg';
import autopecasCover from '../../assets/previews/autopecas-inicio.jpg';
import autopecasDetail from '../../assets/previews/autopecas-uso.jpg';

export const lacarDemo = {
  product: 'LaCar',
  title: 'Atendimento e gestão para lava-rápido',
  text: 'Atendente no WhatsApp com três modos, agenda por dia e semana, clientes, fluxo de caixa, serviços por porte e o Ladinho, que responde sobre o caixa.',
  href: '/demos/lacar/',
  cover: lacarCover,
  detail: lacarDetail,
};

export const systemDemos = [
  {
    product: 'Morada',
    title: 'CRM imobiliário com IA',
    text: 'Funil de vendas com cartões arrastáveis, conversa com o cliente e um assistente de IA simulado que resume e sugere o próximo passo.',
    href: '/demos/sistemas/crm-imobiliario/',
    cover: crmCover,
    detail: crmDetail,
  },
  {
    product: 'Razão',
    title: 'ERP contábil com IA',
    text: 'Lançamentos, obrigações e documentos por cliente, com conferência e classificação por IA simulada e revisão humana.',
    href: '/demos/sistemas/erp-contabil/',
    cover: erpCover,
    detail: erpDetail,
  },
  {
    product: 'Maré',
    title: 'Painel de gestão',
    text: 'Faturamento, canais de venda, mapa de calor de horários e metas que respondem ao período e a cada novo pedido.',
    href: '/demos/sistemas/painel-de-gestao/',
    cover: painelCover,
    detail: painelDetail,
  },
  {
    product: 'Compasso',
    title: 'Agendamento e cadastro de clientes',
    text: 'Agenda semanal que respeita a duração de cada serviço, evita conflito de horário e guarda a ficha de cada cliente.',
    href: '/demos/sistemas/agendamento/',
    cover: agendaCover,
    detail: agendaDetail,
  },
  {
    product: 'Régua',
    title: 'Gestão para barbearia',
    text: 'Agenda por cadeira, fila de encaixe que acha o primeiro horário livre, clube de assinantes, caixa do dia e comissão de cada barbeiro.',
    href: '/demos/sistemas/barbearia/',
    cover: barbeariaCover,
    detail: barbeariaDetail,
  },
];

export const siteDemos = [
  {
    product: 'Fornalha Vivo',
    title: 'Pizzaria e delivery',
    text: 'Cardápio por categoria e tamanho, pedido que soma o total e taxa de entrega calculada por bairro.',
    href: '/demos/sites/pizzaria/',
    cover: pizzariaCover,
    detail: pizzariaDetail,
  },
  {
    product: 'Toca Mansa',
    title: 'Pet shop',
    text: 'Serviços, estimativa de preço do banho por porte e agendamento com horários livres e ocupados.',
    href: '/demos/sites/petshop/',
    cover: petshopCover,
    detail: petshopDetail,
  },
  {
    product: 'Meia-Luz',
    title: 'Loja de moda',
    text: 'Coleção filtrável, escolha de cor e tamanho, favoritos e sacola com progresso do frete grátis.',
    href: '/demos/sites/moda/',
    cover: modaCover,
    detail: modaDetail,
  },
  {
    product: 'Eixo Norte',
    title: 'Autopeças B2B',
    text: 'Catálogo para lojistas com busca por código, estoque por item e cotação com desconto por volume.',
    href: '/demos/sites/autopecas/',
    cover: autopecasCover,
    detail: autopecasDetail,
  },
];
