'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { EventEmitter } = require('node:events');
const TYPES = ['auto', 'texture', 'voice', 'music', 'ambience', 'model'];
const STEPS = ['Brief', 'Specialist', 'Production', 'Technical review', 'Art review', 'Unreal import', 'Engine verification'];
const TEAMS = [
  { id: 'production-director', name: 'Production director', engine: 'Qwen · local AI', role: 'Turns a prompt into a typed brief, records requirements, and routes it to the right specialist.' },
  { id: 'visual-artist', name: 'Visual artist', engine: 'Qwen + DreamShaper XL', role: 'Turns approved art guidance and the production brief into a texture generation prompt.' },
  { id: 'sound-designer', name: 'Sound designer', engine: 'Qwen + ACE-Step / Kokoro', role: 'Creates instrumental music, musical ambience, or spoken dialogue using the matching local backend.' },
  { id: 'technical-artist', name: 'Technical artist', engine: 'Blender · tool worker', role: 'Inspects supplied GLB/FBX models, preserves a source copy, and prepares engine geometry.' },
  { id: 'asset-inspector', name: 'Asset inspector', engine: 'File validators · tool worker', role: 'Checks structure, dimensions, duration, topology counts, file hashes, and reviewed bytes.' },
  { id: 'unreal-integrator', name: 'Unreal integrator', engine: 'Unreal Python · tool worker', role: 'Imports approved assets and verifies their Unreal classes and saved packages.' }
];
const AGENT_BY_ID = new Map(TEAMS.map(agent => [agent.id, agent]));
const STAGE_AGENTS = ['production-director', 'specialist', 'specialist', 'asset-inspector', 'owner-review', 'unreal-integrator', 'unreal-integrator'];
function atomic(file, data) { fs.mkdirSync(path.dirname(file), {recursive:true}); const tmp=file+'.tmp'; fs.writeFileSync(tmp, JSON.stringify(data,null,2)); fs.renameSync(tmp,file); }
function validateRequest(data) {
  if (!data || typeof data.prompt!=='string' || !data.prompt.trim() || data.prompt.length>4000) throw new Error('Enter a production prompt of 1–4,000 characters.');
  const kind=data.kind || 'auto'; if (!TYPES.includes(kind)) throw new Error('Unsupported asset type.');
  if (data.sourcePath && (typeof data.sourcePath!=='string' || !/\.(glb|fbx)$/i.test(data.sourcePath))) throw new Error('Model sources must be GLB or FBX files.');
  return {prompt:data.prompt.trim(),kind,biome:String(data.biome||'greenveil').slice(0,60),sourcePath:data.sourcePath||null,voice:['af_bella','af_nicole','am_adam'].includes(data.voice)?data.voice:'af_bella',seconds:Math.max(4,Math.min(20,Number(data.seconds)||8))};
}
class Pipeline extends EventEmitter {
  constructor(root, adapters) {
    super(); this.root=root;this.adapters=adapters;this.jobs=new Map();this.active=null;this.controller=null;this.closed=false;this.shuttingDown=false;
    fs.mkdirSync(root,{recursive:true});
    for(const name of fs.readdirSync(root)) {
      if(!/^[0-9a-f-]{36}$/.test(name))continue;
      try {const j=JSON.parse(fs.readFileSync(path.join(root,name,'job.json'),'utf8'));
        if(['running','queued','cancelling','importing'].includes(j.status)){j.status='interrupted';j.error='The application stopped during this task. Inspect its saved outputs before retrying.';for(const s of j.steps)if(s.status==='running')s.status='interrupted';atomic(path.join(root,name,'job.json'),j);}this.jobs.set(j.id,j);
      }catch(error){this.emit('warning',error.message);}
    }
  }
  file(j){return path.join(this.root,j.id,'job.json');}
  save(j){j.updatedAt=new Date().toISOString();atomic(this.file(j),j);this.emit('change',j);}
  list(){return [...this.jobs.values()].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
  get(id){const j=this.jobs.get(id);if(!j)throw new Error('Task not found.');return j;}
  create(data){if(this.closed)throw new Error('Production is shutting down.');if(this.list().filter(j=>j.status==='queued').length>=20)throw new Error('The production queue is full.');const request=validateRequest(data);const id=crypto.randomUUID();const j={id,...request,status:'queued',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),steps:STEPS.map(name=>({name,status:'pending',agentId:STAGE_AGENTS[STEPS.indexOf(name)]})),agentRuns:[],events:[],brief:null,artifact:null,engine:null,error:null,usage:[]};this.jobs.set(id,j);this.save(j);void this.pump();return j;}
  async stage(j,n,work,agentId){if(this.controller.signal.aborted)throw new Error('Cancelled');const step=j.steps[n],agent=AGENT_BY_ID.get(agentId)||{id:agentId,name:agentId};const run={id:crypto.randomUUID(),agentId:agent.id,agentName:agent.name,step:step.name,status:'running',startedAt:new Date().toISOString()};j.agentRuns.push(run);step.agentId=agent.id;step.status='running';step.startedAt=run.startedAt;this.save(j);try{const out=await work(this.controller.signal);if(this.controller.signal.aborted)throw new Error('Cancelled');run.status='completed';run.completedAt=new Date().toISOString();run.summary=stageSummary(out);step.status='completed';step.completedAt=run.completedAt;this.save(j);return out;}catch(error){run.status=this.controller.signal.aborted?(j.cancelRequested?'cancelled':this.shuttingDown?'interrupted':'failed'):'failed';run.completedAt=new Date().toISOString();run.error=String(error.message||error).slice(0,500);step.status=run.status;step.error=run.error;this.save(j);throw error;}}
  async pump(){if(this.active||this.closed)return;const j=this.list().reverse().find(x=>x.status==='queued');if(!j)return;this.active=j.id;this.controller=new AbortController();this.emit('active',j);j.status='running';this.save(j);
    const timer=setTimeout(()=>this.controller?.abort(new Error('Production exceeded its 30-minute deadline.')),30*60_000);timer.unref();
    try {
      if(!j.artifact){
        j.brief=await this.stage(j,0,s=>this.adapters.brief(j,s),'production-director');this.save(j);
        if(j.brief.kind==='model'&&!j.sourcePath){j.status='needs_source';j.error='No local 3D generation or auto-rigging model is installed. Attach an approved GLB/FBX source to continue this model task.';this.save(j);return;}
        const specialistId=j.brief.kind==='texture'?'visual-artist':['voice','music','ambience'].includes(j.brief.kind)?'sound-designer':'technical-artist';
        j.spec=await this.stage(j,1,s=>this.adapters.specialist(j,s),specialistId);this.save(j);
        j.artifact=await this.stage(j,2,s=>this.adapters.produce(j,s),specialistId);this.save(j);
        j.checks=await this.stage(j,3,s=>this.adapters.inspect(j,s),'asset-inspector');this.save(j);
      }
      if(!j.approvedAt){j.status='awaiting_review';j.steps[4].status='awaiting_review';this.save(j);return;}
      j.status='importing';this.save(j);
      // Recheck immutable reviewed bytes before engine writes.
      await this.stage(j,3,s=>this.adapters.inspect(j,s,true),'asset-inspector');
      j.engine=await this.stage(j,5,s=>this.adapters.import(j,s),'unreal-integrator');this.save(j);
      j.verification=await this.stage(j,6,s=>this.adapters.verify(j,s),'unreal-integrator');
      j.status='completed';j.completedAt=new Date().toISOString();this.save(j);
    }catch(error){j.status=this.controller.signal.aborted?(j.cancelRequested?'cancelled':this.shuttingDown?'interrupted':'failed'):'failed';j.error=this.controller.signal.aborted?String(this.controller.signal.reason?.message||'Cancelled'):error.message;for(const s of j.steps)if(s.status==='running'){s.status=j.status;s.error=j.error;}for(const run of j.agentRuns||[])if(run.status==='running'){run.status=j.status;run.error=j.error;run.completedAt=new Date().toISOString();}this.save(j);}
    finally{clearTimeout(timer);await this.adapters.release?.(j).catch(()=>{});this.active=null;this.controller=null;this.emit('idle',j);setImmediate(()=>void this.pump());}
  }
  approve(id){const j=this.get(id);if(j.status!=='awaiting_review')throw new Error('Only an asset awaiting review can be approved.');j.approvedAt=new Date().toISOString();j.steps[4].status='completed';j.steps[4].completedAt=j.approvedAt;j.error=null;j.status='queued';this.save(j);void this.pump();return j;}
  reject(id){const j=this.get(id);if(j.status!=='awaiting_review')throw new Error('Only an asset awaiting review can be rejected.');j.status='rejected';j.steps[4].status='rejected';this.save(j);return j;}
  attach(id,sourcePath){const j=this.get(id);if(j.status!=='needs_source')throw new Error('This task is not waiting for a model.');validateRequest({...j,sourcePath});j.sourcePath=sourcePath;j.error=null;j.status='queued';this.save(j);void this.pump();return j;}
  cancel(id){const j=this.get(id);if(!['queued','running','importing','awaiting_review','needs_source'].includes(j.status))throw new Error('This task cannot be cancelled.');j.cancelRequested=true;if(this.active===id){j.status='cancelling';this.save(j);this.controller.abort(new Error('Cancelled by the owner.'));}else{j.status='cancelled';this.save(j);}return j;}
  retryImport(id){const j=this.get(id);if(!['failed','interrupted'].includes(j.status)||!j.artifact||!j.approvedAt)throw new Error('This task has no approved asset to retry importing.');j.status='queued';j.error=null;j.cancelRequested=false;this.save(j);void this.pump();return j;}
  async shutdown(){this.closed=true;this.shuttingDown=true;if(this.controller)this.controller.abort(new Error('Garage is closing. The task was saved and can be reviewed or retried after restart.'));while(this.active)await new Promise(r=>setTimeout(r,100));}
}
function stageSummary(value){if(!value||typeof value!=='object')return String(value||'').slice(0,240);const fields=['kind','name','summary','width','height','format','seconds','sampleRate','bitDepth','channels','triangles','meshes','armatures','verified','sha256'];const result={};for(const key of fields)if(value[key]!==undefined)result[key]=value[key];return result;}
module.exports={Pipeline,TEAMS,TYPES,STEPS,AGENT_BY_ID,validateRequest,atomic,stageSummary};
