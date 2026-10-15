import { html, raw } from '../../../comum/html.js';

const heatLabels = ['', 'baixo', 'médio', 'alto'];

export const facade = (property, tones) => {
  const [sky, ground, wall, accent] = tones[property.tone];
  const windows = (x, y, cols, rows) =>
    Array.from({ length: cols * rows }, (_, index) => {
      const cx = x + (index % cols) * 16;
      const cy = y + Math.floor(index / cols) * 14;
      return `<rect x="${cx}" y="${cy}" width="9" height="8" fill="${sky}"/>`;
    }).join('');
  const shapes = {
    apto: `<rect x="66" y="14" width="68" height="76" fill="${wall}"/>${windows(74, 22, 4, 5)}<rect x="94" y="72" width="12" height="18" fill="${accent}"/>`,
    casa: `<polygon points="46,50 100,16 154,50" fill="${accent}"/><rect x="56" y="50" width="88" height="40" fill="${wall}"/><rect x="92" y="62" width="16" height="28" fill="${accent}"/><rect x="66" y="60" width="14" height="12" fill="${sky}"/><rect x="120" y="60" width="14" height="12" fill="${sky}"/>`,
    sala: `<rect x="36" y="42" width="128" height="48" fill="${wall}"/><rect x="46" y="52" width="108" height="24" fill="${sky}"/><rect x="36" y="38" width="128" height="6" fill="${accent}"/>`,
    cobertura: `<rect x="62" y="30" width="76" height="60" fill="${wall}"/>${windows(70, 46, 4, 3)}<rect x="56" y="22" width="88" height="8" fill="${accent}"/><rect x="72" y="12" width="56" height="10" fill="${wall}"/>`,
  };
  return raw(
    `<svg viewBox="0 0 200 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="200" height="100" fill="${sky}"/><rect y="88" width="200" height="12" fill="${ground}"/>${shapes[property.type]}</svg>`,
  );
};

export const heat = (level) =>
  html`<svg class="heat" viewBox="0 0 38 12" role="img" aria-label="Interesse ${heatLabels[level]}">${[0, 1, 2].map(
    (index) =>
      html`<path d="M${3 + index * 12} 10 L${9 + index * 12} 3 L${15 + index * 12} 10" fill="none" stroke="${index < level ? 'var(--brick)' : 'var(--line)'}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  )}</svg>`;

export const gauge = (value) => {
  const length = 157.08;
  return html`<svg class="gauge" viewBox="0 0 120 74" role="img" aria-label="Chance estimada de fechar: ${value}%">
    <path d="M10 62 A50 50 0 0 1 110 62" fill="none" stroke="var(--line)" stroke-width="10" stroke-linecap="round"/>
    <path d="M10 62 A50 50 0 0 1 110 62" fill="none" stroke="var(--brass)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${(value / 100) * length} ${length}"/>
    <text x="60" y="58" text-anchor="middle" class="gauge-num">${value}%</text></svg>`;
};

export const ring = (score) => {
  const length = 100.53;
  return html`<svg class="ring" viewBox="0 0 40 40" role="img" aria-label="Compatibilidade de ${score}%">
    <circle cx="20" cy="20" r="16" fill="none" stroke="var(--line)" stroke-width="4"/>
    <circle cx="20" cy="20" r="16" fill="none" stroke="var(--pine-2)" stroke-width="4" stroke-linecap="round" stroke-dasharray="${(score / 100) * length} ${length}" transform="rotate(-90 20 20)"/>
    <text x="20" y="24" text-anchor="middle" class="ring-num">${score}</text></svg>`;
};
