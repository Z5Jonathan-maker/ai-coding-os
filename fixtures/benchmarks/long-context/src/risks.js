export function highestSeverity(items) {
  const order = ['low', 'medium', 'high', 'critical'];
  return items.map((item) => item.severity).sort((a, b) => order.indexOf(b) - order.indexOf(a))[0] || 'low';
}

export function summarizeRisks(files) {
  return files.flatMap((file) =>
    (file.risks || []).map((risk) => ({
      ...risk,
      file: file.path,
      citation: `${file.path}#${risk.id}`,
    }))
  );
}

export function topRisk(files) {
  const risks = summarizeRisks(files);
  const severity = highestSeverity(risks);
  return risks.find((risk) => risk.severity === severity) || null;
}
