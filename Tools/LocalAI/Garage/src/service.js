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
let queue;
queue=new Pipeline(jobsRoot,adapters(config,jobsRoot,j=>queue.save(j)));
queue.on('active',j=>fs.writeFileSync(lock,JSON.stringify({pid:process.pid,job:j.id,updatedAt:new Date().toISOString()})));
queue.on('idle',()=>{if(fs.existsSync(lock))fs.unlinkSync(lock);});

function reply(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));}
function fail(status,message){const e=new Error(message);e.statusCode=status;return e;}
async function body(req){let raw='';for await(const b of req){raw+=b;if(raw.length>12000)throw fail(413,'Request too large.');}try{return JSON.parse(raw||'{}');}catch{throw fail(400,'Invalid JSON request.');}}
function validId(value){return /^[0-9a-f-]{36}$/.test(value);}
function within(rootDir,file){const base=fs.realpathSync(rootDir),real=fs.realpathSync(file),rel=path.relative(base,real);if(!rel||rel.startsWith('..')||path.isAbsolute(rel))throw fail(403,'Requested file is outside the Garage task directory.');return real;}
function agentReadiness(id,c){
  const checks={
    'production-director':[['ollama','Local text model']],
    'visual-artist':[['ollama','Local text model'],['image','Image generation service']],
    'sound-designer':[['ollama','Local text model'],['audio','Music / ambience service']],
    'sound-effects-designer':[['ollama','Local text model'],['sfx','Isolated sound-effects model']],
    'voice-director':[['ollama','Local text model'],['voice','Offline speech service']],
    'voice-actor':[['voice','Offline speech service']],
    'audio-engineer':[['python','Local audio conversion and inspection tools']],
    'character-designer':[['ollama','Local text model']],
    '3d-artist':[['ollama','Local text model']],
    'technical-artist':[['blender','Blender model worker']],
    'rigging-animator':[['rigging','Auto-rigging and animation authoring model']],
    'asset-inspector':[['python','Local media inspection runtime'],['blender','3D model inspection worker']],
    'unreal-integrator':[['unreal','Unreal Editor commandlet']]
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
  const checks={ollama:Boolean(dashboard?.ollamaAvailable&&dashboard?.modelAvailable),image:Boolean(image?.available!==false&&image),audio:Boolean(audio?.available!==false&&audio&&((audio.supports||[]).some(x=>['music','ambience'].includes(x)))),voice:Boolean(audio?.voiceAvailable),sfx:sfxReady(),text3d:tripoReady(),blender:fs.existsSync(config.blender),python:fs.existsSync(config.python),unreal:fs.existsSync(engineRoot),rigging:false};
  const agents=TEAMS.map(agent=>({...agent,...agentReadiness(agent.id,checks)}));
  const capabilities=[
    {id:'image',name:'Image / texture production',available:checks.image&&checks.ollama,reason:checks.image?'Requires the local text model and Image Studio.':'Image Studio is offline.'},
    {id:'audio',name:'Instrumental music and ambience',available:checks.audio&&checks.ollama,reason:checks.audio?'Requires the local text model and Audio Studio.':'Audio Studio is offline.'},
    {id:'voice',name:'Character voice',available:checks.voice&&checks.ollama,reason:checks.voice?'Uses the local text model and offline speech renderer.':'Offline speech renderer is unavailable.'},
    {id:'character-rigging-animation',name:'Character rigging and animation authoring',available:false,reason:'New rigs and animation clips need a local authoring model. Existing supplied rigs and clips are preserved during preparation.'},
    {id:'model',name:'Supplied 3D model preparation',available:checks.blender,reason:checks.blender?'Attach an approved GLB or FBX; Garage inspects and prepares it.':'Blender is not installed at the configured path.'},
    {id:'unreal',name:'Unreal import and verification',available:checks.unreal,reason:checks.unreal?'Reviewed assets can be imported and package-checked.':'Unreal Editor commandlet is unavailable.'},
    {id:'text-to-3d',name:'Prompt-to-3D static assets',available:checks.text3d&&checks.image&&checks.ollama&&checks.blender,reason:checks.text3d?'Uses character design, local concept-image generation, TripoSR CPU inference, and Blender mesh preparation. Outputs are static meshes and need 3D artist review.':'The local TripoSR CPU runtime or model weights are not installed.'},
    {id:'sfx',name:'Isolated sound effects',available:checks.sfx&&checks.ollama,reason:checks.sfx?'Uses the local Stable Audio 3 small-SFX model on CPU with local Qwen art direction.':'Stable Audio 3 small-SFX model or its isolated Python runtime is not installed.'}
  ];
  return {name:'WildBound AI Garage',version:'2.3.0',pid:process.pid,activeJob:queue.active,teams:agents,agents,voices:require('../../Dashboard/voice-catalog.json').voices,casting:queue.casting(),capabilities,freeRamGiB:os.freemem()/1024**3,repoRoot:config.repoRoot,ollama:dashboard,audio,image,blenderAvailable:checks.blender,pythonAvailable:checks.python,unrealAvailable:checks.unreal,limits:capabilities.filter(x=>!x.available).map(x=>x.name+': '+x.reason)};
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
  if(req.method==='GET'&&url.pathname==='/jobs'){
    const limit=Math.min(100,Math.max(1,Number(url.searchParams.get('limit')||100)));
    const state=url.searchParams.get('status');
    const jobs=queue.list().filter(j=>!state||j.status===state).slice(0,limit);
    return reply(res,200,{jobs,total:queue.jobs.size,activeJob:queue.active,limit});
  }
  if(req.method==='POST'&&url.pathname==='/jobs')return reply(res,202,queue.create(await body(req)));
  const fileMatch=url.pathname.match(/^\/jobs\/([0-9a-f-]{36})\/files\/(preview|source)$/);
  if(req.method==='GET'&&fileMatch)return sendArtifact(res,fileMatch[1],fileMatch[2]);
  const sourceMatch=url.pathname.match(/^\/jobs\/([0-9a-f-]{36})\/source$/);
  if(req.method==='POST'&&sourceMatch)return attachUploadedModel(req,res,sourceMatch[1],url);
  const match=url.pathname.match(/^\/jobs\/([0-9a-f-]{36})(?:\/(approve|reject|revise|cancel|attach|retry-import))?$/);
  if(match){
    if(req.method==='GET'&&!match[2])return reply(res,200,queue.get(match[1]));
    if(req.method==='POST'){
      const payload=await body(req),action=match[2];
      const functions={approve:'approve',reject:'reject',revise:'revise',cancel:'cancel',attach:'attach', 'retry-import':'retryImport'};
      if(action&&functions[action])return reply(res,200,action==='revise'?queue.revise(match[1],payload.feedback,payload.voice):queue[functions[action]](match[1],payload.sourcePath));
    }
  }
  if(req.method==='POST'&&url.pathname==='/shutdown'){
    reply(res,202,{stopping:true});await queue.shutdown();if(fs.existsSync(lock))fs.unlinkSync(lock);server.close(()=>process.exit(0));return;
  }
  return reply(res,404,{error:'Unknown production endpoint.'});
}
const server=http.createServer((req,res)=>handle(req,res).catch(error=>reply(res,error.statusCode||400,{error:error.message||'Production request failed.'})));
server.listen(config.port,'127.0.0.1',()=>console.log('Native Garage production service ready.'));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{await queue.shutdown();server.close(()=>process.exit(0));});
