export const site = {
  name: 'Lade Group',
  brand: 'LADE GROUP',
  url: 'https://ladegroup.com.br',
  locale: 'pt_BR',
  phoneLabel: '(47) 99106-5421',
  whatsappNumber: '5547991065421',
  regionLabel: 'Joinville e região · SC',
  footerTagline:
    'Gestão de tráfego, sites e automação com IA para comércios de Joinville e região.',
  footerMeta: 'Marketing digital e automação · Joinville, SC',
};

export const defaultWhatsappMessage =
  'Olá! Vim pelo site da Lade Group e quero saber mais sobre gestão de tráfego.';

const whatsappUrl = (message) => {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

export const whatsappLink = whatsappUrl(defaultWhatsappMessage);
export const whatsappContactLink = whatsappUrl();

export const navItems = [
  { key: 'servicos', label: 'Serviços', href: '/servicos.html' },
  { key: 'portfolio', label: 'Portfólio', href: '/portfolio.html' },
  { key: 'sobre', label: 'Sobre', href: '/sobre.html' },
  { key: 'contato', label: 'Contato', href: '/contato.html' },
];
