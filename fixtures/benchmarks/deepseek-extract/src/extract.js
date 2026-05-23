export function scriptNames(pkg) {
  return Object.keys(pkg.scripts || {}).sort();
}
