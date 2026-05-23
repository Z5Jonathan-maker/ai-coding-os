export function redactToken(value) {
  return String(value || '').replace(/[A-Za-z0-9_-]{12,}/g, '[redacted]');
}
