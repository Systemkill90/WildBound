'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {run}=require('./process');

function atomic(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});const temp=file+'.'+crypto.randomUUID()+'.tmp';fs.writeFileSync(temp,JSON.stringify(value,null,2));fs.renameSync(temp,file);}
function inside(root,target){const base=path.resolve(root),resolved=path.resolve(target),relative=path.relative(base,resolved);if(relative.startsWith('..')||path.isAbsolute(relative))throw new Error('Action path is outside its approved workspace.');return resolved;}

class LocalProductionManager{
  constructor({repoRoot,garageRoot,dashboardRoot,nasRoot,auditRoot,executor=run}){
    this.repoRoot=path.resolve(repoRoot);this.garageRoot=path.resolve(garageRoot);this.dashboardRoot=path.resolve(dashboardRoot);this.nasRoot=nasRoot?path.resolve(nasRoot):null;this.auditRoot=path.resolve(auditRoot);this.executor=executor;this.active=null;fs.mkdirSync(this.auditRoot,{recursive:true});
  }
  actions(){
    const tests=fs.existsSync(path.join(this.garageRoot,'tests'))?fs.readdirSync(path.join(this.garageRoot,'tests')).filter(x=>x.endsWith('.test.js')).sort().map(x=>path.join('tests',x)):[];
    const result=[
      {id:'repository-status',name:'Inspect repository status',write:false,approvalRequired:false,exe:'git.exe',args:['status','--short','--branch'],cwd:this.repoRoot,timeout:30_000},
      {id:'garage-tests',name:'Run bounded Garage tests',write:false,approvalRequired:false,exe:process.execPath,args:['--test',...tests],cwd:this.garageRoot,timeout:180_000}
    ];
    if(this.nasRoot){
      const localRoot=path.dirname(this.dashboardRoot),source=path.join(localRoot,'Garage','runtime','character-reviews'),destination=path.join(path.dirname(this.nasRoot),'Character-Production','Female-Homesteader'),script=inside(this.repoRoot,path.join(this.repoRoot,'Tools','Archive-GarageCharacterSession.ps1'));
      result.push({id:'archive-character-evidence',name:'Archive character evidence to private NAS',write:true,approvalRequired:true,confirmation:'archive-character-evidence',exe:'powershell.exe',args:['-NoProfile','-ExecutionPolicy','Bypass','-File',script,'-SourceRoot',source,'-DestinationRoot',destination,'-SessionName','garage-character-evidence'],cwd:this.repoRoot,timeout:300_000});
    }
    return result;
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
  status(){return {ready:true,active:this.active,actions:this.publicActions(),history:this.history()};}
}
module.exports={LocalProductionManager,inside};
