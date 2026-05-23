export function highestSeverity(items) {
  const order = ['low', 'medium', 'high', 'critical'];
  return items.map((item) => item.severity).sort((a, b) => order.indexOf(b) - order.indexOf(a))[0] || 'low';
}
