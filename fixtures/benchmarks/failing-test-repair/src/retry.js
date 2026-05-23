export function shouldRetry(status) {
  return [408, 429, 500, 502, 503, 504].includes(status);
}
