export const money = (value) => value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const totalOf = (entries) => entries.reduce((sum, entry) => sum + entry.value, 0);

export const openFindings = (client, checked) => (checked ? client.entries.filter((entry) => entry.flag && !entry.reviewed) : []);

export const pendingObligations = (client) => client.obligations.filter((item) => item.status !== 'entregue').length;

export const deliveryProgress = (client) => {
  const done = client.obligations.filter((item) => item.status === 'entregue').length;
  const total = client.obligations.length;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
};

export const sortRows = (rows, { key, dir }) =>
  [...rows].sort((a, b) => {
    if (a[key] > b[key]) return dir;
    if (a[key] < b[key]) return -dir;
    return 0;
  });

export const toggleSort = (rule, key) => ({ key, dir: rule.key === key ? -rule.dir : 1 });

export const needsReview = (doc, threshold) => doc.confidence < threshold && !doc.approved;

export const findingsLabel = (count) => `${count} ${count === 1 ? 'apontamento' : 'apontamentos'}`;
