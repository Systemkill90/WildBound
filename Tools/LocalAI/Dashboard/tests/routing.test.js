'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { classifyTask } = require('../routing');

test('routes bounded repository searches and inspection locally', () => {
  assert.equal(classifyTask('Find the player input bindings and cite source files.').route, 'local');
  assert.equal(classifyTask('Inspect the movement code and summarize the controls.').route, 'local');
});

test('routes documentation and asset inventory locally', () => {
  assert.equal(classifyTask('Draft a concise handoff from the current state docs.').route, 'local');
  assert.equal(classifyTask('Make an asset inventory for the existing biome files.').route, 'local');
});

test('keeps verification, architecture, and risky changes in Codex', () => {
  assert.equal(classifyTask('Compile and package Wildbound, then verify the launch.').route, 'codex');
  assert.equal(classifyTask('Design the multiplayer replication architecture.').route, 'codex');
  assert.equal(classifyTask('Delete the old game assets and migrate everything.').route, 'codex');
});

test('keeps evaluative, cross-category synthesis in Codex', () => {
  assert.equal(classifyTask('Distinguish provenance groups across the Greenveil asset inventory.').category, 'judgment-heavy');
  assert.equal(classifyTask('Compare the Greenveil asset sources and recommend what to use.').route, 'codex');
  assert.equal(classifyTask('Summarize CURRENT-STATE and SESSION-HANDOFF into a resume note.').category, 'cross-source-synthesis');
  assert.equal(classifyTask('Summarize docs/project/CURRENT-STATE.md and docs/project/SESSION-HANDOFF.md.').route, 'codex');
  assert.equal(classifyTask('Summarize docs/project/CURRENT-STATE.md in three bullets.').route, 'local');
});

test('routes ambiguous or oversized assignments to Codex', () => {
  assert.equal(classifyTask('Make Wildbound better.').route, 'codex');
  assert.equal(classifyTask('x'.repeat(4_001)).route, 'codex');
});

test('high-risk keywords take precedence over local-friendly keywords', () => {
  assert.equal(classifyTask('Inspect and fix the multiplayer replication architecture.').route, 'codex');
});
