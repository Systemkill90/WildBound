'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {run}=require('./process');

function atomic(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});const temp=file+'.'+crypto.randomUUID()+'.tmp';fs.writeFileSync(temp,JSON.stringify(value,null,2));fs.renameSync(temp,file);}
function inside(root,target){const base=path.resolve(root),resolved=path.resolve(target),relative=path.relative(base,resolved);if(relative.startsWith('..')||path.isAbsolute(relative))throw new Error('Action path is outside its approved workspace.');return resolved;}

class LocalProductionManager{
  constructor({repoRoot,garageRoot,dashboardRoot,engineRoot=null,nasRoot,auditRoot,model='qwen3.5:9b',executor=run,planner=null}){
    this.repoRoot=path.resolve(repoRoot);this.garageRoot=path.resolve(garageRoot);this.dashboardRoot=path.resolve(dashboardRoot);this.engineRoot=engineRoot?path.resolve(engineRoot):null;this.nasRoot=nasRoot?path.resolve(nasRoot):null;this.auditRoot=path.resolve(auditRoot);this.model=model;this.executor=executor;this.planner=planner;this.active=null;fs.mkdirSync(this.auditRoot,{recursive:true});
  }
  actions(){
    const tests=fs.existsSync(path.join(this.garageRoot,'tests'))?fs.readdirSync(path.join(this.garageRoot,'tests')).filter(x=>x.endsWith('.test.js')).sort().map(x=>path.join('tests',x)):[];
    const result=[
      {id:'repository-status',name:'Inspect repository status',write:false,approvalRequired:false,exe:'git.exe',args:['status','--short','--branch'],cwd:this.repoRoot,timeout:30_000},
      {id:'garage-tests',name:'Run bounded Garage tests',write:false,approvalRequired:false,exe:process.execPath,args:['--test',...tests],cwd:this.garageRoot,timeout:180_000}
    ];
    const projectFile=path.join(this.repoRoot,'Wildbound.uproject'),metaHumanCheck=path.join(this.repoRoot,'Tools','Test-MetaHumanFoundation.ps1');
    if(this.engineRoot&&fs.existsSync(metaHumanCheck)&&fs.existsSync(projectFile)){
      const prerequisite=this.metaHumanPrerequisite();
      result.push({id:'metahuman-foundation-preflight',name:'Verify MetaHuman foundation',write:false,approvalRequired:false,state:prerequisite.state,detail:prerequisite.detail,nextAction:prerequisite.nextAction,exe:'powershell.exe',args:['-NoProfile','-ExecutionPolicy','Bypass','-File',metaHumanCheck,'-EngineRoot',this.engineRoot,'-ProjectFile',projectFile],cwd:this.repoRoot,timeout:60_000});
    }
    if(this.nasRoot){
      const localRoot=path.dirname(this.dashboardRoot),source=path.join(localRoot,'Garage','runtime','character-reviews'),destination=path.join(path.dirname(this.nasRoot),'Character-Production','Female-Homesteader'),script=inside(this.repoRoot,path.join(this.repoRoot,'Tools','Archive-GarageCharacterSession.ps1'));
      result.push({id:'archive-character-evidence',name:'Archive character evidence to private NAS',write:true,approvalRequired:true,confirmation:'archive-character-evidence',exe:'powershell.exe',args:['-NoProfile','-ExecutionPolicy','Bypass','-File',script,'-SourceRoot',source,'-DestinationRoot',destination,'-SessionName','garage-character-evidence'],cwd:this.repoRoot,timeout:300_000});
    }
    return result;
  }
  metaHumanPrerequisite(){
    if(!this.engineRoot)return {id:'metahuman-core-data',name:'MetaHuman Creator Core Data',state:'unavailable',detail:'Unreal Engine is not configured for this Garage.',nextAction:'Configure the approved Unreal Engine installation.'};
    const plugin=path.join(this.engineRoot,'Engine','Plugins','MetaHuman','MetaHumanCharacter','MetaHumanCharacter.uplugin');
    const optional=path.join(this.engineRoot,'Engine','Plugins','MetaHuman','MetaHumanCharacter','Content','Optional');
    if(!fs.existsSync(plugin))return {id:'metahuman-core-data',name:'MetaHuman Creator Core Data',state:'unavailable',detail:'The MetaHuman Creator plugin is not installed in the configured engine.',nextAction:'Add the official MetaHuman Creator plugin through Epic Games Launcher.'};
    if(!fs.existsSync(optional))return {id:'metahuman-core-data',name:'MetaHuman Creator Core Data',state:'blocked',detail:'The plugin is installed, but its official Optional content is missing. Creator will run with limited features.',nextAction:'At the workstation, restart the Unreal Engine update in Epic Games Launcher, approve Windows UAC, then choose Verify again.'};
    return {id:'metahuman-core-data',name:'MetaHuman Creator Core Data',state:'ready',detail:'The official Optional content folder is present. Run the bounded verification before opening Creator.',nextAction:'Choose Verify again to record the full foundation check.'};
  }
  publicActions(){return this.actions().map(({exe,args,cwd,confirmation,...item})=>({...item,dryRunDefault:true}));}
  history(){return fs.readdirSync(this.auditRoot).filter(x=>x.endsWith('.json')).sort().slice(-20).reverse().map(name=>JSON.parse(fs.readFileSync(path.join(this.auditRoot,name),'utf8')));}
  async execute(id,{dryRun=true,confirmation=null}={}){
    if(this.active)throw new Error('The Local Production Manager is already running an action.');
    const action=this.actions().find(item=>item.id===id);if(!action)throw new Error('Unknown or unavailable local action.');
    if(action.approvalRequired&&confirmation!==action.confirmation)throw new Error('This write action requires explicit owner approval.');
    const record={schemaVersion:1,id:crypto.randomUUID(),actionId:action.id,name:action.name,write:action.write,dryRun:Boolean(dryRun),status:'planned',startedAt:new Date().toISOString()};
    if(dryRun){record.completedAt=new Date().toISOString();atomic(path.join(this.auditRoot,record.startedAt.replaceAll(':','-')+'-'+record.id+'.json'),record);return record;}
    this.active=record.id;record.status='running';
    try{const output=await this.executor(action.exe,action.args,{cwd:action.cwd,timeout:action.timeout});record.status='completed';record.output=String(output||'').slice(-8000);return record;}
    catch(error){record.status='failed';record.error=String(error.message||error).slice(-2000);throw Object.assign(error,{managerRecord:record});}
    finally{record.completedAt=new Date().toISOString();atomic(path.join(this.auditRoot,record.startedAt.replaceAll(':','-')+'-'+record.id+'.json'),record);this.active=null;}
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
  status(){return {ready:true,planner:{available:true,model:this.model,authority:'select-fixed-action-only'},active:this.active,prerequisites:[this.metaHumanPrerequisite()],actions:this.publicActions(),history:this.history()};}
}
module.exports={LocalProductionManager,inside};
