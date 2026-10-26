'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {run}=require('./process');

function atomic(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});const temp=file+'.'+crypto.randomUUID()+'.tmp';fs.writeFileSync(temp,JSON.stringify(value,null,2));fs.renameSync(temp,file);}
function inside(root,target){const base=path.resolve(root),resolved=path.resolve(target),relative=path.relative(base,resolved);if(relative.startsWith('..')||path.isAbsolute(relative))throw new Error('Action path is outside its approved workspace.');return resolved;}

class LocalProductionManager{
  constructor({repoRoot,garageRoot,dashboardRoot,runtimeRoot=null,engineRoot=null,nasRoot,auditRoot,model='qwen3.5:9b',executor=run,planner=null}){
    this.repoRoot=path.resolve(repoRoot);this.garageRoot=path.resolve(garageRoot);this.dashboardRoot=path.resolve(dashboardRoot);this.runtimeRoot=runtimeRoot?path.resolve(runtimeRoot):path.dirname(this.dashboardRoot);this.engineRoot=engineRoot?path.resolve(engineRoot):null;this.nasRoot=nasRoot?path.resolve(nasRoot):null;this.auditRoot=path.resolve(auditRoot);this.model=model;this.executor=executor;this.planner=planner;this.active=null;fs.mkdirSync(this.auditRoot,{recursive:true});this.recoverInterrupted();
  }
  atomicActions(){
    const tests=fs.existsSync(path.join(this.garageRoot,'tests'))?fs.readdirSync(path.join(this.garageRoot,'tests')).filter(x=>x.endsWith('.test.js')).sort().map(x=>path.join('tests',x)):[];
    const dashboardTests=fs.existsSync(path.join(this.dashboardRoot,'tests'))?fs.readdirSync(path.join(this.dashboardRoot,'tests')).filter(x=>x.endsWith('.test.js')).sort().map(x=>path.join('tests',x)):[];
    const readinessScript=inside(this.repoRoot,path.join(this.repoRoot,'Tools','LocalAI','Garage','src','asset-readiness.js')),jobsRoot=path.join(this.runtimeRoot,'Garage','runtime','jobs'),recordsRoot=path.join(this.repoRoot,'docs','creative-library','records'),reportsRoot=path.join(this.auditRoot,'reports');
    const readinessArgs=scope=>['--scope',scope,'--jobs-root',jobsRoot,'--records-root',recordsRoot,...(this.nasRoot?['--nas-root',this.nasRoot]:[]),'--output',path.join(reportsRoot,'asset-readiness-'+scope+'-latest.json')];
    const result=[
      {id:'repository-status',name:'Inspect repository status',write:false,approvalRequired:false,exe:'git.exe',args:['status','--short','--branch'],cwd:this.repoRoot,timeout:30_000},
      {id:'garage-tests',name:'Run bounded Garage tests',write:false,approvalRequired:false,exe:process.execPath,args:['--test',...tests],cwd:this.garageRoot,timeout:180_000},
      {id:'dashboard-tests',name:'Run bounded Dashboard tests',write:false,approvalRequired:false,exe:process.execPath,args:['--test',...dashboardTests],cwd:this.dashboardRoot,timeout:180_000},
      {id:'asset-artifact-readiness',name:'Verify generated artifact readiness',write:true,approvalRequired:false,detail:'Reads task artifacts and writes only a local audit report with file, size, checksum, preview, metadata, and review-state findings.',resultType:'asset-readiness',exe:process.execPath,args:[readinessScript,...readinessArgs('artifacts')],cwd:this.repoRoot,timeout:180_000},
      {id:'asset-reference-readiness',name:'Verify reference package readiness',write:true,approvalRequired:false,detail:'Reads version-pinned packages and writes only a local audit report covering approvals, conflicts, originals, and archive checksums.',resultType:'asset-readiness',exe:process.execPath,args:[readinessScript,...readinessArgs('references')],cwd:this.repoRoot,timeout:180_000}
    ];
    const projectFile=path.join(this.repoRoot,'Wildbound.uproject'),metaHumanCheck=path.join(this.repoRoot,'Tools','Test-MetaHumanFoundation.ps1');
    if(this.engineRoot&&fs.existsSync(metaHumanCheck)&&fs.existsSync(projectFile)){
      const prerequisite=this.metaHumanPrerequisite();
      result.push({id:'metahuman-foundation-preflight',name:'Verify MetaHuman foundation',write:false,approvalRequired:false,state:prerequisite.state,detail:prerequisite.detail,nextAction:prerequisite.nextAction,resultType:'metahuman-foundation',exe:'powershell.exe',args:['-NoProfile','-ExecutionPolicy','Bypass','-File',metaHumanCheck,'-EngineRoot',this.engineRoot,'-ProjectFile',projectFile],cwd:this.repoRoot,timeout:60_000});
    }
    if(this.nasRoot){
      const source=path.join(this.runtimeRoot,'Garage','runtime','character-reviews'),destination=path.join(path.dirname(this.nasRoot),'Character-Production','Female-Homesteader'),script=inside(this.repoRoot,path.join(this.repoRoot,'Tools','Archive-GarageCharacterSession.ps1'));
      result.push({id:'archive-character-evidence',name:'Archive character evidence to private NAS',write:true,approvalRequired:true,confirmation:'archive-character-evidence',exe:'powershell.exe',args:['-NoProfile','-ExecutionPolicy','Bypass','-File',script,'-SourceRoot',source,'-DestinationRoot',destination,'-SessionName','garage-character-evidence'],cwd:this.repoRoot,timeout:300_000});
    }
    return result;
  }
  actions(){
    const actions=this.atomicActions();
    actions.push({id:'garage-autopilot-check',name:'Run supervised Garage verification',write:false,approvalRequired:false,workflow:true,detail:'Runs repository status, Garage tests, and Dashboard tests once. It stops on the first failure and never retries automatically.',stepIds:['repository-status','garage-tests','dashboard-tests']});
    actions.push({id:'asset-readiness-review',name:'Build asset readiness review',write:true,approvalRequired:false,workflow:true,detail:'Checks generated artifacts, review metadata, approved references, accessible originals, and checksums. It writes local audit manifests only and never approves, imports, or publishes.',stepIds:['asset-artifact-readiness','asset-reference-readiness']});
    return actions;
  }
  metaHumanPrerequisite(){
    if(!this.engineRoot)return {id:'metahuman-core-data',name:'MetaHuman Creator Core Data',state:'unavailable',detail:'Unreal Engine is not configured for this Garage.',nextAction:'Configure the approved Unreal Engine installation.'};
    const plugin=path.join(this.engineRoot,'Engine','Plugins','MetaHuman','MetaHumanCharacter','MetaHumanCharacter.uplugin');
    const optional=path.join(this.engineRoot,'Engine','Plugins','MetaHuman','MetaHumanCharacter','Content','Optional');
    if(!fs.existsSync(plugin))return {id:'metahuman-core-data',name:'MetaHuman Creator Core Data',state:'unavailable',detail:'The MetaHuman Creator plugin is not installed in the configured engine.',nextAction:'Add the official MetaHuman Creator plugin through Epic Games Launcher.'};
    if(!fs.existsSync(optional))return {id:'metahuman-core-data',name:'MetaHuman Creator Core Data',state:'blocked',detail:'The plugin is installed, but its official Optional content is missing. Creator will run with limited features.',nextAction:'At the workstation, restart the Unreal Engine update in Epic Games Launcher, approve Windows UAC, then choose Verify again.'};
    const latest=this.latestMetaHumanResult();
    if(latest?.characterSaveMemoryReady===false){const allocated=Number(latest.pageFileAllocatedBytes||0)/1024**3,guardrail=Number(latest.characterSavePageFileGuardrailBytes||0)/1024**3;return {id:'metahuman-save-memory',name:'MetaHuman character-save memory',state:'blocked',detail:`Core Data is installed, but the Windows paging file is ${allocated.toFixed(1)} GiB; the post-crash project guardrail is ${guardrail.toFixed(0)} GiB.`,nextAction:'Increase Windows virtual-memory capacity, restart if required, then choose Verify again before creating another character asset.'};}
    return {id:'metahuman-core-data',name:'MetaHuman Creator Core Data',state:'ready',detail:'The official Optional content folder is present. Run the bounded verification before opening Creator.',nextAction:'Choose Verify again to record the full foundation check.'};
  }
  latestMetaHumanResult(){for(const name of fs.readdirSync(this.auditRoot).filter(x=>x.endsWith('.json')).sort().reverse()){try{const record=JSON.parse(fs.readFileSync(path.join(this.auditRoot,name),'utf8'));if(record.actionId==='metahuman-foundation-preflight'&&record.result)return record.result;}catch{}}return null;}
  publicActions(){const names=new Map(this.atomicActions().map(item=>[item.id,item.name]));return this.actions().map(({exe,args,cwd,confirmation,resultType,stepIds,...item})=>({...item,steps:(stepIds||[]).map(id=>({id,name:names.get(id)||id})),dryRunDefault:true}));}
  history(){return fs.readdirSync(this.auditRoot).filter(x=>x.endsWith('.json')).sort().slice(-20).reverse().map(name=>JSON.parse(fs.readFileSync(path.join(this.auditRoot,name),'utf8')));}
  recoverInterrupted(){for(const name of fs.readdirSync(this.auditRoot).filter(x=>x.endsWith('.json'))){const file=path.join(this.auditRoot,name);try{const record=JSON.parse(fs.readFileSync(file,'utf8'));if(record.status!=='running')continue;record.status='interrupted';record.completedAt=new Date().toISOString();record.error='The Garage stopped before this workflow completed. Completed steps remain recorded; no step was retried.';for(const step of record.steps||[])if(step.status==='running'){step.status='interrupted';step.completedAt=record.completedAt;}atomic(file,record);}catch{}}}
  auditFile(record){return path.join(this.auditRoot,record.startedAt.replaceAll(':','-')+'-'+record.id+'.json');}
  async runAtomic(action){const output=await this.executor(action.exe,action.args,{cwd:action.cwd,timeout:action.timeout});const result={output:String(output||'').slice(-8000)};if(['metahuman-foundation','asset-readiness'].includes(action.resultType)){try{result.result=JSON.parse(String(output||''));}catch{throw new Error(action.resultType==='asset-readiness'?'Asset readiness returned invalid JSON.':'MetaHuman foundation check returned invalid JSON.');}}if(action.resultType==='metahuman-foundation'&&result.result.readyForEditorValidation!==true){result.status='blocked';result.error='MetaHuman Creator Core Data is still missing or incomplete.';}else if(action.resultType==='metahuman-foundation'&&result.result.readyForCharacterSave===false){result.status='blocked';result.error='MetaHuman foundation is installed, but character-save virtual memory is below the project guardrail.';}return result;}
  async execute(id,{dryRun=true,confirmation=null}={}){
    if(this.active)throw new Error('The Local Production Manager is already running an action.');
    const action=this.actions().find(item=>item.id===id);if(!action)throw new Error('Unknown or unavailable local action.');
    if(action.approvalRequired&&confirmation!==action.confirmation)throw new Error('This write action requires explicit owner approval.');
    const atomics=new Map(this.atomicActions().map(item=>[item.id,item]));
    const record={schemaVersion:2,id:crypto.randomUUID(),type:action.workflow?'workflow':'action',actionId:action.id,name:action.name,write:action.write,dryRun:Boolean(dryRun),status:'planned',startedAt:new Date().toISOString(),steps:(action.stepIds||[]).map(stepId=>({actionId:stepId,name:atomics.get(stepId)?.name||stepId,status:'pending'}))};
    const auditFile=this.auditFile(record);
    if(dryRun){record.completedAt=new Date().toISOString();atomic(auditFile,record);return record;}
    this.active={id:record.id,actionId:record.actionId,name:record.name,startedAt:record.startedAt,currentStep:null,steps:record.steps};record.status='running';atomic(auditFile,record);
    try{
      if(action.workflow){
        for(const step of record.steps){const selected=atomics.get(step.actionId);if(!selected)throw new Error('Workflow contains an unavailable action.');step.status='running';step.startedAt=new Date().toISOString();this.active.currentStep=step.actionId;atomic(auditFile,record);try{const result=await this.runAtomic(selected);Object.assign(step,result);step.status=result.status||'completed';}catch(error){step.status='failed';step.error=String(error.message||error).slice(-2000);throw new Error('Workflow stopped at "'+step.name+'". The failure is saved in audit history; no retry was attempted.');}finally{step.completedAt=new Date().toISOString();atomic(auditFile,record);}if(step.status==='blocked'){record.status='blocked';record.error=step.error;break;}}
        if(record.status==='running')record.status='completed';
      }else{const result=await this.runAtomic(action);Object.assign(record,result);record.status=result.status||'completed';}
      return record;
    }
    catch(error){record.status='failed';record.error=String(error.message||error).slice(-2000);throw Object.assign(error,{managerRecord:record});}
    finally{record.completedAt=new Date().toISOString();atomic(auditFile,record);this.active=null;}
  }
  async plan(request){
    const task=String(request||'').trim();if(!task||task.length>500)throw new Error('Describe one local task in 500 characters or fewer.');
    const available=this.publicActions().map(({id,name,write,approvalRequired})=>({id,name,write,approvalRequired}));
    const invoke=this.planner||(async()=>{const response=await fetch('http://127.0.0.1:11434/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:this.model,stream:false,think:false,format:'json',keep_alive:'30m',options:{num_ctx:2048,num_predict:180,temperature:0},messages:[{role:'system',content:'You route one task to a fixed local action. Return only JSON: {"actionId":"one listed id or none","reason":"short factual reason"}. Never invent an action, command, path, approval, or completed result. A write action still requires separate owner approval. Available actions: '+JSON.stringify(available)},{role:'user',content:task}]}),signal:AbortSignal.timeout(90_000)});const value=await response.json();if(!response.ok)throw new Error(value.error||'Local planner is unavailable.');return {content:value.message?.content||'',model:value.model||this.model,promptTokens:value.prompt_eval_count??null,responseTokens:value.eval_count??null};});
    const result=await invoke({task,available});let parsed;try{parsed=typeof result.content==='string'?JSON.parse(result.content):result.content;}catch{throw new Error('Local planner returned invalid JSON. No action was selected.');}
    const actionId=String(parsed?.actionId||'none'),action=this.actions().find(item=>item.id===actionId);if(actionId!=='none'&&!action)throw new Error('Local planner selected an action outside the fixed registry.');
    const record={schemaVersion:1,id:crypto.randomUUID(),type:'plan',name:'Qwen local action plan',status:'completed',model:result.model||this.model,promptSha256:crypto.createHash('sha256').update(task).digest('hex'),actionId:action?.id||'none',reason:String(parsed?.reason||'').slice(0,300),approvalRequired:Boolean(action?.approvalRequired),usage:{promptTokens:result.promptTokens??null,responseTokens:result.responseTokens??null},startedAt:new Date().toISOString(),completedAt:new Date().toISOString()};
    atomic(path.join(this.auditRoot,record.startedAt.replaceAll(':','-')+'-'+record.id+'.json'),record);return record;
  }
  status(){return {ready:true,mode:'supervised-autopilot',planner:{available:true,model:this.model,authority:'select-fixed-action-or-workflow-only'},active:this.active,prerequisites:[this.metaHumanPrerequisite()],actions:this.publicActions(),history:this.history()};}
}
module.exports={LocalProductionManager,inside};
