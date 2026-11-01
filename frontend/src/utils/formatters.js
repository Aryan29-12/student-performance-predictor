export function formatGpa(value) {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  return Number(value).toFixed(2);
}

export function formatPercent(value) {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  return `${(Number(value) * 100).toFixed(1)}%`;
}

export function formatScore(value) {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  return Number(value).toFixed(1);
}

export function formatHours(value) {
  if (value === null || value === undefined || isNaN(value)) return '0.0h';
  return `${Number(value).toFixed(1)}h`;
}

