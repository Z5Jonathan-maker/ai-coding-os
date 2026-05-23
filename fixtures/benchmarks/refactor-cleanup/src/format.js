export function titleCase(value) {
  return String(value || '').split(' ').filter(Boolean).map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
}

export function slugify(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function humanLabel(value) {
  return String(value || '').trim().replace(/-+/g, ' ').split(' ').filter(Boolean).map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
}
