'use strict';
(function attachReviewBatch(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WildBoundReviewBatch = api;
})(globalThis, () => {
  const STORAGE_KEY = 'wildbound.garage.reviewBatch.v1';
  const PIPELINES = [
    { kind: 'concept-art', label: '2D concept art', detail: 'One finished concept image' },
    { kind: 'texture', label: 'Texture / material', detail: 'One tileable material image' },
    { kind: 'skybox', label: 'Skybox source art', detail: 'One 2:1 panorama source image' },
    { kind: 'vfx-source', label: 'VFX source artwork', detail: 'One isolated effect texture' },
    { kind: 'voice', label: 'Character voice', detail: 'One reviewable spoken line' },
    { kind: 'music', label: 'Music', detail: 'One short instrumental cue' },
    { kind: 'ambience', label: 'Musical ambience', detail: 'One short ambience bed' },
    { kind: 'sfx', label: 'Sound effect', detail: 'One isolated, non-musical SFX' },
  ];
  const ACTIVE = new Set(['queued', 'running', 'cancelling', 'importing']);
  const NEEDS_ATTENTION = new Set(['failed', 'interrupted', 'quality_failed', 'blocked_capability', 'missing_references']);
  const KIND = job => job?.brief?.kind || job?.kind || '';

  function load(storage = globalThis.localStorage) {
    try {
      const value = JSON.parse(storage.getItem(STORAGE_KEY) || 'null');
      return value && typeof value.id === 'string' && Number.isFinite(Date.parse(value.startedAt)) ? value : null;
    } catch { return null; }
  }

  function start(storage = globalThis.localStorage, now = new Date().toISOString()) {
    const batch = { id: `review-${Date.parse(now).toString(36)}`, startedAt: new Date(now).toISOString() };
    storage.setItem(STORAGE_KEY, JSON.stringify(batch));
    return batch;
  }

  function end(storage = globalThis.localStorage) {
    storage.removeItem(STORAGE_KEY);
  }

  function selectJobs(jobs, batch) {
    if (!batch) return [...jobs];
    const since = Date.parse(batch.startedAt);
    return jobs.filter(job => Number.isFinite(Date.parse(job.createdAt)) && Date.parse(job.createdAt) >= since);
  }

  function stateFor(job) {
    if (!job) return 'waiting';
    if (job.status === 'awaiting_review') return 'review';
    if (ACTIVE.has(job.status)) return 'working';
    if (NEEDS_ATTENTION.has(job.status)) return 'redo';
    if (['completed', 'rejected', 'cancelled'].includes(job.status)) return 'done';
    return 'queued';
  }

  function summarize(jobs) {
    const latestByKind = new Map();
    for (const job of jobs) {
      const kind = KIND(job);
      const prior = latestByKind.get(kind);
      if (!prior || Date.parse(job.createdAt) > Date.parse(prior.createdAt)) latestByKind.set(kind, job);
    }
    return PIPELINES.map(pipeline => {
      const job = latestByKind.get(pipeline.kind) || null;
      return { ...pipeline, job, state: stateFor(job) };
    });
  }

  function counts(cards) {
    return {
      readyForReview: cards.filter(card => card.state === 'review').length,
      working: cards.filter(card => card.state === 'working' || card.state === 'queued').length,
      redo: cards.filter(card => card.state === 'redo').length,
      waiting: cards.filter(card => card.state === 'waiting').length,
    };
  }

  return { STORAGE_KEY, PIPELINES, load, start, end, selectJobs, stateFor, summarize, counts };
});
