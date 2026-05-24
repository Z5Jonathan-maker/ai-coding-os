export function buildURL(url, params = {}) {
  const pairs = [];

  appendParams(pairs, '', params);

  if (!pairs.length) return url;
  return `${url}?${pairs.join('&')}`;
}

function appendParams(pairs, prefix, value) {
  if (value == null) return;

  if (Array.isArray(value)) {
    value.forEach((item) => appendParams(pairs, `${prefix}[]`, item));
    return;
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return;
    for (const key of keys) {
      appendParams(pairs, prefix ? `${prefix}[${key}]` : key, value[key]);
    }
    return;
  }

  pairs.push(`${encodeKey(prefix)}=${encodeURIComponent(String(value))}`);
}

function encodeKey(key) {
  return key.replace(/[^[\]]+/g, (part) => encodeURIComponent(part));
}
