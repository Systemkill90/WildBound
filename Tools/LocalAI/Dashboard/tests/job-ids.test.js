'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { JOB_ID_SEGMENT, normalizeJobId } = require('../job-ids');

test('named local job IDs remain addressable through the status route', () => {
  const id = normalizeJobId('female-homesteader-local-doc-inventory');
  assert.equal(id, 'female-homesteader-local-doc-inventory');
  assert.match(`/v1/jobs/${id}`, new RegExp(`^/v1/jobs/(${JOB_ID_SEGMENT})$`));
});

test('generated UUID job IDs remain supported', () => {
  assert.equal(normalizeJobId(null, '2576080c-6faa-4567-9cbd-1060dbb5fbd6'), '2576080c-6faa-4567-9cbd-1060dbb5fbd6');
});

test('local job IDs reject traversal and oversized values', () => {
  assert.throws(() => normalizeJobId('../escape'), /Task ID/);
  assert.throws(() => normalizeJobId('x'.repeat(101)), /Task ID/);
});
