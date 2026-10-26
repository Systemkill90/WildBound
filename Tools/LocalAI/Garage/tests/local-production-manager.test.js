'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {LocalProductionManager,inside}=require('../src/local-production-manager');

function fixture(executor=async()=> 'ok',planner=null){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'wildbound-manager-')),repo=path.join(root,'repo'),garage=path.join(repo,'Tools','LocalAI','Garage'),dashboard=path.join(root,'local','Dashboard'),nas=path.join(root,'nas','CreativeLibrary');
  for(const dir of [path.join(garage,'tests'),dashboard,nas])fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(repo,'Tools','Archive-GarageCharacterSession.ps1'),'# fixture');
  fs.writeFileSync(path.join(repo,'Tools','Test-MetaHumanFoundation.ps1'),'# fixture');
  fs.writeFileSync(path.join(repo,'Wildbound.uproject'),'{}');
  fs.writeFileSync(path.join(garage,'tests','sample.test.js'),'');
  return new LocalProductionManager({repoRoot:repo,garageRoot:garage,dashboardRoot:dashboard,engineRoot:path.join(root,'engine'),nasRoot:nas,auditRoot:path.join(root,'audit'),executor,planner});
}

test('exposes only fixed actions without command details',()=>{const manager=fixture();const actions=manager.publicActions();assert.deepEqual(actions.map(x=>x.id),['repository-status','garage-tests','metahuman-foundation-preflight','archive-character-evidence']);assert.ok(actions.every(x=>!('exe'in x)&&!('args'in x)&&!('cwd'in x)));});
test('dry run writes an audit record without invoking the executor',async()=>{let calls=0;const manager=fixture(async()=>{calls++;});const result=await manager.execute('repository-status');assert.equal(result.status,'planned');assert.equal(calls,0);assert.equal(manager.history().length,1);});
test('write action requires explicit confirmation and records execution',async()=>{let calls=0;const manager=fixture(async()=>{calls++;return 'verified';});await assert.rejects(manager.execute('archive-character-evidence',{dryRun:false}),/explicit owner approval/);const result=await manager.execute('archive-character-evidence',{dryRun:false,confirmation:'archive-character-evidence'});assert.equal(result.status,'completed');assert.equal(calls,1);assert.match(result.output,/verified/);});
test('workspace guard rejects traversal',()=>{assert.throws(()=>inside('D:\\repo','D:\\other\\file'),/outside/);});
test('local planner can select only a registered read-only action',async()=>{let executions=0;const manager=fixture(async()=>{executions++;},async()=>({content:{actionId:'repository-status',reason:'The request asks for repository state.'},model:'local-test',promptTokens:12,responseTokens:8}));const plan=await manager.plan('Show repository status');assert.equal(plan.actionId,'repository-status');assert.equal(plan.approvalRequired,false);assert.equal(executions,0);});
test('local planner flags a registered write action for separate approval',async()=>{const manager=fixture(undefined,async()=>({content:{actionId:'archive-character-evidence',reason:'Archive requested.'}}));const plan=await manager.plan('Archive character evidence');assert.equal(plan.actionId,'archive-character-evidence');assert.equal(plan.approvalRequired,true);});
test('local planner cannot invent an executable action',async()=>{const manager=fixture(undefined,async()=>({content:{actionId:'delete-everything',reason:'bad'}}));await assert.rejects(manager.plan('Do something'),/outside the fixed registry/);});
