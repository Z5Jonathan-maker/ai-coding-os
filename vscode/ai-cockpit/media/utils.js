(function () {
  function normalizePreviewUrl(value) {
    const raw = String(value || '').trim();
    if (!raw || raw === 'about:blank') return raw;
    try {
      const url = new URL(raw);
      if (!['http:', 'https:'].includes(url.protocol)) return '';
      if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) return '';
      return url.href;
    } catch (_) {
      return '';
    }
  }

  function round(value) {
    return Math.round(Number(value || 0) * 100) / 100;
  }

  function modeLabel(mode) {
    return {
      autoRun: 'Auto',
      buildFix: 'Code',
      designBrowser: 'Design / Browser',
      designHandoff: 'Creative Handoff',
      researchExtract: 'Research / Extract',
      explainRoute: 'Route Preview',
    }[mode] || 'AI';
  }

  function cleanOutput(title, body) {
    const text = String(body || '').trim();
    if (!text) return '(no output)';
    const diagnostic = /route|receipt|health|status|capacity|metrics/i.test(String(title || ''));
    const cleaned = text
      .split('\n')
      .map(line => formatRouterNotice(title, line))
      .filter(line => diagnostic || !/^(Route selected|Fallback|Provider capacity|Receipt:)/i.test(line.trim()))
      .filter(Boolean)
      .join('\n');
    return cleaned || 'Momentum captured. Detailed route mechanics are available in diagnostics.';
  }

  function formatRouterNotice(title, line) {
    const trimmed = line.trim();
    if (/^Receipt:\s*\{/.test(trimmed)) return 'Receipt: recorded internally';
    if (!trimmed.startsWith('{')) return line;
    try {
      const event = JSON.parse(trimmed);
      const diagnostic = /route|receipt|health|status/i.test(String(title || ''));
      if (event.type === 'circuit_breaker_open') {
        if (!diagnostic) return '';
        const tier = event.data && event.data.tierId ? ` (${event.data.tierId})` : '';
        return `Router notice: precision lane${tier} is degraded. Auto will continue through the available fallback chain.`;
      }
      if ((event.service || event.level) && !diagnostic) return '';
      if (event.message) return `Router notice: ${event.message}`;
    } catch (_) {
      return line;
    }
    return line;
  }

  function parseJson(text) {
    try {
      return JSON.parse(text || '{}');
    } catch (_) {
      return {};
    }
  }

  function topKey(obj) {
    const entries = Object.entries(obj || {}).sort((a, b) => Number(b[1]) - Number(a[1]));
    return entries[0] ? entries[0][0] : '-';
  }

  function compact(value) {
    return String(value).replace(/\s+/g, ' ').slice(0, 120);
  }

  function relativeTime(value) {
    const time = Date.parse(value || '');
    if (!Number.isFinite(time)) return '';
    const delta = Math.max(0, Date.now() - time);
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    if (delta < minute) return 'now';
    if (delta < hour) return `${Math.floor(delta / minute)}m ago`;
    if (delta < day) return `${Math.floor(delta / hour)}h ago`;
    return `${Math.floor(delta / day)}d ago`;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  window.CockpitUtils = {
    clamp,
    cleanOutput,
    compact,
    modeLabel,
    normalizePreviewUrl,
    parseJson,
    relativeTime,
    round,
    topKey,
  };
}());
