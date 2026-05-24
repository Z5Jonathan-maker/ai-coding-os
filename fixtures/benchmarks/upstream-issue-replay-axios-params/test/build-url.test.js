import assert from 'node:assert/strict';
import test from 'node:test';
import { buildURL } from '../src/build-url.js';

test('replays nested empty-object params issue', () => {
  const params = {
    limit: 100,
    address: { city: {} },
    details: { name: {} },
  };

  assert.equal(
    buildURL('/url', params),
    '/url?limit=100&address[city]=&details[name]='
  );
});

test('keeps nested values and arrays stable', () => {
  assert.equal(
    buildURL('/url', {
      filter: { status: 'open' },
      tags: ['ai', 'routing'],
    }),
    '/url?filter[status]=open&tags[]=ai&tags[]=routing'
  );
});
