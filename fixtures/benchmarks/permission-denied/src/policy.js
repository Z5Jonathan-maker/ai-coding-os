export function blocksSecretRead(command) {
  return /\b(env|printenv|op\s+read|security\s+find-generic-password)\b/i.test(command);
}
