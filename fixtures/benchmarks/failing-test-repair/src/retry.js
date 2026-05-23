const RETRYABLE_STATUSES = new Set([408, 500, 502, 503, 504]);
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'TRACE']);
const IDEMPOTENT_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'TRACE', 'PUT', 'DELETE']);

export function normalizeStatus(value) {
  const status = Number(value);
  if (!Number.isInteger(status) || status < 100 || status > 599) return 0;
  return status;
}

export function normalizeMethod(value) {
  return String(value || 'GET').trim().toUpperCase();
}

export function classifyError(error = {}) {
  const status = normalizeStatus(error.status ?? error.statusCode ?? error.code);
  if (!status) return 'network';
  if (status >= 500) return 'server';
  if (status === 408) return 'timeout';
  if (status === 429) return 'rate-limit';
  if (status >= 400) return 'client';
  return 'none';
}

export function isIdempotentRequest(request = {}) {
  const method = normalizeMethod(request.method);
  if (SAFE_METHODS.has(method)) return true;
  if (IDEMPOTENT_METHODS.has(method)) return true;
  return Boolean(request.headers?.['idempotency-key'] || request.headers?.['Idempotency-Key']);
}

export function shouldRetry(error = {}, request = {}) {
  const status = normalizeStatus(error.status ?? error);
  const method = normalizeMethod(request.method);
  if (!isIdempotentRequest({ ...request, method })) return false;
  return RETRYABLE_STATUSES.has(status);
}

export function nextDelayMs(attempt, options = {}) {
  const baseMs = Number(options.baseMs ?? 250);
  const maxMs = Number(options.maxMs ?? 4000);
  const safeAttempt = Math.max(0, Number(attempt) || 0);
  return Math.min(maxMs, baseMs * 2 ** safeAttempt);
}
