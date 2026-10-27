'use strict';

const JOB_ID_SEGMENT = '[A-Za-z0-9][A-Za-z0-9._-]{0,99}';
const JOB_ID_PATTERN = new RegExp(`^${JOB_ID_SEGMENT}$`);

function normalizeJobId(value, fallback) {
  const id = String(value || fallback || '');
  if (!JOB_ID_PATTERN.test(id)) throw new Error('Task ID must be 1-100 letters, numbers, dots, underscores, or hyphens.');
  return id;
}

module.exports = { JOB_ID_SEGMENT, normalizeJobId };
