'use strict';
const readline = require('node:readline');
const path = require('node:path');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const IMAGE = 'http://127.0.0.1:8190';
const DASHBOARD = 'http://127.0.0.1:8765';
const AUDIO = 'http://127.0.0.1:8200';
const REPO = path.resolve(process.env.WILDBOUND_REPO || path.resolve(__dirname, '../../..'));
const GARAGE_ROOT = path.resolve(__dirname, '..', 'Garage');
const GARAGE_CONFIG_PATH = path.join(GARAGE_ROOT, 'garage.config.json');
const GARAGE_CONFIG = fs.existsSync(GARAGE_CONFIG_PATH) ? JSON.parse(fs.readFileSync(GARAGE_CONFIG_PATH, 'utf8')) : {};
const GARAGE = `http://127.0.0.1:${Number(GARAGE_CONFIG.port) || 8767}`;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
let imageBusy = false;
const tools = [
  { name: 'wildbound_workshop_status', description: 'Check the local WildBound Workshop, Ollama, image engine, and audio engine. This contacts loopback services only.', inputSchema: { type: 'object', properties: {}, additionalProperties: false } },
  { name: 'wildbound_generate_image', description: 'Generate one 1024px default WildBound Idea Board-guided image locally, import as a Texture2D into Unreal when possible, and include a preview in Codex. Runs only when local resource checks allow. If unavailable or busy, do not retry locally: Codex can take over with its image generation tool. Cloud image generation is a Codex-side choice, never triggered by this local service.', inputSchema: { type: 'object', properties: { prompt: { type: 'string', minLength: 1, maxLength: 4000 }, intent: { type: 'string', enum: ['environment','creature','character','settlement','texture'] }, biome: { type: 'string', enum: ['greenveil','drowned_march','emberstep','gloamwood'] }, width: { type: 'integer', enum: [512,768,1024] }, height: { type: 'integer', enum: [512,768,1024] }, add_to_unreal: { type: 'boolean', description: 'Import as a Texture2D in Unreal after generation. Defaults to true.' }, return_preview: { type: 'boolean', description: 'Include the generated image bytes in Codex so it can return/show the image. Defaults to true; set false to reduce context and transfer.' } }, required: ['prompt'], additionalProperties: false } },
  { name: 'wildbound_generate_audio', description: 'Generate instrumental music or musical ambience locally on the shared AMD GPU and return the MP3 preview to Codex, saving a copy into WildBound generated assets. If memory is low or the shared GPU is busy, stop local work and hand the request back to Codex; any cloud audio provider requires the user to approve it. Dedicated SFX and spoken-voice models are not installed.', inputSchema: { type: 'object', properties: { prompt: { type: 'string', minLength: 1, maxLength: 3000 }, kind: { type: 'string', enum: ['ambience','music'] }, seconds: { type: 'integer', minimum: 4, maximum: 20 }, return_preview: { type: 'boolean', description: 'Include audio bytes in the Codex result. Defaults to true.' } }, required: ['prompt','kind'], additionalProperties: false } },
  { name: 'wildbound_garage_status', description: 'Read shared Garage production-team and backend capability status. Loopback only; does not start workers or inference.', inputSchema: { type: 'object', properties: {}, additionalProperties: false } },
  { name: 'wildbound_garage_list_tasks', description: 'List recent Garage tasks and their shared-agent handoff status.', inputSchema: { type: 'object', properties: { limit: { type: 'integer', minimum: 1, maximum: 100 }, status: { type: 'string', enum: ['queued','running','cancelling','awaiting_review','needs_source','importing','completed','failed','interrupted','cancelled','rejected'] } }, additionalProperties: false } },
  { name: 'wildbound_garage_submit_task', description: 'Submit a task to the shared WildBound AI Garage team. It runs locally and pauses for the owner to review before any Unreal import.', inputSchema: { type: 'object', properties: { prompt: { type: 'string', minLength: 1, maxLength: 4000 }, kind: { type: 'string', enum: ['auto','texture','voice','music','ambience','sfx','text-to-3d','model'] }, biome: { type: 'string', enum: ['greenveil','drowned_march','emberstep','gloamwood'] }, voice: { type: 'string', enum: ['af_bella','af_nicole','am_adam'] }, seconds: { type: 'integer', minimum: 4, maximum: 20 } }, required: ['prompt'], additionalProperties: false } },
  { name: 'wildbound_garage_get_task', description: 'Read one task, its agent handoffs, checks, review state, and Unreal verification. Includes image or audio preview bytes when available.', inputSchema: { type: 'object', properties: { task_id: { type: 'string', minLength: 36, maxLength: 36 }, return_preview: { type: 'boolean', description: 'Include image or audio preview bytes. Defaults to true.' } }, required: ['task_id'], additionalProperties: false } },
  { name: 'wildbound_garage_cancel_task', description: 'Cancel a queued, active, or awaiting-review task in the shared Garage queue.', inputSchema: { type: 'object', properties: { task_id: { type: 'string', minLength: 36, maxLength: 36 } }, required: ['task_id'], additionalProperties: false } },
  { name: 'wildbound_garage_attach_model', description: 'Attach an approved local GLB or FBX source path to a task waiting for a 3D model.', inputSchema: { type: 'object', properties: { task_id: { type: 'string', minLength: 36, maxLength: 36 }, source_path: { type: 'string', minLength: 1, maxLength: 1000 } }, required: ['task_id','source_path'], additionalProperties: false } },
  { name: 'wildbound_garage_approve_task', description: 'Approve a specific artifact and start Unreal import. Call only when the user explicitly asks to approve that task; otherwise leave it for review in the Garage UI.', inputSchema: { type: 'object', properties: { task_id: { type: 'string', minLength: 36, maxLength: 36 } }, required: ['task_id'], additionalProperties: false } },
  { name: 'wildbound_garage_reject_task', description: 'Reject a specific artifact. Call only when the user explicitly asks to reject that task; otherwise leave it for review.', inputSchema: { type: 'object', properties: { task_id: { type: 'string', minLength: 36, maxLength: 36 } }, required: ['task_id'], additionalProperties: false } },
  { name: 'wildbound_garage_retry_import', description: 'Retry Unreal import for a previously approved artifact after a failed or interrupted import.', inputSchema: { type: 'object', properties: { task_id: { type: 'string', minLength: 36, maxLength: 36 } }, required: ['task_id'], additionalProperties: false } },
  { name: 'wildbound_publish_generated_assets', description: 'Commit and push only explicitly selected absolute file paths under WildBound Content/GeneratedAIAssets to the public WildBound GitHub repository. Call only after the user explicitly asks to publish. Refuses to run if anything is already staged, and never includes unrelated changes.', inputSchema: { type: 'object', properties: { files: { type: 'array', minItems: 1, maxItems: 6, items: { type: 'string', maxLength: 500 } }, commit_message: { type: 'string', minLength: 8, maxLength: 120 } }, required: ['files','commit_message'], additionalProperties: false } }
];
function respond(message) { process.stdout.write(JSON.stringify(message) + '\n'); }
function textResult(text, image) { return { content: [{ type: 'text', text }, ...(image ? [image] : [])] }; }
async function fetchJson(url, options = {}, timeoutMs = 30_000) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(timeoutMs) });
  let value = {};
  try { value = await response.json(); } catch { }
  if (!response.ok) { const error = new Error(value.error || `Local service returned HTTP ${response.status}.`); error.details = value; throw error; }
  return value;
}
function garageHeaders(extra = {}) {
  const tokenPath = path.join(__dirname, 'runtime', 'control-token.txt');
  if (!fs.existsSync(tokenPath)) throw new Error('The local Garage token is missing. Open WildBound AI Garage to start the production service.');
  return { Authorization: `Bearer ${fs.readFileSync(tokenPath, 'utf8').trim()}`, ...extra };
}
async function garageRequest(route, options = {}, timeoutMs = 30_000) {
  try { return await fetchJson(`${GARAGE}${route}`, { ...options, headers: garageHeaders(options.headers) }, timeoutMs); }
  catch (error) {
    if (error.cause?.code === 'ECONNREFUSED' || /fetch failed/i.test(error.message)) throw new Error('The Garage production service is offline. Open WildBound AI Garage and retry; its shared task queue is available while the Garage is running.');
    throw error;
  }
}
async function garageStatus() {
  try { return textResult(JSON.stringify(await garageRequest('/status'), null, 2)); }
  catch (error) { return textResult(JSON.stringify({ available: false, error: error.message })); }
}
async function garageListTasks(args) {
  const query=new URLSearchParams();if(args.limit)query.set('limit',String(args.limit));if(args.status)query.set('status',args.status);
  const result=await garageRequest('/jobs'+(query.size?'?'+query.toString():''));
  return textResult(JSON.stringify({total:result.total,activeJob:result.activeJob,jobs:(result.jobs||[]).map(job=>({id:job.id,prompt:job.prompt,kind:job.brief?.kind||job.kind,status:job.status,createdAt:job.createdAt,updatedAt:job.updatedAt,agentRuns:job.agentRuns,error:job.error,artifact:job.artifact?{kind:job.artifact.kind,sha256:job.artifact.sha256,bytes:job.artifact.bytes}:null}))},null,2));
}
async function garageGetTask(args) {
  if(!/^[0-9a-f-]{36}$/i.test(args.task_id||''))throw new Error('Provide a valid Garage task ID.');
  const job=await garageRequest('/jobs/'+encodeURIComponent(args.task_id));
  let preview;
  if(args.return_preview!==false&&job.artifact&&['texture','voice','music','ambience','sfx'].includes(job.artifact.kind)){
    const response=await fetch(`${GARAGE}/jobs/${encodeURIComponent(args.task_id)}/files/preview`,{headers:garageHeaders(),signal:AbortSignal.timeout(30_000)});
    if(response.ok){const data=Buffer.from(await response.arrayBuffer()).toString('base64');preview=job.artifact.kind==='texture'?{type:'image',data,mimeType:response.headers.get('content-type')||'image/png'}:{type:'audio',data,mimeType:response.headers.get('content-type')||'audio/wav'};}
  }
  return textResult(JSON.stringify(job,null,2),preview);
}
async function garageJobAction(args,action,payload={}) {
  if(!/^[0-9a-f-]{36}$/i.test(args.task_id||''))throw new Error('Provide a valid Garage task ID.');
  const result=await garageRequest('/jobs/'+encodeURIComponent(args.task_id)+'/'+action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  return textResult(JSON.stringify(result,null,2));
}
async function workshopStatus() {
  const [local, image, audio, production] = await Promise.allSettled([
    fetchJson(`${DASHBOARD}/api/health`, {}, 2500),
    fetchJson(`${IMAGE}/api/status`, {}, 2500),
    fetchJson(`${AUDIO}/api/status`, {}, 2500),
    garageRequest('/status', {}, 2500)
  ]);
  const value = { privacy: 'Generation uses local inference; no prompts or media are sent to cloud model APIs.', localAi: local.status === 'fulfilled' ? local.value : { available: false }, imageStudio: image.status === 'fulfilled' ? { available: true, ...image.value } : { available: false }, audioStudio: audio.status === 'fulfilled' ? { available: true, ...audio.value } : { available: false, note: 'Audio generation service is not installed or running.' }, productionTeam: production.status === 'fulfilled' ? { available: true, ...production.value } : { available: false, note: production.reason?.message || 'Open the Garage UI to start the shared production service.' } };
  return textResult(JSON.stringify(value, null, 2));
}
async function generateImage(args) {
  if (imageBusy) throw new Error('The local image engine is already serving another generation. Try again when it finishes.');
  imageBusy = true;
  let prepared = false;
  try {
    const prep = await fetchJson(`${IMAGE}/api/prepare`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }, 180_000);
    prepared = Boolean(prep.ready);
    let started;
    let result;
    for (let attempt = 0; attempt < 2; attempt++) {
      started = await fetchJson(`${IMAGE}/api/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: args.prompt, intent: args.intent || 'environment', biome: args.biome || 'greenveil', width: args.width || 1024, height: args.height || 1024 }) }, 30_000);
      const startedAt = Date.now();
      let retryUnusableImage = false;
      while (Date.now() - startedAt < 15 * 60_000) {
        await wait(1200);
        result = await fetchJson(`${IMAGE}/api/history/${encodeURIComponent(started.prompt_id)}`, {}, 15_000);
        if (result.status) {
          if (attempt === 0 && result.status.startsWith('IMAGE_QUALITY:')) {
            process.stderr.write('Image Studio rejected a flat output; retrying once with a fresh seed.\n');
            retryUnusableImage = true;
            break;
          }
          throw new Error(`Image generation failed: ${result.status}`);
        }
        if (result.done) break;
      }
      if (result?.done) break;
      if (retryUnusableImage) continue;
      throw new Error('Image generation exceeded 15 minutes. The local engine may still be busy; check Workshop status before retrying.');
    }
    if (!result?.done) throw new Error(`Local image was rejected after one clean retry: ${result?.status || 'no usable image was returned'}`);
    let importResult = null;
    if (args.add_to_unreal !== false) {
      importResult = await fetchJson(`${IMAGE}/api/import-to-game`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: result.filename, subfolder: result.subfolder || '', prompt: started.prompt, seed: started.seed }) }, 240_000);
    }
    let preview;
    if (args.return_preview !== false) {
      try {
        const imageResponse = await fetch(IMAGE + result.image, { signal: AbortSignal.timeout(30_000) });
        if (imageResponse.ok) preview = { type: 'image', data: Buffer.from(await imageResponse.arrayBuffer()).toString('base64'), mimeType: imageResponse.headers.get('content-type') || 'image/png' };
      } catch { }
    }
    const output = {
      model: started.model || 'DreamShaper XL Lightning (local ComfyUI)', seed: started.seed,
      userPrompt: args.prompt, appliedPrompt: started.prompt, styleProfile: started.styleProfile,
      localImagePath: `${path.join(process.env.WILDBOUND_IMAGE_ROOT || path.join(__dirname, 'runtime', 'images'), result.filename)}`,
      unrealAssetPath: importResult?.assetPath || null,
      unrealSourcePath: importResult?.filePath || null,
      unrealMetadataPath: importResult?.metadataPath || null,
      importedAsTexture2D: importResult?.imported || false,
      unrealTextureAssetFile: importResult?.imported && fs.existsSync(importResult.assetFilePath) ? importResult.assetFilePath : null,
      importNote: importResult?.note || 'Not imported; use Add to Unreal from Image Studio when ready.'
    };
    return textResult(JSON.stringify(output, null, 2), preview);
  } finally {
    if (prepared) {
      try { await fetchJson(`${IMAGE}/api/release`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }, 30_000); }
      catch (error) { process.stderr.write(`Image backend cleanup warning: ${error.message}\n`); }
    }
    imageBusy = false;
  }
}
async function generateAudio(args) {
  if (!['music','ambience'].includes(args.kind)) throw new Error('The installed offline model supports instrumental music and musical ambience; dedicated sound effects and spoken voices need separate models.');
  try {
  const started = await fetchJson(`${AUDIO}/api/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...args, seconds: args.seconds || 8 }) }, 180_000);
  const startedAt = Date.now();
  let result;
  while (Date.now() - startedAt < 15 * 60_000) {
    await wait(1500);
    result = await fetchJson(`${AUDIO}/api/history/${encodeURIComponent(started.prompt_id)}`, {}, 15_000);
    if (result.status) throw new Error(`Local audio generation failed: ${result.status}`);
    if (result.done) break;
  }
  if (!result?.done) throw new Error('Local audio exceeded 15 minutes. Stop here rather than retrying automatically; Codex can take over the task, and cloud audio requires user approval.');
  const source = path.resolve(process.env.WILDBOUND_IMAGE_ROOT || path.join(__dirname, 'runtime', 'images'), result.subfolder || '', result.filename);
  const outputRoot = fs.realpathSync(process.env.WILDBOUND_IMAGE_ROOT || path.join(__dirname, 'runtime', 'images'));
  const sourceReal = fs.realpathSync(source);
  if (!sourceReal.startsWith(outputRoot + path.sep) || !/\.mp3$/i.test(sourceReal)) throw new Error('Generated audio resolved outside the local media output folder.');
  const outputDir = path.join(REPO, 'Content', 'GeneratedAIAssets', 'AudioStudio');
  fs.mkdirSync(outputDir, { recursive: true });
  const output = path.join(outputDir, path.basename(sourceReal));
  fs.copyFileSync(sourceReal, output, fs.constants.COPYFILE_EXCL);
  const assetName = `WildBoundAI_${Date.now()}_${result.seed}`;
  const wavPath = path.join(outputDir, `${assetName}.wav`);
  const converter = path.join(__dirname, 'convert-wildbound-audio.py');
  const python = process.env.WILDBOUND_IMAGE_PYTHON || 'python';
  const converted = spawnSync(python, [converter, sourceReal, wavPath], { encoding: 'utf8', timeout: 60_000, windowsHide: true, maxBuffer: 1_000_000 });
  const conversionNote = converted.error?.message || (converted.status === 0 ? '' : (converted.stderr || 'WAV conversion failed.').trim());
  let importResult = null;
  let importNote = conversionNote;
  if (!conversionNote) {
    const importer = path.join(__dirname, 'Import-WildBoundAudio.ps1');
    const imported = spawnSync('powershell.exe', ['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',importer,'-SourceWav',wavPath,'-AssetName',assetName], { encoding: 'utf8', timeout: 240_000, windowsHide: true, maxBuffer: 1_000_000 });
    const assetFile = path.join(outputDir, `${assetName}.uasset`);
    if (imported.status === 0 && fs.existsSync(assetFile)) importResult = { assetPath: `/Game/GeneratedAIAssets/AudioStudio/${assetName}`, assetFile };
    else importNote = imported.error?.message || (imported.stderr || imported.stdout || 'Unreal did not import a SoundWave.').trim().slice(-1600);
  }
  const metadataPath = output + '.json';
  fs.writeFileSync(metadataPath, JSON.stringify({ source: 'WildBound Audio Studio', model: result.model, kind: result.kind, prompt: args.prompt, seed: result.seed, seconds: result.seconds, generatedAudio: path.basename(sourceReal), unrealWavSource: conversionNote ? null : wavPath, unrealAssetPath: importResult?.assetPath || null, createdAt: new Date().toISOString(), note: 'Local instrumental music/musical ambience source. Dedicated effects/voice model is not installed.' }, null, 2), { flag: 'wx' });
  const previewWanted = args.return_preview !== false;
  const audio = previewWanted ? { type: 'audio', data: fs.readFileSync(output).toString('base64'), mimeType: 'audio/mpeg' } : null;
  return textResult(JSON.stringify({ ...result, localOnly: true, localAudioPath: output, metadataPath, unrealSourcePath: conversionNote ? output : wavPath, unrealAssetPath: importResult?.assetPath || null, unrealAudioAssetFile: importResult?.assetFile || null, importedAsSoundWave: Boolean(importResult), importNote: importNote || 'Imported as a SoundWave.', note: 'Generated locally; copied into the Unreal project. GitHub publishing remains a separate explicit step.' }, null, 2), audio);
  } finally {
    try { await fetchJson(`${IMAGE}/api/release`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }, 30_000); }
    catch (error) { process.stderr.write(`Audio backend cleanup warning: ${error.message}\n`); }
  }
}
function git(args, timeout = 30_000) {
  const result = spawnSync('git', ['-C', REPO, ...args], { encoding: 'utf8', timeout, windowsHide: true, env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error((result.stderr || result.stdout || `git exited ${result.status}`).trim().slice(0, 1800));
  return (result.stdout || '').trim();
}
function publishGeneratedAssets(args) {
  if (!Array.isArray(args.files) || args.files.length < 1 || args.files.length > 6) throw new Error('Select between one and six generated files.');
  if (typeof args.commit_message !== 'string' || args.commit_message.trim().length < 8 || args.commit_message.length > 120) throw new Error('Provide a clear commit message between 8 and 120 characters.');
  if (!fs.existsSync(path.join(REPO, '.git'))) throw new Error('The configured WildBound Git repository is unavailable.');
  const remote = git(['remote','get-url','origin']);
  if (!/^((https:\/\/github\.com\/Systemkill90\/WildBound\.git)|(git@github\.com:Systemkill90\/WildBound\.git))$/i.test(remote)) throw new Error('Refusing to publish: origin is not the approved WildBound GitHub repository.');
  if (git(['diff','--cached','--name-only'])) throw new Error('Refusing to publish while unrelated or pre-existing changes are staged. Review or unstage them first.');
  const allowed = [];
  for (const file of args.files) {
    if (typeof file !== 'string') throw new Error('Generated file paths must be strings.');
    const full = path.resolve(file);
    const relative = path.relative(REPO, full).split(path.sep).join('/');
    if (!relative.startsWith('Content/GeneratedAIAssets/') || relative.split('/').includes('..') || !/\.(png|jpe?g|webp|wav|ogg|mp3|json|uasset)$/i.test(relative)) throw new Error(`Refusing to publish an unsupported or out-of-scope file: ${file}`);
    if (!fs.existsSync(full) || !fs.statSync(full).isFile()) throw new Error(`Generated asset does not exist: ${relative}`);
    const real = fs.realpathSync(full);
    const realRelative = path.relative(REPO, real).split(path.sep).join('/');
    if (!realRelative.startsWith('Content/GeneratedAIAssets/') || realRelative.split('/').includes('..')) throw new Error(`Refusing to publish a file that resolves outside generated assets: ${relative}`);
    if (!allowed.includes(relative)) allowed.push(relative);
  }
  // /Content/** stays ignored by design; force-add only exact, validated files
  // the user explicitly selected through this publisher tool.
  git(['add','-f','--',...allowed]);
  const staged = git(['diff','--cached','--name-only']).split(/\r?\n/).filter(Boolean).sort();
  if (JSON.stringify(staged) !== JSON.stringify([...allowed].sort())) throw new Error('Staged file list did not match the selected generated assets; refusing to commit.');
  git(['-c','user.useConfigOnly=true','commit','-m',args.commit_message.trim()], 120_000);
  const commit = git(['rev-parse','--short','HEAD']);
  try { git(['push','origin','HEAD'], 180_000); }
  catch (error) { return textResult(JSON.stringify({ committedLocally: true, pushed: false, commit, files: allowed, error: error.message }, null, 2)); }
  return textResult(JSON.stringify({ committedLocally: true, pushed: true, commit, files: allowed, remote }, null, 2));
}
async function callTool(name, args) {
  if (name === 'wildbound_workshop_status') return workshopStatus();
  if (name === 'wildbound_garage_status') return garageStatus();
  if (name === 'wildbound_garage_list_tasks') return garageListTasks(args);
  if (name === 'wildbound_garage_submit_task') {
    if (typeof args.prompt !== 'string' || !args.prompt.trim() || args.prompt.length > 4000) throw new Error('Provide a production prompt from 1 to 4,000 characters.');
    return textResult(JSON.stringify(await garageRequest('/jobs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(args)},30_000),null,2));
  }
  if (name === 'wildbound_garage_get_task') return garageGetTask(args);
  if (name === 'wildbound_garage_cancel_task') return garageJobAction(args,'cancel');
  if (name === 'wildbound_garage_attach_model') {
    if (typeof args.source_path !== 'string' || !/\.(glb|fbx)$/i.test(args.source_path)) throw new Error('Choose a local GLB or FBX model source.');
    return garageJobAction(args,'attach',{sourcePath:args.source_path});
  }
  if (name === 'wildbound_garage_approve_task') return garageJobAction(args,'approve');
  if (name === 'wildbound_garage_reject_task') return garageJobAction(args,'reject');
  if (name === 'wildbound_garage_retry_import') return garageJobAction(args,'retry-import');
  if (name === 'wildbound_generate_image') {
    if (typeof args.prompt !== 'string' || !args.prompt.trim() || args.prompt.length > 4000) throw new Error('Provide an image prompt from 1 to 4,000 characters.');
    return generateImage(args);
  }
  if (name === 'wildbound_generate_audio') {
    if (typeof args.prompt !== 'string' || !args.prompt.trim() || args.prompt.length > 3000) throw new Error('Provide an audio prompt from 1 to 3,000 characters.');
    return generateAudio(args);
  }
  if (name === 'wildbound_publish_generated_assets') return publishGeneratedAssets(args);
  throw new Error(`Unknown WildBound Workshop tool: ${name}`);
}
async function handle(message) {
  const { id, method, params } = message || {};
  if (method === 'notifications/initialized' || method === 'notifications/cancelled') return;
  if (method === 'ping') return respond({ jsonrpc: '2.0', id, result: {} });
  if (method === 'initialize') return respond({ jsonrpc: '2.0', id, result: { protocolVersion: '2024-11-05', capabilities: { tools: { listChanged: false } }, serverInfo: { name: 'wildbound-workshop', version: '1.0.0' } } });
  if (method === 'tools/list') return respond({ jsonrpc: '2.0', id, result: { tools } });
  if (method === 'tools/call') {
    try { return respond({ jsonrpc: '2.0', id, result: await callTool(params?.name, params?.arguments || {}) }); }
    catch (error) { return respond({ jsonrpc: '2.0', id, result: { isError: true, content: [{ type: 'text', text: error.details ? JSON.stringify(error.details, null, 2) : (error.message || 'WildBound Workshop operation failed.') }] } }); }
  }
  if (id !== undefined) respond({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } });
}
const input = readline.createInterface({ input: process.stdin, crlfDelay: Infinity, terminal: false });
input.on('line', line => { try { void handle(JSON.parse(line)); } catch (error) { process.stderr.write(`Invalid MCP request: ${error.message}\n`); respond({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }); } });
