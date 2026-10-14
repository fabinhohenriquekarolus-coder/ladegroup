const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

class SafeHtml {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return this.value;
  }
}

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => entities[char]);

const format = (value) => {
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(format).join('');
  if (value === null || value === undefined || value === false) return '';
  return escapeHtml(value);
};

export const raw = (value) => new SafeHtml(String(value));

export const html = (strings, ...values) =>
  new SafeHtml(strings.reduce((out, chunk, index) => out + chunk + (index < values.length ? format(values[index]) : ''), ''));
