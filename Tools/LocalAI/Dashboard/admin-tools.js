'use strict';

const os = require('node:os');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');

const ALLOWED_COMMANDS = new Set(['/admin help', '/admin status']);
const CHECKED_DRIVES = Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index) + ':\\').filter(drive => fs.existsSync(drive));
const CHAT_TOOLS = [
  { type: 'function', function: { name: 'get_system_status', description: 'Read CPU, memory, and free space for local drives when the user asks about this PC or its storage. Read-only.', parameters: { type: 'object', properties: {}, additionalProperties: false } } },
  { type: 'function', function: { name: 'get_pagefile_status', description: 'Read the current Windows automatic pagefile setting and configured pagefile paths when the user asks about virtual memory or the pagefile. Read-only.', parameters: { type: 'object', properties: {}, additionalProperties: false } } },
  { type: 'function', function: { name: 'get_wildbound_project_status', description: 'Read whether the WildBound workspace is available and list its current Git changes when the user asks about project or repository status. Read-only.', parameters: { type: 'object', properties: {}, additionalProperties: false } } },
  { type: 'function', function: { name: 'get_local_ai_status', description: 'Check whether the local Ollama service responds and which model names it exposes when the user asks about LocalAI. Read-only.', parameters: { type: 'object', properties: {}, additionalProperties: false } } }
];

function parseAdminCommand(value) {
  const command = String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
  return ALLOWED_COMMANDS.has(command) ? command.slice('/admin '.length) : null;
}

function getAdminStatus() {
  const drives = CHECKED_DRIVES.map(path => {
    try {
      const stat = fs.statfsSync(path);
      return { drive: path.slice(0, 2), available: true, freeBytes: stat.bavail * stat.bsize, totalBytes: stat.blocks * stat.bsize };
    } catch {
      return { drive: path.slice(0, 2), available: false };
    }
  });
  return {
    os: `${os.platform()} ${os.release()}`,
    cpuCores: os.cpus().length,
    memory: { totalBytes: os.totalmem(), freeBytes: os.freemem() },
    drives,
    privileges: 'No elevation requested; this report uses read-only system queries.'
  };
}

function getPagefileStatus() {
  const command = "$computer=Get-CimInstance Win32_ComputerSystem; $paging=(Get-ItemProperty -LiteralPath 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management').PagingFiles; [pscustomobject]@{AutomaticManagedPagefile=$computer.AutomaticManagedPagefile; PagingFiles=@($paging)} | ConvertTo-Json -Compress -Depth 3";
  const output = execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', command], { encoding: 'utf8', timeout: 10_000, windowsHide: true, maxBuffer: 32_000 });
  const value = JSON.parse(output.trim());
  return { automaticManagedPagefile: Boolean(value.AutomaticManagedPagefile), pagingFiles: Array.isArray(value.PagingFiles) ? value.PagingFiles : [] };
}

function getProjectStatus(repoRoot) {
  const available = fs.existsSync(repoRoot);
  if (!available) return { available: false, gitAvailable: false, changedFiles: [] };
  try {
    const text = execFileSync('git', ['-C', repoRoot, 'status', '--short'], { encoding: 'utf8', timeout: 5_000, windowsHide: true, maxBuffer: 64_000 });
    return { available: true, gitAvailable: true, changedFiles: text.split(/\r?\n/).filter(Boolean).slice(0, 40) };
  } catch {
    return { available: true, gitAvailable: false, changedFiles: [] };
  }
}

async function getLocalAiStatus(ollamaBase, defaultModel) {
  try {
    const response = await fetch(`${ollamaBase}/api/tags`, { signal: AbortSignal.timeout(2_000) });
    if (!response.ok) return { available: false, defaultModel, models: [] };
    const payload = await response.json();
    const models = (payload.models || []).map(model => model.name).filter(Boolean);
    return { available: true, defaultModel, models, defaultModelAvailable: models.includes(defaultModel) };
  } catch {
    return { available: false, defaultModel, models: [] };
  }
}

async function executeAdminTool(name, { repoRoot, ollamaBase, defaultModel }) {
  switch (name) {
    case 'get_system_status': return getAdminStatus();
    case 'get_pagefile_status': return getPagefileStatus();
    case 'get_wildbound_project_status': return getProjectStatus(repoRoot);
    case 'get_local_ai_status': return getLocalAiStatus(ollamaBase, defaultModel);
    default: throw new Error('Tool is not allowlisted.');
  }
}

module.exports = { parseAdminCommand, getAdminStatus, CHAT_TOOLS, executeAdminTool };
