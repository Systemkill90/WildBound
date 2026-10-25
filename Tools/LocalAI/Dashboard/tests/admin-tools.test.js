'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parseAdminCommand, getAdminStatus, CHAT_TOOLS, executeAdminTool } = require('../admin-tools');

test('admin parser accepts only documented fixed commands', () => {
  assert.equal(parseAdminCommand('/admin status'), 'status');
  assert.equal(parseAdminCommand('  /ADMIN   HELP  '), 'help');
  assert.equal(parseAdminCommand('/admin run powershell'), null);
  assert.equal(parseAdminCommand('/admin status; format c:'), null);
  assert.equal(parseAdminCommand('status'), null);
});

test('admin status is read-only and returns bounded machine diagnostics', () => {
  const status = getAdminStatus();
  assert.match(status.os, /^[a-z0-9]+ [\d.]+$/i);
  assert.ok(Number.isInteger(status.cpuCores) && status.cpuCores > 0);
  assert.ok(status.memory.totalBytes > 0);
  assert.deepEqual(status.drives.map(drive => drive.drive), ['C:', 'D:', 'E:', 'F:', 'G:']);
  assert.match(status.privileges, /read-only/i);
  assert.equal(Object.hasOwn(status, 'username'), false);
  assert.equal(Object.hasOwn(status, 'computerName'), false);
});

test('assistant can request only the fixed read-only admin tool set', async () => {
  assert.deepEqual(CHAT_TOOLS.map(tool => tool.function.name), [
    'get_system_status', 'get_pagefile_status', 'get_wildbound_project_status', 'get_local_ai_status'
  ]);
  await assert.rejects(() => executeAdminTool('run_powershell', {}), /not allowlisted/i);
  const pagefile = await executeAdminTool('get_pagefile_status', {});
  assert.equal(typeof pagefile.automaticManagedPagefile, 'boolean');
  assert.ok(Array.isArray(pagefile.pagingFiles));
});
