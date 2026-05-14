'use strict';

// Self-improvement layer: analyze historical logs and emit tuning.
// Reads tier-usage.jsonl + soft-failures.jsonl, writes classifier-tuning.json.

const fs = require('fs');
const path = require('path');

const USAGE_LOG = path.join(__dirname, '..', 'memory', 'tier-usage.jsonl');
const FAILURE_LOG = path.join(__dirname, '..', 'memory', 'soft-failures.jsonl');
const TUNING_FILE = path.join(__dirname, '..', 'memory', 'classifier-tuning.json');
const MIN_SAMPLES = 5;

function readJsonl(p) {
  if (!fs.existsSync(p)) return [];
  return fs.readFileSync(p, 'utf8').split('\n').filter(Boolean)
    .map(l => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean);
}

function writeTuning(tuning) {
  const tmp = TUNING_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(tuning, null, 2));
  fs.renameSync(tmp, TUNING_FILE);
}

function loadTuning() {
  try {
    if (fs.existsSync(TUNING_FILE)) {
      return JSON.parse(fs.readFileSync(TUNING_FILE, 'utf8'));
    }
  } catch (_) {}
  return null;
}

function analyzeUsagePatterns(entries) {
  const byPurpose = {};
  const byClass = {};

  for (const e of entries) {
    const p = e.purpose || 'unknown';
    const c = e.class || 'unknown';
    if (!byPurpose[p]) byPurpose[p] = { total: 0, fallbacks: 0, latencies: [], tiers: {} };
    byPurpose[p].total++;
    if (e.fallback) byPurpose[p].fallbacks++;
    if (e.latency_ms) byPurpose[p].latencies.push(e.latency_ms);
    byPurpose[p].tiers[e.tier || 'unknown'] = (byPurpose[p].tiers[e.tier || 'unknown'] || 0) + 1;

    if (!byClass[c]) byClass[c] = { total: 0, fallbacks: 0, latencies: [] };
    byClass[c].total++;
    if (e.fallback) byClass[c].fallbacks++;
    if (e.latency_ms) byClass[c].latencies.push(e.latency_ms);
  }

  return { byPurpose, byClass };
}

function analyzeFailurePatterns(entries) {
  const bySource = {};
  const byTier = {};
  const recent = entries.slice(-50);

  for (const f of recent) {
    const src = f.source || 'unknown';
    bySource[src] = (bySource[src] || 0) + 1;
    const tier = src.split('-')[0];
    byTier[tier] = (byTier[tier] || 0) + 1;
  }

  return { bySource, byTier };
}

function detectMisclassifications(entries) {
  // A misclassification: classified as X, but had to fallback (implies X was wrong)
  const misclass = [];
  for (const e of entries) {
    if (e.fallback && e.class && e.classified && e.class !== e.classified) {
      misclass.push({
        classified: e.classified,
        actual: e.class,
        purpose: e.purpose,
        model: e.model,
      });
    }
  }
  return misclass;
}

function computeThresholdAdjustments(byClass) {
  const adjustments = {};
  for (const [cls, stats] of Object.entries(byClass)) {
    if (stats.total < MIN_SAMPLES) continue;
    const failureRate = stats.fallbacks / stats.total;
    const p95Latency = stats.latencies.length
      ? stats.latencies.sort((a, b) => a - b)[Math.floor(stats.latencies.length * 0.95)]
      : 0;

    // Failure-rate ladder (cbAdjustment raises = "be more lenient before tripping CB"):
    //   > 0.40 — chronically failing tier; very lenient so it doesn't fully break
    //   0.20-0.40 — degraded; mild lenience (the "middle band" — was a dead zone pre-2026-05-14)
    //   < 0.05 — reliable; strict so we surface NEW regressions fast
    let cbAdjustment = 0;
    if (failureRate > 0.4) cbAdjustment = +2;
    else if (failureRate > 0.2) cbAdjustment = +1;
    else if (failureRate < 0.05) cbAdjustment = -1;

    // Latency stress: p95 > 60s = concern, > 120s = also bump CB leniency by +1
    // (slow tier needs more retry budget before being declared dead).
    let latencyConcern = false;
    if (p95Latency > 60000) latencyConcern = true;
    if (p95Latency > 120000) cbAdjustment += 1;

    adjustments[cls] = { failureRate: +(failureRate.toFixed(3)), cbAdjustment, latencyConcern, p95Latency };
  }
  return adjustments;
}

function generateTuning() {
  const usage = readJsonl(USAGE_LOG).slice(-200);
  const failures = readJsonl(FAILURE_LOG).slice(-200);

  const patterns = analyzeUsagePatterns(usage);
  const failurePatterns = analyzeFailurePatterns(failures);
  const misclass = detectMisclassifications(usage);

  // Learn prompt keywords that correlate with successful tiers
  // Compute purpose → best tier mapping
  const purposeTierMap = {};
  for (const e of usage) {
    if (!e.purpose || e.fallback) continue;
    if (!purposeTierMap[e.purpose]) purposeTierMap[e.purpose] = {};
    purposeTierMap[e.purpose][e.class] = (purposeTierMap[e.purpose][e.class] || 0) + 1;
  }
  for (const [p, counts] of Object.entries(purposeTierMap)) {
    const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    purposeTierMap[p] = best ? best[0] : null;
  }

  const keywordMap = {};
  for (const e of usage) {
    if (!e.purpose || e.fallback) continue;
    const words = (e.purpose || '').toLowerCase().split(/[_\s]+/);
    for (const w of words) {
      if (w.length < 3) continue;
      if (!keywordMap[w]) keywordMap[w] = {};
      keywordMap[w][e.class] = (keywordMap[w][e.class] || 0) + 1;
    }
  }

  // Keep only keywords that strongly predict a single class (>80%)
  const learnedKeywords = {};
  for (const [word, counts] of Object.entries(keywordMap)) {
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    if (total < 3) continue;
    for (const [cls, count] of Object.entries(counts)) {
      if (count / total > 0.8) {
        learnedKeywords[word] = cls;
        break;
      }
    }
  }

  const tuning = {
    generatedAt: new Date().toISOString(),
    windowSize: usage.length,
    failureWindowSize: failures.length,
    adjustments: computeThresholdAdjustments(patterns.byClass),
    learnedKeywords,
    misclassificationHints: misclass.slice(-10),
    purposeTierMap,
    recurringFailures: Object.entries(failurePatterns.bySource)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([source, count]) => ({ source, count })),
    quotaSuggestions: (() => {
      const nonDesign = usage.filter(e => e.class !== 'design');
      if (nonDesign.length < 20) return null;
      const counts = { chat: 0, cheap: 0, precision: 0 };
      for (const e of nonDesign) if (counts[e.class] !== undefined) counts[e.class]++;
      const total = nonDesign.length;
      return {
        observed: {
          chat: +(counts.chat / total).toFixed(3),
          cheap: +(counts.cheap / total).toFixed(3),
          precision: +(counts.precision / total).toFixed(3),
        },
        currentTargets: {
          chat: parseFloat(process.env.QUOTA_TARGET_CHAT || '0.30'),
          cheap: parseFloat(process.env.QUOTA_TARGET_CHEAP || '0.40'),
          precision: parseFloat(process.env.QUOTA_TARGET_PRECISION || '0.30'),
        },
      };
    })(),
  };

  writeTuning(tuning);
  return tuning;
}

function getTuningHints() {
  const tuning = loadTuning();
  if (!tuning) return { learnedKeywords: {}, adjustments: {} };
  return {
    learnedKeywords: tuning.learnedKeywords || {},
    adjustments: tuning.adjustjustments || {},
  };
}

function shouldRegenerateTuning() {
  const tuning = loadTuning();
  if (!tuning || !tuning.generatedAt) return true;
  const ageMs = Date.now() - new Date(tuning.generatedAt).getTime();
  return ageMs > 24 * 60 * 60 * 1000; // older than 24h
}

module.exports = {
  generateTuning,
  loadTuning,
  getTuningHints,
  shouldRegenerateTuning,
  analyzeUsagePatterns,
  analyzeFailurePatterns,
  detectMisclassifications,
  computeThresholdAdjustments,
};
