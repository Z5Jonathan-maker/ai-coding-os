export const repoPacket = [
  {
    path: 'app/api/export/route.ts',
    risks: [
      {
        id: 'EXPORT-1',
        severity: 'medium',
        summary: 'unbounded export can exhaust memory',
      },
    ],
  },
  {
    path: 'lib/auth/session.ts',
    risks: [
      {
        id: 'AUTH-1',
        severity: 'critical',
        summary: 'session token is written to logs before redaction',
      },
    ],
  },
  {
    path: 'lib/router/fallback.ts',
    risks: [
      {
        id: 'ROUTE-1',
        severity: 'high',
        summary: 'fallback lacks circuit-state citation in receipt',
      },
    ],
  },
];
