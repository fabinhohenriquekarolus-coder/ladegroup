export const site = {
  name: 'Lade Group',
  brand: 'LADE GROUP',
  url: 'https://ladegroup.com.br',
  locale: 'pt_BR',
  phoneLabel: '(47) 99106-5421',
  whatsappNumber: '5547991065421',
  regionLabel: 'Joinville e região · SC',
  footerTagline:
    'Sistemas sob medida, automação de atendimento e melhorias para negócios de Joinville e região.',
  footerMeta: 'Sistemas e automação em Joinville, SC',
  ogImage: '/og/lade-group.png',
  ogImageAlt: 'Lade Group: sistemas feitos sob medida para o seu negócio funcionar melhor.',
};

const defaultWhatsappMessage =
  'Olá! Vim pelo site da Lade Group e quero conversar sobre um sistema para o meu negócio.';

const whatsappUrl = (message) => {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

const whatsappMessagesByOrigin = {
  home: 'Olá! Vim pela página inicial do site da Lade Group e quero conversar sobre um sistema para o meu negócio.',
  servicos:
    'Olá! Vim pela página de serviços do site da Lade Group e quero conversar sobre um sistema para o meu negócio.',
};

export const whatsappLinkFor = (origin) =>
  whatsappUrl(whatsappMessagesByOrigin[origin] ?? defaultWhatsappMessage);
export const whatsappContactLink = whatsappUrl();

export const navItems = [
  { key: 'servicos', label: 'Serviços', href: '/servicos.html' },
  { key: 'portfolio', label: 'Portfólio', href: '/portfolio.html' },
  { key: 'sobre', label: 'Sobre', href: '/sobre.html' },
  { key: 'contato', label: 'Contato', href: '/contato.html' },
];
