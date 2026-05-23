export function canonicalAsset(name) {
  return `/assets/canonical/${String(name || '').replace(/[^a-z0-9-]/gi, '-').toLowerCase()}.png`;
}
