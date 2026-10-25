'use strict';

const POLICY_VERSION = '2026-10-22-v3';

const CLOUD_ONLY = [
  /\barchitect(?:ure|ural)?\b/i,
  /\b(re-?design|rewrite|migration|refactor the system)\b/i,
  /\b(security|authentication|authorization|credential|secret|license|legal|purchase)\b/i,
  /\b(multiplayer|replication|netcode|persistence|save system|online service)\b/i,
  /\b(compile|build|package|launch|deploy|release|publish|commit|push)\b/i,
  /\b(performance|optimization|profil(?:e|ing)|crash|blocker|regression)\b/i,
  /\b(destructive|delete|remove|move|rename|overwrite|replace|mass edit)\b/i,
  /\b(final review|critical change|full project|whole codebase|fix everything)\b/i
];

const JUDGMENT_HEAVY = /\b(provenance|ownership|redistribution|classification|classify|distinguish|compare|synthesi[sz]e|reconcile|assess|evaluate|rank|recommend)\b/i;
const CROSS_SOURCE_SYNTHESIS = /\b(summar(?:y|ize|ise)|draft|handoff|compare|reconcile|synthesi[sz]e|combine)\b/i;

const LOCAL_TASKS = [
  ['search', /\b(search|find|locate|look up)\b/i],
  ['inspection', /\b(inspect|summari[sz]e|explain|inventory|list|trace)\b/i],
  ['documentation', /\b(documentation|docs?|handoff|changelog|draft|proofread|format)\b/i],
  ['routine-maintenance', /\b(routine|repetitive|asset organization|asset inventory|simple script|bounded script|small isolated)\b/i]
];

function classifyTask(value) {
  const task = String(value || '').trim();
  if (!task) return { route: 'codex', category: 'empty', reason: 'The assignment is empty.', policyVersion: POLICY_VERSION };
  if (task.length > 4_000) return { route: 'codex', category: 'large-context', reason: 'The assignment is too large for the bounded local handoff.', policyVersion: POLICY_VERSION };
  const risk = CLOUD_ONLY.find(pattern => pattern.test(task));
  if (risk) return { route: 'codex', category: 'high-risk-or-verification', reason: 'This assignment involves a high-risk change or requires authoritative build, runtime, performance, or release verification.', policyVersion: POLICY_VERSION };
  if (CROSS_SOURCE_SYNTHESIS.test(task) && namedSourceCount(task) > 1) return { route: 'codex', category: 'cross-source-synthesis', reason: 'This assignment synthesizes multiple named sources; keep it in Codex to reduce context omissions and cross-source attribution errors.', policyVersion: POLICY_VERSION };
  if (JUDGMENT_HEAVY.test(task)) return { route: 'codex', category: 'judgment-heavy', reason: 'This requires cross-category classification or evaluative judgment; keep it in Codex and avoid an unreliable local first pass.', policyVersion: POLICY_VERSION };
  const match = LOCAL_TASKS.find(([, pattern]) => pattern.test(task));
  if (match) return { route: 'local', category: match[0], reason: 'This is a bounded research, documentation, inventory, or routine maintenance assignment; Codex must review any proposed change.', policyVersion: POLICY_VERSION };
  return { route: 'codex', category: 'ambiguous', reason: 'The request does not clearly fit a reliable local task category.', policyVersion: POLICY_VERSION };
}

function namedSourceCount(task) {
  const names = new Set();
  for (const match of task.matchAll(/\b[\w.-]+\.(?:md|txt|cpp|c|h|hpp|ini|json|py|ps1|bat|cmd)\b/gi)) names.add(match[0].replace(/\.[^.]+$/, '').toLowerCase());
  for (const match of task.matchAll(/\b[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+\b/g)) names.add(match[0].toLowerCase());
  return names.size;
}

module.exports = { classifyTask, POLICY_VERSION };
