'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawn } = require('node:child_process');

const HOST = '127.0.0.1';
const PORT = 8200;
const COMFY = 'http://127.0.0.1:8188';
const MODEL = 'ace_step_v1_3.5b.safetensors';
const MODEL_FILE = process.env.WILDBOUND_AUDIO_MODEL_FILE || MODEL;
const OUTPUT_ROOT = process.env.WILDBOUND_IMAGE_ROOT || path.join(__dirname, 'runtime', 'images');
const LAUNCHER = process.env.WILDBOUND_IMAGE_LAUNCHER || '';
const PAGE = path.join(__dirname, 'audio-studio.html');
const VOICE_ROOT = process.env.WILDBOUND_VOICE_ROOT || path.join(__dirname, 'runtime', 'voice');
const VOICE_MODEL = path.join(VOICE_ROOT, 'models', 'kokoro-v1.0.int8.onnx');
const VOICE_STYLES = path.join(VOICE_ROOT, 'models', 'voices-v1.0.bin');
const VOICE_PYTHON = process.env.WILDBOUND_VOICE_PYTHON || 'python';
const VOICE_WORKER = path.join(__dirname, 'voice-worker.py');
const VOICE_OUTPUT = path.join(VOICE_ROOT, 'Generated');
const jobs = new Map();
let activeJob = null;

function send(res, status, value, type = 'application/json; charset=utf-8') {
  const body = Buffer.isBuffer(value) ? value : Buffer.from(type.startsWith('application/json') ? JSON.stringify(value) : String(value));
  res.writeHead(status, { 'Content-Type': type, 'Content-Length': body.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(body);
}
function fail(res, status, error, extra = {}) { send(res, status, { error, ...extra }); }
function bodyJson(req, max = 12_000) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; if (raw.length > max) { reject(new Error('Request is too large.')); req.destroy(); } });
    req.on('end', () => { try { resolve(JSON.parse(raw || '{}')); } catch { reject(new Error('Invalid JSON request.')); } });
    req.on('error', reject);
  });
}
async function comfy(route, options = {}, timeout = 10_000) {
  const response = await fetch(COMFY + route, { ...options, signal: AbortSignal.timeout(timeout) });
  const value = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(value.error?.message || value.error || `ComfyUI returned HTTP ${response.status}.`);
  return value;
}
function runLauncher() {
  return new Promise((resolve, reject) => {
    const child = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', LAUNCHER, '-BackendOnly'], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    child.stderr.on('data', data => { stderr = (stderr + data.toString()).slice(-3000); });
    const timer = setTimeout(() => { child.kill(); reject(new Error('The local GPU engine startup timed out.')); }, 150_000);
    child.once('error', error => { clearTimeout(timer); reject(error); });
    child.once('close', code => { clearTimeout(timer); code === 0 ? resolve() : reject(new Error(stderr.trim() || `GPU engine launcher returned ${code}.`)); });
  });
}
async function status() {
  const result = { available: fs.existsSync(MODEL_FILE), ready: false, engine: 'ComfyUI AMD ROCm GPU', model: MODEL, localOnly: true, supports: ['music', 'ambience'] };
  result.voiceAvailable = fs.existsSync(VOICE_MODEL) && fs.existsSync(VOICE_STYLES) && fs.existsSync(VOICE_PYTHON);
  result.voiceModel = result.voiceAvailable ? 'Kokoro 82M · CPU · offline' : null;
  if (result.voiceAvailable) result.supports.push('spoken voice');
  if (!result.available) { result.note = 'ACE-Step weights are not fully installed.'; return result; }
  try {
    const [system, node] = await Promise.all([comfy('/system_stats'), comfy('/object_info/CheckpointLoaderSimple')]);
    const options = node?.CheckpointLoaderSimple?.input?.required?.ckpt_name?.[0] || [];
    result.ready = options.includes(MODEL);
    result.note = result.ready ? 'Ready; inference stays on this PC.' : 'GPU engine is running, but the audio checkpoint is not visible yet.';
    result.gpu = system?.devices?.[0]?.name || 'AMD GPU';
  } catch { result.note = 'Installed locally; GPU engine sleeps until generation is requested.'; }
  return result;
}
async function handle(req, res) {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  if (req.method === 'GET' && url.pathname === '/') {
    try { return send(res, 200, await fs.promises.readFile(PAGE), 'text/html; charset=utf-8'); }
    catch { return fail(res, 500, 'Audio Studio page is missing.'); }
  }
  if (req.method === 'GET' && url.pathname === '/api/status') return send(res, 200, await status());
  if (req.method === 'POST' && url.pathname === '/api/voice/generate') {
    let args;
    try { args = await bodyJson(req, 8_000); } catch (error) { return fail(res, 400, error.message); }
    if (!(await status()).voiceAvailable) return fail(res, 503, 'The offline Kokoro voice model is not installed.');
    const text = String(args.text || '').trim();
    if (!text || text.length > 1_500) return fail(res, 400, 'Enter text from 1 to 1,500 characters.');
    const voice = ['af_bella', 'af_nicole', 'am_adam'].includes(args.voice) ? args.voice : 'af_bella';
    const speed = Math.min(1.15, Math.max(0.8, Number(args.speed) || 0.96));
    const stamp = new Date().toISOString().replace(/[-:.]/g, '').replace('T', '_').replace('Z', '');
    const filename = `wildbound_voice_${stamp}_${Math.random().toString(16).slice(2, 8)}.wav`;
    const output = path.join(VOICE_OUTPUT, filename);
    const nativeSource = path.join(VOICE_OUTPUT, 'Native', filename);
    try {
      await fs.promises.mkdir(VOICE_OUTPUT, { recursive: true });
      await fs.promises.mkdir(path.dirname(nativeSource), { recursive: true });
      const workerInfo = await new Promise((resolve, reject) => {
        const child = spawn(VOICE_PYTHON, ['-u', VOICE_WORKER, '--voice', voice, '--speed', String(speed), '--output', output, '--native-output', nativeSource], {
          windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'],
          env: { ...process.env, OMP_NUM_THREADS: '8', OPENBLAS_NUM_THREADS: '8', OMP_WAIT_POLICY: 'PASSIVE' }
        });
        let stdout = '';
        let stderr = '';
        child.stdout.on('data', chunk => { stdout = (stdout + chunk.toString()).slice(-2_000); });
        child.stderr.on('data', chunk => { stderr = (stderr + chunk.toString()).slice(-3_000); });
        const timer = setTimeout(() => { child.kill(); reject(new Error('Local voice generation exceeded three minutes.')); }, 180_000);
        child.once('error', error => { clearTimeout(timer); reject(error); });
        child.once('close', code => {
          clearTimeout(timer);
          if (code !== 0) return reject(new Error(stderr.trim() || `Voice renderer exited with code ${code}.`));
          try { resolve(JSON.parse(stdout.trim())); }
          catch { reject(new Error('Voice renderer did not return valid export metadata.')); }
        });
        child.stdin.end(JSON.stringify({ text }));
      });
      const stat = await fs.promises.stat(output);
      if (stat.size < 2_000) throw new Error('Voice renderer returned an empty audio file.');
      return send(res, 200, { done: true, filename, nativeSourcePath: nativeSource, voice, model: 'Kokoro 82M INT8 · CPU', ...workerInfo, seconds: null, url: `/api/voice/view?filename=${encodeURIComponent(filename)}` });
    } catch (error) { await Promise.all([fs.promises.rm(output, { force: true }), fs.promises.rm(nativeSource, { force: true })]); return fail(res, 503, `Offline voice generation failed: ${error.message}`); }
  }
  if (req.method === 'GET' && url.pathname === '/api/voice/view') {
    const filename = url.searchParams.get('filename') || '';
    if (!/^wildbound_voice_[0-9_]+_[a-f0-9]+\.wav$/i.test(filename)) return fail(res, 400, 'Invalid voice file reference.');
    try {
      const file = path.join(VOICE_OUTPUT, filename);
      const data = await fs.promises.readFile(file);
      res.writeHead(200, { 'Content-Type': 'audio/wav', 'Content-Length': data.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      return res.end(data);
    } catch { return fail(res, 404, 'Generated voice clip was not found.'); }
  }
  if (req.method === 'POST' && url.pathname === '/api/generate') {
    if (activeJob) return fail(res, 409, 'Audio generation is already running.');
    let args;
    try { args = await bodyJson(req); } catch (error) { return fail(res, 400, error.message); }
    const kind = args.kind || 'music';
    if (!['music', 'ambience'].includes(kind)) return fail(res, 422, 'This offline ACE-Step model generates music and musical ambience. Dedicated sound-effects and spoken-voice models are not installed.');
    const userPrompt = String(args.prompt || '').trim();
    if (!userPrompt || userPrompt.length > 3000) return fail(res, 400, 'Enter a prompt from 1 to 3,000 characters.');
    const seconds = Math.min(20, Math.max(4, Math.round(Number(args.seconds) || 8)));
    try {
      if (!fs.existsSync(MODEL_FILE)) return fail(res, 503, 'The ACE-Step model file is not installed.');
      const freeRamGiB = os.freemem() / (1024 ** 3);
      if (freeRamGiB < 12) return fail(res, 503, `Local generation paused to protect other work: only ${freeRamGiB.toFixed(1)} GiB RAM is free.`, { handoff: 'codex', cloudAudioRequiresUserApproval: true, localRetry: false });
      if (!(await status()).ready) await runLauncher();
      const queue = await comfy('/queue');
      if ((queue.queue_running || []).length || (queue.queue_pending || []).length) return fail(res, 409, 'The shared image/audio GPU is already busy.', { handoff: 'codex', cloudAudioRequiresUserApproval: true, localRetry: false });
      const tags = kind === 'ambience'
        ? `instrumental, environmental ambient music, natural acoustic textures, restrained, organic, field recording inspired, no vocals, ${userPrompt}`
        : `instrumental cinematic game score, natural orchestral palette, restrained quietly magical atmosphere, no vocals, ${userPrompt}`;
      const seed = Math.floor(Math.random() * 0x7fffffff);
      const stamp = new Date().toISOString().replace(/[-:.]/g, '').replace('T', '_').replace('Z', '');
      const prompt = {
        '1': { class_type: 'CheckpointLoaderSimple', inputs: { ckpt_name: MODEL } },
        '2': { class_type: 'TextEncodeAceStepAudio', inputs: { clip: ['1', 1], tags, lyrics: '[inst]', lyrics_strength: 1 } },
        '3': { class_type: 'EmptyAceStepLatentAudio', inputs: { seconds, batch_size: 1 } },
        '4': { class_type: 'ConditioningZeroOut', inputs: { conditioning: ['2', 0] } },
        '5': { class_type: 'ModelSamplingSD3', inputs: { model: ['1', 0], shift: 5 } },
        '6': { class_type: 'LatentOperationTonemapReinhard', inputs: { multiplier: 1 } },
        '7': { class_type: 'LatentApplyOperationCFG', inputs: { model: ['5', 0], operation: ['6', 0] } },
        '8': { class_type: 'KSampler', inputs: { model: ['7', 0], positive: ['2', 0], negative: ['4', 0], latent_image: ['3', 0], seed, steps: 30, cfg: 5, sampler_name: 'euler', scheduler: 'simple', denoise: 1 } },
        '9': { class_type: 'VAEDecodeAudio', inputs: { samples: ['8', 0], vae: ['1', 2] } },
        '10': { class_type: 'SaveAudioMP3', inputs: { audio: ['9', 0], filename_prefix: `wildbound_audio/WildBound_${stamp}`, quality: '320k' } }
      };
      const queued = await comfy('/prompt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, client_id: 'wildbound-workshop' }) });
      activeJob = queued.prompt_id;
      jobs.set(activeJob, { startedAt: Date.now(), prompt: userPrompt, kind, seconds, seed });
      return send(res, 200, { prompt_id: activeJob, model: MODEL, kind, seconds, seed, localOnly: true });
    } catch (error) { activeJob = null; return fail(res, 503, `Local audio job could not start: ${error.message}`); }
  }
  if (req.method === 'GET' && url.pathname.startsWith('/api/history/')) {
    const id = url.pathname.slice('/api/history/'.length);
    if (!/^[a-f0-9-]{20,40}$/i.test(id)) return fail(res, 400, 'Invalid job id.');
    try {
      const history = await comfy('/history/' + encodeURIComponent(id));
      const item = history[id];
      if (!item) return send(res, 200, { done: false });
      const output = Object.values(item.outputs || {}).find(value => Array.isArray(value.audio) && value.audio.length)?.audio?.[0];
      if (!output) {
        const error = item.status?.messages?.slice(-1)?.[0]?.[1]?.exception_message;
        if (error) { jobs.delete(id); if (activeJob === id) activeJob = null; return send(res, 200, { done: false, status: String(error).slice(0, 1200) }); }
        return send(res, 200, { done: false });
      }
      const job = jobs.get(id);
      jobs.delete(id); if (activeJob === id) activeJob = null;
      return send(res, 200, { done: true, filename: output.filename, subfolder: output.subfolder || '', type: output.type || 'output', model: MODEL, kind: job?.kind, seconds: job?.seconds, seed: job?.seed, elapsedSeconds: job ? Math.round((Date.now() - job.startedAt) / 1000) : null, url: `/api/view?filename=${encodeURIComponent(output.filename)}&subfolder=${encodeURIComponent(output.subfolder || '')}&type=${encodeURIComponent(output.type || 'output')}` });
    } catch (error) { return fail(res, 502, error.message); }
  }
  if (req.method === 'GET' && url.pathname === '/api/view') {
    const filename = url.searchParams.get('filename') || '';
    const subfolder = url.searchParams.get('subfolder') || '';
    const type = url.searchParams.get('type') || 'output';
    if (!/^[A-Za-z0-9_.-]+\.mp3$/i.test(filename) || !/^[A-Za-z0-9_./-]*$/.test(subfolder) || subfolder.split('/').includes('..') || type !== 'output') return fail(res, 400, 'Invalid audio file reference.');
    try {
      const response = await fetch(`${COMFY}/view?filename=${encodeURIComponent(filename)}&subfolder=${encodeURIComponent(subfolder)}&type=output`, { signal: AbortSignal.timeout(30_000) });
      if (!response.ok) return fail(res, response.status, 'Generated audio could not be read.');
      const data = Buffer.from(await response.arrayBuffer());
      res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Content-Length': data.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      return res.end(data);
    } catch (error) { return fail(res, 502, error.message); }
  }
  return fail(res, 404, 'Not found.');
}
http.createServer((req, res) => handle(req, res).catch(error => fail(res, 500, error.message)))
  .listen(PORT, HOST, () => console.log(`WildBound Audio Studio listening on http://${HOST}:${PORT}`));
