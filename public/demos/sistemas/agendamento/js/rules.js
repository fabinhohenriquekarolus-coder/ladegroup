export const toMinutes = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));

export const toTime = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

export const endOf = (item, services) => item.startMin + services[item.service].minutes;

export const overlaps = (a, b, services) =>
  a.day === b.day && a.pro === b.pro && a.startMin < endOf(b, services) && b.startMin < endOf(a, services);

export const findConflict = (items, candidate, services) =>
  items.find((other) => other.id !== candidate.id && overlaps(other, candidate, services)) ?? null;

export const fitsBusinessHours = (candidate, services, openMin, closeMin) =>
  candidate.startMin >= openMin && endOf(candidate, services) <= closeMin;

export const assignLanes = (items, services) => {
  const sorted = [...items].sort((a, b) => a.startMin - b.startMin).map((item) => ({ ...item }));
  const placed = [];
  let cluster = [];
  let clusterEnd = -Infinity;

  const flush = () => {
    const laneEnds = [];
    cluster.forEach((item) => {
      let lane = laneEnds.findIndex((end) => end <= item.startMin);
      if (lane === -1) lane = laneEnds.length;
      laneEnds[lane] = endOf(item, services);
      item.lane = lane;
    });
    cluster.forEach((item) => {
      item.lanes = laneEnds.length;
    });
    placed.push(...cluster);
    cluster = [];
  };

  sorted.forEach((item) => {
    if (cluster.length && item.startMin >= clusterEnd) flush();
    cluster.push(item);
    clusterEnd = Math.max(clusterEnd, endOf(item, services));
  });
  if (cluster.length) flush();
  return placed;
};

export const nextFreeStart = (items, item, services, closeMin, step = 30) => {
  for (let start = item.startMin + step; start + services[item.service].minutes <= closeMin; start += step) {
    if (!findConflict(items, { ...item, startMin: start }, services)) return start;
  }
  return null;
};

export const slotFromOffset = (offsetPx, openMin, pxPerMinute = 1, step = 30) =>
  openMin + Math.floor(offsetPx / pxPerMinute / step) * step;

export const initials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export const visitsLabel = (client) =>
  client.visits ? `${client.visits} ${client.visits === 1 ? 'visita' : 'visitas'}, última ${client.last}` : 'Ainda sem visitas';
