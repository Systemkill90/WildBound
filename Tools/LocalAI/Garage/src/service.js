'use strict';
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const crypto=require('node:crypto');
const {Transform}=require('node:stream');
const {pipeline}=require('node:stream/promises');
const {Pipeline,TEAMS}=require('./pipeline');
const {adapters,json}=require('./adapters');
const {CreativeLibrary}=require('./creative-library');
const {LocalProductionManager}=require('./local-production-manager');

const root=path.resolve(__dirname,'..');
const config=JSON.parse(fs.readFileSync(path.join(root,'garage.config.json'),'utf8'));
const sfxRoot=path.resolve(path.dirname(config.dashboardRoot),'Tools','StableAudio3','optimized','tflite');
const sfxFiles=['models/tflite/sa3-sm-sfx/dit_w8a8.tflite','models/tflite/same-s/enc_w8a8.tflite','models/tflite/same-s/dec_w8a8.tflite','models/tflite/t5gemma/encoder_fp16.tflite'];
const sfxReady=()=>fs.existsSync(path.join(sfxRoot,'.venv','Scripts','python.exe'))&&sfxFiles.every(file=>fs.existsSync(path.join(sfxRoot,file)));
const tripoRoot=path.resolve(path.dirname(config.dashboardRoot),'Tools','TripoSR');
const tripoModel=path.resolve(path.dirname(config.dashboardRoot),'Models','TripoSR');
const tripoReady=()=>fs.existsSync(path.join(tripoRoot,'.venv','Scripts','python.exe'))&&fs.existsSync(path.join(tripoModel,'config.yaml'))&&fs.existsSync(path.join(tripoModel,'model.ckpt'));
const token=fs.readFileSync(path.join(config.dashboardRoot,'runtime','control-token.txt'),'utf8').trim();
const jobsRoot=path.join(root,'runtime','jobs');
const lock=path.join(root,'runtime','production.lock.json');
const library=new CreativeLibrary({nasRoot:config.libraryNasRoot||process.env.WILDBOUND_LIBRARY_NAS_ROOT||null,repoRoot:config.libraryRepoRoot||config.repoRoot,stateRoot:path.join(root,'runtime','creative-library')});
const managerRepoRoot=path.resolve(config.libraryRepoRoot||config.repoRoot);
const localManager=new LocalProductionManager({repoRoot:managerRepoRoot,garageRoot:path.join(managerRepoRoot,'Tools','LocalAI','Garage'),dashboardRoot:path.join(managerRepoRoot,'Tools','LocalAI','Dashboard'),runtimeRoot:path.dirname(root),engineRoot:config.engineRoot,nasRoot:config.libraryNasRoot||null,auditRoot:path.join(root,'runtime','local-production-manager'),model:config.model});
let queue;
queue=new Pipeline(jobsRoot,adapters(config,jobsRoot,j=>queue.save(j)),library);
queue.on('active',j=>fs.writeFileSync(lock,JSON.stringify({pid:process.pid,job:j.id,updatedAt:new Date().toISOString()})));
queue.on('idle',()=>{if(fs.existsSync(lock))fs.unlinkSync(lock);});

function reply(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));}
function fail(status,message){const e=new Error(message);e.statusCode=status;return e;}
async function body(req,limit=12000){let size=0;const chunks=[];for await(const b of req){size+=b.length;if(size>limit)throw fail(413,'Request too large.');chunks.push(b);}try{return JSON.parse(Buffer.concat(chunks).toString('utf8')||'{}');}catch{throw fail(400,'Invalid JSON request.');}}
function validId(value){return /^[0-9a-f-]{36}$/.test(value);}
function within(rootDir,file){const base=fs.realpathSync(rootDir),real=fs.realpathSync(file),rel=path.relative(base,real);if(!rel||rel.startsWith('..')||path.isAbsolute(rel))throw fail(403,'Requested file is outside the Garage task directory.');return real;}
function agentReadiness(id,c){
  const checks={
    'production-director':[['ollama','Local text model']],
    'ai-librarian':[['library','Private Creative Library NAS and index']],
    'visual-artist':[['ollama','Local text model'],['image','Image generation service']],
    'sound-designer':[['ollama','Local text model'],['audio','Music / ambience service']],
    'sound-effects-designer':[['ollama','Local text model'],['sfx','Isolated sound-effects model']],
    'voice-director':[['ollama','Local text model'],['voice','Offline speech service']],
    'voice-actor':[['voice','Offline speech service']],
    'audio-engineer':[['python','Local audio conversion and inspection tools']],
    'character-designer':[['ollama','Local text model']],
    '3d-artist':[['ollama','Local text model'],['text3d','Local 3D mesh generator']],
    'technical-artist':[['blender','Blender model worker']],
    'rigging-animator':[['rigging','Auto-rigging and animation authoring model']],
    'asset-inspector':[['python','Local media inspection runtime'],['blender','3D model inspection worker']],
    'unreal-integrator':[['unreal','Unreal Editor commandlet']],
    'recovery-manager':[['recovery','Writable checksummed recovery archive']],
    'release-manager':[['recovery','Verified evidence and handoff ledger']]
  }[id]||[];
  const missing=checks.filter(([key])=>!c[key]).map(([,name])=>name);
  return {ready:missing.length===0,state:missing.length?'limited':'ready',missing};
}
async function status(){
  const probes=await Promise.allSettled([
    json('http://127.0.0.1:8765/api/health',undefined,undefined,3000),
    json('http://127.0.0.1:8190/api/status',undefined,undefined,3000),
    json('http://127.0.0.1:8200/api/status',undefined,undefined,3000)
  ]);
  const dashboard=probes[0].status==='fulfilled'?probes[0].value:null;
  const image=probes[1].status==='fulfilled'?probes[1].value:null;
  const audio=probes[2].status==='fulfilled'?probes[2].value:null;
  const engineRoot=path.join(config.engineRoot,'Engine','Binaries','Win64','UnrealEditor-Cmd.exe');
  const recoveryRoot=path.join(jobsRoot,'recovery');let recovery=false;try{fs.mkdirSync(recoveryRoot,{recursive:true});fs.accessSync(recoveryRoot,fs.constants.W_OK);recovery=true;}catch{}
  const configuredModelAvailable=Array.isArray(dashboard?.models)&&dashboard.models.includes(config.model);
  const checks={ollama:Boolean(dashboard?.ollamaAvailable&&configuredModelAvailable),library:library.status().available,image:Boolean(image?.available!==false&&image),audio:Boolean(audio?.available!==false&&audio&&((audio.supports||[]).some(x=>['music','ambience'].includes(x)))),voice:Boolean(audio?.voiceAvailable),sfx:sfxReady()&&Boolean(audio?.available!==false&&audio),text3d:tripoReady(),blender:fs.existsSync(config.blender),python:fs.existsSync(config.python),unreal:fs.existsSync(engineRoot),recovery,rigging:false};
  const agents=TEAMS.map(agent=>({...agent,...agentReadiness(agent.id,checks)}));
  const capabilities=[
    {id:'image',name:'Image / texture production',available:checks.image&&checks.ollama,reason:checks.image?'Requires the local text model and Image Studio.':'Image Studio is offline.'},
    {id:'concept-art',name:'2D concept artwork',available:checks.image&&checks.ollama,reason:checks.image?'Generates reviewable concept images through the local image worker.':'Image Studio is offline.'},
    {id:'skybox',name:'Skybox source artwork',available:checks.image&&checks.ollama,reason:checks.image?'Generates a reviewable environment image; Unreal cubemap/material assembly remains a manual step.':'Image Studio is offline.'},
    {id:'vfx-source',name:'VFX source artwork',available:checks.image&&checks.ollama,reason:checks.image?'Generates reviewable source art only; Niagara systems and flipbook assembly are not authored.':'Image Studio is offline.'},
    {id:'audio',name:'Instrumental music and ambience',available:checks.audio&&checks.ollama,reason:checks.audio?'Requires the local text model and Audio Studio.':'Audio Studio is offline.'},
    {id:'voice',name:'Character voice',available:checks.voice&&checks.ollama,reason:checks.voice?'Uses the local text model and offline speech renderer.':'Offline speech renderer is unavailable.'},
    {id:'character-modeling',name:'Player character and creature modeling',available:false,reason:'The single-view TripoSR worker failed character-quality review. Use a reviewed supplied character model or install a character-capable modeling pipeline.'},
    {id:'character-rigging-animation',name:'Character rigging and animation authoring',available:false,reason:'New rigs and animation clips need a local authoring model. Existing supplied rigs and clips are preserved during preparation.'},
    {id:'model',name:'Supplied 3D model preparation',available:checks.blender,reason:checks.blender?'Attach an approved GLB or FBX; Garage inspects and prepares it.':'Blender is not installed at the configured path.'},
    {id:'rigging',name:'Supplied rig inspection',available:checks.blender,reason:checks.blender?'Attach a GLB/FBX; Garage verifies and preserves its armature. New rigging authoring is unavailable.':'Blender is not installed at the configured path.'},
    {id:'animation',name:'Supplied animation inspection',available:checks.blender,reason:checks.blender?'Attach a GLB/FBX; Garage verifies and preserves its animation clips. New animation authoring is unavailable.':'Blender is not installed at the configured path.'},
    {id:'unreal',name:'Unreal import and verification',available:checks.unreal,reason:checks.unreal?'Reviewed assets can be imported and package-checked.':'Unreal Editor commandlet is unavailable.'},
    {id:'recovery',name:'Recovery archive and handoff',available:checks.recovery,reason:checks.recovery?'Approved artifacts, manifests, and final handoffs are written to a checksummed local vault.':'The local recovery vault is not writable.'},
    {id:'text-to-3d',name:'Prompt-to-3D static props',available:checks.text3d&&checks.image&&checks.ollama&&checks.blender,reason:checks.text3d?'Uses local concept-image generation, TripoSR CPU inference, and Blender mesh preparation for non-character props. Characters and creatures are rejected before generation.':'The local TripoSR CPU runtime or model weights are not installed.'},
    {id:'sfx',name:'Isolated sound effects',available:checks.sfx&&checks.ollama,reason:checks.sfx?'Uses the local Stable Audio 3 small-SFX model on CPU with local Qwen art direction.':'Stable Audio 3 small-SFX model or its isolated Python runtime is not installed.'}
  ];
  const lifecycle=[
    {id:'intake',name:'Intake',ready:true,detail:'Durable local task queue with typed requests and saved revisions.'},
    {id:'references',name:'References',ready:checks.library,detail:checks.library?'AI Librarian supplies approved, version-pinned packages.':'Creative Library storage is unavailable.'},
    {id:'planning',name:'Planning',ready:checks.ollama,detail:checks.ollama?'Local Production Director creates briefs and dependency needs.':'Local Production Director model is unavailable.'},
    {id:'assignment',name:'Assignment',ready:true,detail:'Typed work routes to named specialists and tool workers.'},
    {id:'execution',name:'Execution',ready:capabilities.some(item=>item.available&&['image','audio','voice','model','sfx'].includes(item.id)),detail:'Serial resource-safe local production with timeouts and persisted state.'},
    {id:'qa',name:'QA evidence',ready:checks.python&&checks.unreal,detail:'Files are inspected before review and rechecked before verified Unreal writes.'},
    {id:'approval',name:'Owner approval',ready:true,detail:'Generated work stops for approve, revise, or reject; only approval permits import.'},
    {id:'archive',name:'Recovery archive',ready:checks.recovery,detail:'Approved bytes and evidence are copied and checksum verified by revision.'},
    {id:'handoff',name:'Handoff',ready:checks.recovery,detail:'Release Manager writes a final evidence ledger after verification and archival.'}
  ];
  const interrupted=queue.list().filter(job=>job.status==='interrupted').length;
  return {name:'WildBound AI Garage',version:'2.8.2-metahuman-save-guardrail',pid:process.pid,activeJob:queue.active,recovery:{interrupted,resumeAvailable:interrupted>0},localManager:localManager.status(),teams:agents,agents,voices:require('../../Dashboard/voice-catalog.json').voices,casting:queue.casting(),library:library.status(),capabilities,lifecycle,freeRamGiB:os.freemem()/1024**3,repoRoot:config.repoRoot,ollama:dashboard,audio,image,blenderAvailable:checks.blender,pythonAvailable:checks.python,unrealAvailable:checks.unreal,limits:capabilities.filter(x=>!x.available).map(x=>x.name+': '+x.reason)};
}
async function sendArtifact(res,id,kind){
  if(!validId(id))return reply(res,400,{error:'Invalid task ID.'});
  const job=queue.get(id),artifact=job.artifact;
  if(!artifact)return reply(res,409,{error:'This task has no production artifact yet.'});
  const key=kind==='source'?'source':kind==='preview'?'preview':null;
  if(!key)return reply(res,404,{error:'Unknown artifact file.'});
  const file=within(path.join(jobsRoot,id),artifact[key]);
  const ext=path.extname(file).toLowerCase();
  const type=ext==='.png'?'image/png':ext==='.wav'?'audio/wav':ext==='.json'?'application/json':ext==='.fbx'?'application/octet-stream':'application/octet-stream';
  const stat=fs.statSync(file);
  res.writeHead(200,{'Content-Type':type,'Content-Length':stat.size,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Disposition':'inline'});
  fs.createReadStream(file).on('error',()=>res.destroy()).pipe(res);
}
function sendLibraryMedia(res,id,version,index){
  const record=library.record(id),entry=record?.versions.find(item=>item.version===Number(version)),media=entry?.media[Number(index)];
  if(!media)return reply(res,404,{error:'Original media was not found.'});
  const file=within(library.archive,path.join(library.nasRoot,media.object));
  if(fs.statSync(file).size!==media.bytes||crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')!==media.sha256)return reply(res,409,{error:'Original media failed archive verification.'});
  const ext=path.extname(file).toLowerCase(),type={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.wav':'audio/wav','.flac':'audio/flac','.mp3':'audio/mpeg','.m4a':'audio/mp4'}[ext]||'application/octet-stream';
  res.writeHead(200,{'Content-Type':type,'Content-Length':media.bytes,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Disposition':'inline'});
  fs.createReadStream(file).on('error',()=>res.destroy()).pipe(res);
}
async function attachUploadedModel(req,res,id,url){
  if(!validId(id))return reply(res,400,{error:'Invalid task ID.'});
  const name=String(url.searchParams.get('filename')||'');
  const ext=path.extname(name).toLowerCase();
  if(path.basename(name)!==name||name.includes('..')||!['.glb','.fbx'].includes(ext))return reply(res,400,{error:'Choose a GLB or FBX model file.'});
  const job=queue.get(id);
  if(job.status!=='needs_source')return reply(res,409,{error:'This task is not waiting for a model source.'});
  const declared=Number(req.headers['content-length']||0),limit=250*1024*1024;
  if(declared>limit)return reply(res,413,{error:'Model files must be 250 MB or smaller.'});
  const directory=path.join(jobsRoot,id);fs.mkdirSync(directory,{recursive:true});
  const destination=path.join(directory,'approved-source'+ext),temporary=destination+'.'+crypto.randomUUID()+'.tmp';
  let size=0;
  const limiter=new Transform({transform(chunk,encoding,callback){size+=chunk.length;if(size>limit)callback(fail(413,'Model files must be 250 MB or smaller.'));else callback(null,chunk);}});
  try{
    await pipeline(req,limiter,fs.createWriteStream(temporary,{flags:'wx'}));
    if(size<20)throw fail(400,'The selected model file is empty or truncated.');
    await fs.promises.rename(temporary,destination);
    try{return reply(res,202,queue.attach(id,destination));}
    catch(error){await fs.promises.rm(destination,{force:true}).catch(()=>{});throw error;}
  }catch(error){await fs.promises.rm(temporary,{force:true}).catch(()=>{});return reply(res,error.statusCode||400,{error:error.message||'Model upload failed.'});}
}
async function handle(req,res){
  if(req.headers.host!=='127.0.0.1:'+config.port)return reply(res,403,{error:'Loopback host required.'});
  if(req.headers.authorization!=='Bearer '+token)return reply(res,401,{error:'Authentication required.'});
  const url=new URL(req.url,'http://127.0.0.1:'+config.port);
  if(req.method==='GET'&&url.pathname==='/status')return reply(res,200,await status());
  if(req.method==='GET'&&url.pathname==='/local-manager')return reply(res,200,localManager.status());
  if(req.method==='POST'&&url.pathname==='/local-manager/plan'){
    const payload=await body(req);try{return reply(res,200,await localManager.plan(payload.task));}catch(error){return reply(res,409,{error:error.message});}
  }
  if(req.method==='POST'&&url.pathname==='/local-manager/run'){
    const payload=await body(req);try{return reply(res,200,await localManager.execute(String(payload.actionId||''),{dryRun:payload.dryRun!==false,confirmation:payload.confirmation||null}));}catch(error){return reply(res,409,{error:error.message,record:error.managerRecord||null});}
  }
  if(req.method==='GET'&&url.pathname==='/library')return reply(res,200,library.status());
  const recordMatch=url.pathname.match(/^\/library\/records\/([a-z0-9][a-z0-9-]{2,79})$/);
  if(req.method==='GET'&&recordMatch){const record=library.record(recordMatch[1]);return record?reply(res,200,record):reply(res,404,{error:'Design record not found.'});}
  const mediaMatch=url.pathname.match(/^\/library\/media\/([a-z0-9][a-z0-9-]{2,79})\/(\d+)\/(\d+)$/);
  if(req.method==='GET'&&mediaMatch)return sendLibraryMedia(res,mediaMatch[1],mediaMatch[2],mediaMatch[3]);
  if(req.method==='POST'&&url.pathname==='/library/sync'){if(library.busy)return reply(res,409,{error:'Idea Board sync is already running.'});void library.sync().then(()=>queue.resumeMissing()).catch(error=>console.error('Creative Library sync:',error));return reply(res,202,{started:true});}
  if(req.method==='POST'&&url.pathname==='/library/supply'){const payload=await body(req,40*1024*1024);const result=library.supply(payload);void library.sync().then(()=>queue.resumeMissing()).catch(error=>console.error('Creative Library sync:',error));return reply(res,202,result);}
  if(req.method==='POST'&&url.pathname==='/library/approve'){const payload=await body(req);const record=library.approve(payload.id,Number(payload.version));const resumed=queue.resumeMissing();return reply(res,200,{record,resumed});}
  if(req.method==='POST'&&url.pathname==='/library/withdraw'){const payload=await body(req);const record=library.withdraw(payload.id,Number(payload.version));return reply(res,200,{record});}
  if(req.method==='POST'&&url.pathname==='/library/package'){const payload=await body(req);return reply(res,200,library.packageFor({jobId:payload.jobId||null,prompt:payload.prompt||'',brief:payload.brief||{},required:Array.isArray(payload.required)?payload.required:undefined}));}
  if(req.method==='POST'&&url.pathname==='/library/resolve'){const payload=await body(req);const j=queue.jobs.get(payload.jobId),request=library.status().missing.find(item=>item.jobId===payload.jobId);if(!j&&!request)return reply(res,404,{error:'Missing-reference request not found.'});const pack=library.resolve(payload.jobId,j?.prompt||request.prompt,j?.brief||{referenceNeeds:(request?.missing||[]).map(tag=>({subject:tag.split(':')[0],facet:tag.split(':')[1]}))});const resumed=queue.resumeMissing();return reply(res,200,{package:pack,resumed});}
  if(req.method==='GET'&&url.pathname==='/jobs'){
    const limit=Math.min(100,Math.max(1,Number(url.searchParams.get('limit')||100)));
    const state=url.searchParams.get('status');
    const jobs=queue.list().filter(j=>!state||j.status===state).slice(0,limit);
    return reply(res,200,{jobs,total:queue.jobs.size,activeJob:queue.active,limit});
  }
  if(req.method==='POST'&&url.pathname==='/jobs')return reply(res,202,queue.create(await body(req)));
  if(req.method==='POST'&&url.pathname==='/resume'){const payload=await body(req);return reply(res,200,{resumed:queue.resumeInterrupted(payload.jobId||null)});}
  const fileMatch=url.pathname.match(/^\/jobs\/([0-9a-f-]{36})\/files\/(preview|source)$/);
  if(req.method==='GET'&&fileMatch)return sendArtifact(res,fileMatch[1],fileMatch[2]);
  const sourceMatch=url.pathname.match(/^\/jobs\/([0-9a-f-]{36})\/source$/);
  if(req.method==='POST'&&sourceMatch)return attachUploadedModel(req,res,sourceMatch[1],url);
  const match=url.pathname.match(/^\/jobs\/([0-9a-f-]{36})(?:\/(approve|reject|revise|cancel|attach|prepare-plan|retry-import))?$/);
  if(match){
    if(req.method==='GET'&&!match[2])return reply(res,200,queue.get(match[1]));
    if(req.method==='POST'){
      const payload=await body(req),action=match[2];
      const functions={approve:'approve',reject:'reject',revise:'revise',cancel:'cancel',attach:'attach','prepare-plan':'preparePlan','retry-import':'retryImport'};
      if(action&&functions[action])return reply(res,200,action==='revise'?queue.revise(match[1],payload.feedback,payload.voice):queue[functions[action]](match[1],payload.sourcePath));
    }
  }
  if(req.method==='POST'&&url.pathname==='/shutdown'){
    reply(res,202,{stopping:true});await queue.shutdown();if(fs.existsSync(lock))fs.unlinkSync(lock);server.close(()=>process.exit(0));return;
  }
  return reply(res,404,{error:'Unknown production endpoint.'});
}
const server=http.createServer((req,res)=>handle(req,res).catch(error=>reply(res,error.statusCode||400,{error:error.message||'Production request failed.'})));
(async()=>{const recovered=await queue.reconcileCompleted();server.listen(config.port,'127.0.0.1',()=>console.log(`Native Garage production service ready. Recovered handoffs: ${recovered}.`));})().catch(error=>{console.error('Garage startup recovery failed:',error);process.exitCode=1;});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{await queue.shutdown();server.close(()=>process.exit(0));});
