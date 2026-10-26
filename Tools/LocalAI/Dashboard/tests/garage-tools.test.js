'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');

test('Workshop MCP exposes the shared Garage production workflow to Codex',()=>{
  const server=path.resolve(__dirname,'..','workshop-mcp.js');
  const message=JSON.stringify({jsonrpc:'2.0',id:1,method:'tools/list'})+'\n';
  const result=spawnSync(process.execPath,[server],{input:message,encoding:'utf8',windowsHide:true,timeout:10_000});
  assert.equal(result.status,0,result.stderr);
  const response=JSON.parse(result.stdout.trim());
  const tools=new Map(response.result.tools.map(tool=>[tool.name,tool]));
  for(const name of ['wildbound_garage_status','wildbound_garage_library_status','wildbound_garage_sync_library','wildbound_garage_reference_package','wildbound_garage_list_tasks','wildbound_garage_submit_task','wildbound_garage_get_task','wildbound_garage_cancel_task','wildbound_garage_attach_model','wildbound_garage_approve_task','wildbound_garage_reject_task','wildbound_garage_retry_import'])assert.ok(tools.has(name),`Missing MCP tool: ${name}`);
  assert.match(tools.get('wildbound_garage_approve_task').description,/only when the user explicitly asks/i);
  assert.match(tools.get('wildbound_garage_submit_task').description,/pauses for the owner to review/i);
});

test('dashboard exposes the same Production Team queue to its local UI',()=>{
  const html=fs.readFileSync(path.resolve(__dirname,'..','index.html'),'utf8');
  const app=fs.readFileSync(path.resolve(__dirname,'..','app.js'),'utf8');
  const studio=fs.readFileSync(path.resolve(__dirname,'..','production-studio.js'),'utf8');
  assert.match(html,/id="productionStudioButton"/);
  assert.match(html,/id="productionStudioView"/);
  assert.match(app,/showView\('production-studio'\)/);
  for(const action of ['approve','reject','cancel','retry-import','attach'])assert.ok(studio.includes(action),`UI is missing the ${action} action.`);
  assert.match(html,/id="localManagerActions"/);
  assert.match(studio,/local-manager\/run/);
  assert.match(studio,/local-manager\/plan/);
});
