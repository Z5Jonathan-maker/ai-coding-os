export function formatDecimalHours(hours) {
  const wholeHours = Math.trunc(hours);
  const minutes = Math.floor((hours - wholeHours) * 60);
  return `${pad(wholeHours)}:${pad(minutes)}`;
}

function pad(value) {
  return String(value).padStart(2, '0');
}
