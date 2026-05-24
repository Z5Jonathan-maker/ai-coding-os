export function classifyIntent(prompt) {
  const text = prompt.toLowerCase();
  if (/debug|security|architecture/.test(text)) return 'precision';
  if (/summarize|extract|json/.test(text)) return 'cheap';
  if (/browser|screenshot|ui/.test(text)) return 'codex';
  if (/image|hero|visual|creative/.test(text)) return 'design';
  return 'codex';
}

export function routeForClass(intentClass) {
  const routes = {
    precision: { platform: 'claude', fallbackChain: ['claude', 'codex'] },
    cheap: { platform: 'deepseek', fallbackChain: ['deepseek', 'codex'] },
    design: { platform: 'kimi', fallbackChain: ['kimi', 'codex'] },
    codex: { platform: 'codex', fallbackChain: ['codex'] }
  };
  return routes[intentClass] || routes.codex;
}

export function buildRouteReceipt(prompt) {
  const intentClass = classifyIntent(prompt);
  const route = routeForClass(intentClass);
  return {
    prompt,
    intentClass,
    platform: route.platform,
    fallbackChain: route.fallbackChain
  };
}
