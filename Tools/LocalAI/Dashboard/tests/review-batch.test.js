'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ReviewBatch = require('../review-batch.js');

function memoryStorage() {
  const values = new Map();
  return { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
}

test('review batch starts and clears a reversible view marker without touching job data', () => {
  const storage = memoryStorage();
  const batch = ReviewBatch.start(storage, '2026-10-27T12:00:00.000Z');
  assert.equal(ReviewBatch.load(storage).id, batch.id);
  const oldJob = { id: 'old', createdAt: '2026-10-26T12:00:00.000Z' };
  const newJob = { id: 'new', createdAt: '2026-10-27T12:00:01.000Z' };
  assert.deepEqual(ReviewBatch.selectJobs([oldJob, newJob], batch), [newJob]);
  ReviewBatch.end(storage);
  assert.deepEqual(ReviewBatch.selectJobs([oldJob, newJob], null), [oldJob, newJob]);
});

test('review board summarizes each non-3D pipeline and highlights redo states', () => {
  const jobs = [
    { id: 'one', kind: 'concept-art', status: 'awaiting_review', createdAt: '2026-10-27T12:00:00.000Z' },
    { id: 'two', kind: 'sfx', status: 'quality_failed', createdAt: '2026-10-27T12:00:01.000Z' },
    { id: 'three', brief: { kind: 'voice' }, status: 'running', createdAt: '2026-10-27T12:00:02.000Z' },
  ];
  const cards = ReviewBatch.summarize(jobs);
  assert.equal(cards.length, 8);
  assert.equal(cards.find(card => card.kind === 'concept-art').state, 'review');
  assert.equal(cards.find(card => card.kind === 'sfx').state, 'redo');
  assert.equal(cards.find(card => card.kind === 'voice').state, 'working');
  assert.deepEqual(ReviewBatch.counts(cards), { readyForReview: 1, working: 1, redo: 1, waiting: 5 });
});

test('newest job per pipeline is used on the review board', () => {
  const cards = ReviewBatch.summarize([
    { id: 'older', kind: 'texture', status: 'failed', createdAt: '2026-10-27T12:00:00.000Z' },
    { id: 'newer', kind: 'texture', status: 'awaiting_review', createdAt: '2026-10-27T12:00:01.000Z' },
  ]);
  const texture = cards.find(card => card.kind === 'texture');
  assert.equal(texture.job.id, 'newer');
  assert.equal(texture.state, 'review');
});

test('dashboard wires the review-batch view and local persistence endpoints', () => {
  const root=path.resolve(__dirname,'..');
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  const studio=fs.readFileSync(path.join(root,'production-studio.js'),'utf8');
  const server=fs.readFileSync(path.join(root,'server.js'),'utf8');
  for(const kind of ReviewBatch.PIPELINES.map(item=>item.kind))assert.ok(studio.includes(`'${kind}'`)||studio.includes(`${kind}:`),`Missing sample prompt for ${kind}`);
  assert.match(html,/id="reviewBatchPipelines"/);
  assert.match(studio,/\/api\/review-batch\/start/);
  assert.match(studio,/\/api\/review-batch\/show-all/);
  assert.match(server,/review-batch\.json/);
  assert.match(server,/\/api\/review-batch/);
});
