'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { EventEmitter } = require('node:events');
const {preflight,evaluate,isCharacterRequest}=require('./quality-supervisor');
const VOICES = require('../../Dashboard/voice-catalog.json').voices;
const VOICE_IDS = new Set(VOICES.map(voice=>voice.id));
const TYPES = ['auto', 'concept-art', 'texture', 'skybox', 'vfx-source', 'voice', 'music', 'ambience', 'sfx', 'text-to-3d', 'model', 'rigging', 'animation'];
const STEPS = ['Brief', 'Specialist', 'Production', 'Technical review', 'Art review', 'Unreal import', 'Engine verification', 'Recovery archive', 'Handoff'];
const TEAMS = [
  { id: 'production-director', name: 'Production director', engine: 'Qwen · local AI', role: 'Turns a prompt into a typed brief, records requirements, and routes it to the right specialist.' },
  { id: 'ai-librarian', name: 'AI Librarian', engine: 'Approved Creative Library · local service', role: 'Assembles version-pinned design references and pauses only work missing approved sources.' },
  { id: 'visual-artist', name: 'Material & texture artist', engine: 'Qwen + DreamShaper XL', role: 'Directs seamless material textures and visual surface details for game assets.' },
  { id: 'sound-designer', name: 'Sound designer & composer', engine: 'Qwen + ACE-Step', role: 'Creates the art direction for instrumental music and musical ambience.' },
  { id: 'sound-effects-designer', name: 'Sound-effects designer', engine: 'Qwen + Stable Audio 3', role: 'Designs one isolated, non-musical sound effect for the local SFX generator.' },
  { id: 'voice-director', name: 'Dialogue & voice director', engine: 'Qwen + Kokoro', role: 'Prepares dialogue text and delivery direction for offline character voice generation.' },
  { id: 'voice-actor', name: 'Voice actor & casting', engine: 'Kokoro · 28 local English voices', role: 'Casts a distinct local voice for each named character, records approved casting, and renders reviewable performances.' },
  { id: 'audio-engineer', name: 'Audio production engineer', engine: 'Local audio models + media tools', role: 'Runs the selected local audio backend, converts formats when needed, and checks audio for review and Unreal import.' },
  { id: 'character-designer', name: 'Character designer', engine: 'Qwen · local AI', role: 'Defines anatomy, silhouette, costume, materials, and readable character identity for the 3D artist.' },
  { id: '3d-artist', name: '3D artist', engine: 'Qwen · local AI', role: 'Sets the visual and silhouette direction for generated or supplied 3D assets before technical preparation.' },
  { id: 'technical-artist', name: 'Technical artist', engine: 'Blender · TripoSR CPU · tool worker', role: 'Validates generated meshes, inspects supplied GLB/FBX models, and prepares engine geometry.' },
  { id: 'rigging-animator', name: 'Rigging & animation artist', engine: 'Blender · local authoring model unavailable', role: 'Required for production characters. Existing rigs and animation clips can be inspected and preserved; new rigging and animation authoring are currently limited.' },
  { id: 'asset-inspector', name: 'Asset inspector', engine: 'File validators · tool worker', role: 'Checks structure, dimensions, duration, topology counts, file hashes, and reviewed bytes.' },
  { id: 'quality-supervisor', name: 'Quality Supervisor', engine: 'Deterministic local checks · tool worker', role: 'Applies asset-type acceptance checks, records evidence, and blocks unsupported or structurally invalid outputs before owner review.' },
  { id: 'unreal-integrator', name: 'Unreal integrator', engine: 'Unreal Python · tool worker', role: 'Imports approved assets and verifies their Unreal classes and saved packages.' },
  { id: 'recovery-manager', name: 'Recovery Vault manager', engine: 'Checksummed local archive · tool worker', role: 'Copies approved artifacts and evidence into a versioned, checksum-verified recovery package.' },
  { id: 'release-manager', name: 'Release manager', engine: 'Evidence ledger · tool worker', role: 'Writes the final recoverable handoff and records what was verified, approved, and archived.' }
];
const AGENT_BY_ID = new Map(TEAMS.map(agent => [agent.id, agent]));
const STAGE_AGENTS = ['production-director', 'specialist', 'specialist', 'asset-inspector', 'owner-review', 'unreal-integrator', 'unreal-integrator', 'recovery-manager', 'release-manager'];
function ensureSteps(j) {
  const prior=new Map((j.steps||[]).map(step=>[step.name,step]));
  j.steps=STEPS.map((name,index)=>prior.get(name)||{name,status:j.status==='completed'?'not_recorded':'pending',agentId:STAGE_AGENTS[index]});
}
function specialistFor(j) {
  if (['concept-art','texture','skybox','vfx-source'].includes(j.brief.kind)) return 'visual-artist';
  if (j.brief.kind === 'voice') return 'voice-director';
  if (j.brief.kind === 'sfx') return 'sound-effects-designer';
  if (['music', 'ambience'].includes(j.brief.kind)) return 'sound-designer';
  if (['text-to-3d', 'model','rigging','animation'].includes(j.brief.kind) && isCharacterRequest(j)) return 'character-designer';
  if (['text-to-3d', 'model','rigging','animation'].includes(j.brief.kind)) return '3d-artist';
  return 'technical-artist';
}
function producerFor(j, specialistId) { return j.brief.kind==='voice'?'voice-actor':(['music','ambience','sfx'].includes(j.brief.kind) ? 'audio-engineer' : (['text-to-3d', 'model','rigging','animation'].includes(j.brief.kind) ? 'technical-artist' : specialistId)); }
function atomic(file, data) { fs.mkdirSync(path.dirname(file), {recursive:true}); const tmp=file+'.tmp'; fs.writeFileSync(tmp, JSON.stringify(data,null,2)); fs.renameSync(tmp,file); }
function validateRequest(data) {
  if (!data || typeof data.prompt!=='string' || !data.prompt.trim() || data.prompt.length>4000) throw new Error('Enter a production prompt of 1–4,000 characters.');
  const kind=data.kind || 'auto'; if (!TYPES.includes(kind)) throw new Error('Unsupported asset type.');
  if (data.sourcePath && (typeof data.sourcePath!=='string' || !/\.(glb|fbx)$/i.test(data.sourcePath))) throw new Error('Model sources must be GLB or FBX files.');
  const characterName=String(data.characterName||'').trim();if(characterName.length>80)throw new Error('Character names must be 80 characters or fewer.');
  const voice=data.voice||'auto';if(voice!=='auto'&&!VOICE_IDS.has(voice))throw new Error('Choose an installed voice preset.');
  return {prompt:data.prompt.trim(),kind,biome:String(data.biome||'greenveil').slice(0,60),sourcePath:data.sourcePath||null,characterName,voice,seconds:Math.max(4,Math.min(20,Number(data.seconds)||8))};
}
class Pipeline extends EventEmitter {
  constructor(root, adapters, library=null) {
    super(); this.root=root;this.adapters=adapters;this.jobs=new Map();this.active=null;this.controller=null;this.closed=false;this.shuttingDown=false;
    this.library=library;
    fs.mkdirSync(root,{recursive:true});this.castFile=path.join(root,'cast.json');this.cast=fs.existsSync(this.castFile)?JSON.parse(fs.readFileSync(this.castFile,'utf8')):{};
    for(const name of fs.readdirSync(root)) {
      if(!/^[0-9a-f-]{36}$/.test(name))continue;
      try {const j=JSON.parse(fs.readFileSync(path.join(root,name,'job.json'),'utf8'));ensureSteps(j);
        if(['running','queued','cancelling','importing'].includes(j.status)){j.status='interrupted';j.resumeAvailable=true;j.error='The application stopped during this task. Resume from the last saved checkpoint when ready.';for(const s of j.steps)if(s.status==='running')s.status='interrupted';atomic(path.join(root,name,'job.json'),j);}this.jobs.set(j.id,j);
      }catch(error){this.emit('warning',error.message);}
    }
  }
  file(j){return path.join(this.root,j.id,'job.json');}
  save(j){j.updatedAt=new Date().toISOString();atomic(this.file(j),j);this.emit('change',j);}
  list(){return [...this.jobs.values()].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
  get(id){const j=this.jobs.get(id);if(!j)throw new Error('Task not found.');return j;}
  casting(){return Object.values(this.cast).sort((a,b)=>a.characterName.localeCompare(b.characterName));}
  assignVoice(j,exclude=null){if(j.brief?.kind!=='voice')return;const key=j.characterName?.toLocaleLowerCase('en-US');const existing=key&&this.cast[key];if(existing&&j.voice==='auto'&&!exclude){j.voice=existing.voice;return;}const used=new Set(Object.entries(this.cast).filter(([name])=>name!==key).map(([,entry])=>entry.voice));for(const other of this.jobs.values())if(other.id!==j.id&&other.brief?.kind==='voice'&&other.characterName?.toLocaleLowerCase('en-US')!==key&&!['rejected','cancelled','failed'].includes(other.status)&&other.voice!=='auto')used.add(other.voice);if(j.voice!=='auto'&&j.voice!==exclude){if(used.has(j.voice))throw new Error('That voice is already assigned to another character. Choose Auto cast or another voice.');return;}const next=VOICES.find(item=>!used.has(item.id)&&item.id!==exclude);if(!next)throw new Error('All installed English voices are assigned. Choose a different character voice setup.');j.voice=next.id;}
  create(data){if(this.closed)throw new Error('Production is shutting down.');if(this.list().filter(j=>j.status==='queued').length>=20)throw new Error('The production queue is full.');const request=validateRequest(data);const gate=preflight(request);const id=crypto.randomUUID();const j={id,...request,status:gate.passed?'queued':'blocked_capability',revision:1,revisionHistory:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),steps:STEPS.map(name=>({name,status:'pending',agentId:STAGE_AGENTS[STEPS.indexOf(name)]})),agentRuns:[],events:[],brief:null,artifact:null,engine:null,error:gate.passed?null:gate.reason,preflight:gate,usage:[]};this.jobs.set(id,j);this.save(j);if(gate.passed)void this.pump();return j;}
  prepareQualityRecook(j,automatic=false){if(j.qualityRecookUsed)throw new Error('The one bounded Quality Supervisor recook was already used.');const reason=(j.quality?.issues||[]).join(' ')||'The Quality Supervisor rejected the artifact.';j.revisionHistory??=[];j.revisionHistory.push({revision:j.revision||1,feedback:`Quality Supervisor recook: ${reason}`,artifact:j.artifact,spec:j.spec,checks:j.checks,quality:j.quality,reviewedAt:new Date().toISOString()});j.qualityRecookUsed=true;j.autoQualityRecook=automatic;j.qualityRecookReason=reason;j.revision=(j.revision||1)+1;j.revisionFeedback=`Create a corrected replacement for the prior draft. Quality Supervisor findings: ${reason} Meet the objective asset checks before returning the new draft for owner review.`;j.spec=null;j.artifact=null;j.checks=null;j.quality=null;j.qualitySupervisorRevision=null;j.characterDesign=null;j.backendJob=null;j.approvedAt=null;j.engine=null;j.verification=null;j.archive=null;j.handoff=null;j.error=null;for(let i=1;i<j.steps.length;i++)j.steps[i]={name:STEPS[i],status:'pending',agentId:STAGE_AGENTS[i]};j.status='queued';this.save(j);return j;}
  redoQuality(id){const j=this.get(id);if(j.status!=='quality_failed')throw new Error('Only an asset blocked by Quality Supervisor can be recooked.');const result=this.prepareQualityRecook(j,false);void this.pump();return result;}
  retryImageRecovery(id){const j=this.get(id);const imageKinds=['concept-art','texture','skybox','vfx-source','text-to-3d'];if(j.status!=='failed'||!j.brief||!imageKinds.includes(j.brief.kind)||j.artifact||j.imageRecovery)throw new Error('Only a failed image-backed task with no output and no prior recovery attempt can be retried.');if(!/HIP out of memory|CUDA out of memory|GPU out of memory|out of memory on your GPU/i.test(String(j.error||'')))throw new Error('This task did not fail from a recognized GPU memory error.');if(this.active)throw new Error('Wait for the active production task to finish before retrying.');j.retryHistory??=[];j.retryHistory.push({at:new Date().toISOString(),error:j.error,agentRuns:(j.agentRuns||[]).filter(run=>run.status==='failed').slice(-2)});j.error=null;j.backendJob=null;j.artifact=null;j.checks=null;j.quality=null;j.qualitySupervisorRevision=null;j.imageRecovery={status:'retrying',attempts:0,requestedAt:new Date().toISOString()};for(let i=2;i<j.steps.length;i++)j.steps[i]={name:STEPS[i],status:'pending',agentId:STAGE_AGENTS[i]};j.status='queued';this.save(j);void this.pump();return j;}
  async stage(j,n,work,agentId){if(this.controller.signal.aborted)throw new Error('Cancelled');const step=j.steps[n],agent=AGENT_BY_ID.get(agentId)||{id:agentId,name:agentId};const run={id:crypto.randomUUID(),agentId:agent.id,agentName:agent.name,step:step.name,status:'running',startedAt:new Date().toISOString()};j.agentRuns.push(run);step.agentId=agent.id;step.status='running';step.startedAt=run.startedAt;this.save(j);try{const out=await work(this.controller.signal);if(this.controller.signal.aborted)throw new Error('Cancelled');run.status='completed';run.completedAt=new Date().toISOString();run.summary=stageSummary(out);step.status='completed';step.completedAt=run.completedAt;this.save(j);return out;}catch(error){run.status=this.controller.signal.aborted?(j.cancelRequested?'cancelled':this.shuttingDown?'interrupted':'failed'):'failed';run.completedAt=new Date().toISOString();run.error=String(error.message||error).slice(0,500);step.status=run.status;step.error=run.error;this.save(j);throw error;}}
  async pump(){if(this.active||this.closed)return;const j=this.list().reverse().find(x=>x.status==='queued');if(!j)return;this.active=j.id;this.controller=new AbortController();this.emit('active',j);j.status='running';this.save(j);
    const timer=setTimeout(()=>this.controller?.abort(new Error('Production exceeded its 30-minute deadline.')),30*60_000);timer.unref();
    try {
      let capabilityChecked=false;
      if(j.kind!=='auto'&&this.adapters.readiness){const gate=await this.adapters.readiness(j.kind);capabilityChecked=true;if(!gate.available){j.status='blocked_capability';j.preflight={...(j.preflight||{}),passed:false,code:'worker_unavailable',stage:'preflight',reason:gate.reason};j.error=gate.reason;this.save(j);return;}}
      if(!j.brief){
        j.brief=await this.stage(j,0,s=>this.adapters.brief(j,s),'production-director');this.save(j);
      }
      if(!capabilityChecked&&this.adapters.readiness){const gate=await this.adapters.readiness(j.brief.kind);if(!gate.available){j.status='blocked_capability';j.preflight={...(j.preflight||{}),passed:false,code:'worker_unavailable',stage:'preflight',reason:gate.reason};j.error=gate.reason;this.save(j);return;}}
      if(j.brief.kind==='voice'){this.assignVoice(j);this.save(j);}
      if(this.library&&!j.spec){
        const references=this.library.resolve(j.id,j.prompt,j.brief);
        j.referencePackage=references;
        const signature=JSON.stringify({missing:references.missing,conflicts:references.conflicts,versions:references.references.map(ref=>[ref.id,ref.version])});
        if(signature!==j.referencePackageSignature){
          const now=new Date().toISOString();
          j.agentRuns.push({id:crypto.randomUUID(),agentId:'ai-librarian',agentName:'AI Librarian',step:'Reference check',status:'completed',startedAt:now,completedAt:now,summary:{references:references.references.map(ref=>ref.id+'@'+ref.version),missing:references.missing,conflicts:references.conflicts}});
          j.referencePackageSignature=signature;
        }
        if(references.missing.length||references.conflicts.length){j.status='missing_references';j.error=references.conflicts.length?'Approved references conflict: '+references.conflicts.map(pair=>pair.join(' / ')).join(', '):'Approved references are needed: '+references.missing.join(', ');this.save(j);return;}
        this.save(j);
      }
      const generatedModel=j.brief.kind==='text-to-3d';
      const suppliedModel=['model','rigging','animation'].includes(j.brief.kind);
      const specialistId=specialistFor(j);
      const producerId=producerFor(j,specialistId);
      if(!j.spec){
        j.spec=await this.stage(j,1,s=>this.adapters.specialist(j,s,(agentId,summary)=>this.recordConsult(j,agentId,summary)),specialistId);this.save(j);
      }
      if(suppliedModel&&!j.sourcePath){j.status='needs_source';j.error='The specialist production plan is ready. Attach an approved GLB/FBX source that follows it to continue with technical preparation.';this.save(j);return;}
      if(!j.artifact){
        j.artifact=await this.stage(j,2,s=>this.adapters.produce(j,s),producerId);this.save(j);
      }
      if(!j.checks){
        j.checks=await this.stage(j,3,s=>this.adapters.inspect(j,s),'asset-inspector');this.save(j);
      }
      j.quality=evaluate(j,j.checks);this.save(j);
      if(j.qualitySupervisorRevision!==j.revision){const qualityAt=new Date().toISOString();j.agentRuns.push({id:crypto.randomUUID(),agentId:'quality-supervisor',agentName:'Quality Supervisor',step:'Acceptance review',status:j.quality.passed?'completed':'failed',startedAt:qualityAt,completedAt:qualityAt,summary:{passed:j.quality.passed,issues:j.quality.issues,evidence:j.quality.evidence||[]}});j.qualitySupervisorRevision=j.revision;this.save(j);}
      if(!j.quality.passed){if(!j.qualityRecookUsed&&!['model','rigging','animation'].includes(j.brief.kind)){this.prepareQualityRecook(j,true);return;}j.status='quality_failed';j.error='Quality Supervisor blocked this output after the one allowed recook: '+j.quality.issues.join(' ');j.steps[4].status='rejected';j.steps[4].error=j.error;this.save(j);return;}
      if(!j.approvedAt){j.status='awaiting_review';j.steps[4].status='awaiting_review';this.save(j);return;}
      j.status='importing';this.save(j);
      // Recheck immutable reviewed bytes before engine writes.
      await this.stage(j,3,s=>this.adapters.inspect(j,s,true),'asset-inspector');
      j.engine=await this.stage(j,5,s=>this.adapters.import(j,s),'unreal-integrator');this.save(j);
      j.verification=await this.stage(j,6,s=>this.adapters.verify(j,s),'unreal-integrator');
      j.archive=await this.stage(j,7,s=>this.adapters.archive(j,s),'recovery-manager');this.save(j);
      j.handoff=await this.stage(j,8,s=>this.adapters.handoff(j,s),'release-manager');
      j.status='completed';j.completedAt=new Date().toISOString();this.save(j);
    }catch(error){j.status=this.controller.signal.aborted?(j.cancelRequested?'cancelled':this.shuttingDown?'interrupted':'failed'):'failed';j.error=this.controller.signal.aborted?String(this.controller.signal.reason?.message||'Cancelled'):error.message;if(j.imageRecovery?.status==='retrying'){j.imageRecovery={...j.imageRecovery,status:'failed',recoveryError:String(error.message||error).slice(0,500),failedAt:new Date().toISOString()};j.error=`Image recovery exhausted its single retry. ${j.error}`;}for(const s of j.steps)if(s.status==='running'){s.status=j.status;s.error=j.error;}for(const run of j.agentRuns||[])if(run.status==='running'){run.status=j.status;run.error=j.error;run.completedAt=new Date().toISOString();}this.save(j);}
    finally{clearTimeout(timer);await this.adapters.release?.(j).catch(()=>{});this.active=null;this.controller=null;this.emit('idle',j);setImmediate(()=>void this.pump());}
  }
  recordConsult(j,agentId,summary) {
    const agent=AGENT_BY_ID.get(agentId);if(!agent)return;
    const now=new Date().toISOString();j.agentRuns.push({id:crypto.randomUUID(),agentId,agentName:agent.name,step:'Specialist consultation',status:'completed',startedAt:now,completedAt:now,summary:summary&&typeof summary==='object'?stageSummary(summary):String(summary||'').slice(0,240)});this.save(j);
  }
  approve(id){const j=this.get(id);if(j.status!=='awaiting_review')throw new Error('Only an asset awaiting review can be approved.');j.approvedAt=new Date().toISOString();j.steps[4].status='completed';j.steps[4].completedAt=j.approvedAt;j.error=null;j.status='queued';if(j.brief.kind==='voice'&&j.characterName){this.cast[j.characterName.toLocaleLowerCase('en-US')]={characterName:j.characterName,voice:j.voice,status:'approved',approvedAt:j.approvedAt,jobId:j.id};atomic(this.castFile,this.cast);}this.save(j);void this.pump();return j;}
  reject(id){const j=this.get(id);if(j.status!=='awaiting_review')throw new Error('Only an asset awaiting review can be rejected.');j.status='rejected';j.steps[4].status='rejected';this.save(j);return j;}
  revise(id,feedback,voice='auto'){const j=this.get(id);if(!['awaiting_review','quality_failed'].includes(j.status))throw new Error('Only an asset awaiting review or blocked by quality review can be revised.');if(typeof feedback!=='string'||!feedback.trim()||feedback.length>2000)throw new Error('Describe the changes in 1–2,000 characters.');if(j.brief.kind==='voice'&&voice!=='auto'&&!VOICE_IDS.has(voice))throw new Error('Choose an installed voice preset.');const oldVoice=j.voice;j.revisionHistory??=[];j.revisionHistory.push({revision:j.revision||1,feedback:feedback.trim(),artifact:j.artifact,spec:j.spec,checks:j.checks,quality:j.quality,characterDesign:j.characterDesign,voice:oldVoice,reviewedAt:new Date().toISOString()});j.revision=(j.revision||1)+1;j.revisionFeedback=feedback.trim();j.spec=null;j.artifact=null;j.checks=null;j.quality=null;j.qualitySupervisorRevision=null;j.characterDesign=null;j.backendJob=null;j.approvedAt=null;j.engine=null;j.verification=null;j.error=null;for(let i=1;i<j.steps.length;i++)j.steps[i]={name:STEPS[i],status:'pending',agentId:STAGE_AGENTS[i]};if(['model','rigging','animation'].includes(j.brief.kind)){j.sourcePath=null;j.status='needs_source';j.error='Attach an updated GLB or FBX to apply geometry, rig, or animation changes. Your feedback is saved for the 3D team.';}else{j.status='queued';if(j.brief.kind==='voice'){j.voice=voice;this.assignVoice(j,voice==='auto'?oldVoice:null);}}this.save(j);if(j.status==='queued')void this.pump();return j;}
  preparePlan(id){const j=this.get(id);if(j.status!=='needs_source'||!['model','rigging','animation'].includes(j.brief?.kind)||j.sourcePath)throw new Error('This task is not waiting for a supplied model plan.');if(j.spec)throw new Error('The specialist production plan is already ready.');j.status='queued';j.error=null;this.save(j);void this.pump();return j;}
  attach(id,sourcePath){const j=this.get(id);if(j.status!=='needs_source'||!['model','rigging','animation'].includes(j.brief?.kind))throw new Error('This task is not waiting for a supplied model.');validateRequest({...j,sourcePath});j.sourcePath=sourcePath;j.error=null;j.status='queued';this.save(j);void this.pump();return j;}
  cancel(id){const j=this.get(id);if(!['queued','running','importing','awaiting_review','needs_source','missing_references','blocked_capability','quality_failed'].includes(j.status))throw new Error('This task cannot be cancelled.');j.cancelRequested=true;if(this.active===id){j.status='cancelling';this.save(j);this.controller.abort(new Error('Cancelled by the owner.'));}else{j.status='cancelled';this.save(j);}return j;}
  retryImport(id){const j=this.get(id);if(!['failed','interrupted'].includes(j.status)||!j.artifact||!j.approvedAt)throw new Error('This task has no approved asset to retry importing.');j.status='queued';j.error=null;j.cancelRequested=false;this.save(j);void this.pump();return j;}
  resumeInterrupted(id=null){let resumed=0;for(const j of this.jobs.values()){if((id&&j.id!==id)||j.status!=='interrupted')continue;for(const step of j.steps)if(step.status==='interrupted')step.status='pending';j.status='queued';j.error=null;j.cancelRequested=false;j.resumeAvailable=false;j.resumedAt=new Date().toISOString();this.save(j);resumed++;}if(id&&!resumed)throw new Error('This task is not interrupted or cannot be resumed.');if(resumed)void this.pump();return resumed;}
  resumeMissing(){if(!this.library)return 0;let resumed=0;for(const j of this.jobs.values())if(j.status==='missing_references'){const references=this.library.resolve(j.id,j.prompt,j.brief);j.referencePackage=references;if(!references.missing.length&&!references.conflicts.length){j.status='queued';j.error=null;this.save(j);resumed++;}}if(resumed)void this.pump();return resumed;}
  async reconcileCompleted(){let recovered=0;for(const j of this.list().reverse()){if(j.status!=='completed'||!j.approvedAt||!j.verification||(j.archive&&j.handoff))continue;this.active=j.id;this.controller=new AbortController();try{if(!j.archive){j.archive=await this.stage(j,7,s=>this.adapters.archive(j,s),'recovery-manager');this.save(j);}if(!j.handoff){j.handoff=await this.stage(j,8,s=>this.adapters.handoff(j,s),'release-manager');this.save(j);}delete j.recoveryError;recovered++;}catch(error){j.recoveryError=String(error.message||error).slice(0,500);this.save(j);}finally{await this.adapters.release?.(j).catch(()=>{});this.active=null;this.controller=null;}}return recovered;}
  async shutdown(){this.closed=true;this.shuttingDown=true;if(this.controller)this.controller.abort(new Error('Garage is closing. The task was saved and can be reviewed or retried after restart.'));while(this.active)await new Promise(r=>setTimeout(r,100));}
}
function stageSummary(value){if(!value||typeof value!=='object')return String(value||'').slice(0,240);const fields=['kind','name','summary','width','height','format','seconds','sampleRate','bitDepth','channels','triangles','meshes','armatures','verified','sha256','manifestSha256','archivedFiles','readyForOwner','status'];const result={};for(const key of fields)if(value[key]!==undefined)result[key]=value[key];return result;}
module.exports={Pipeline,TEAMS,TYPES,STEPS,AGENT_BY_ID,validateRequest,atomic,stageSummary,specialistFor,producerFor,isCharacterRequest};
