const STORAGE_KEY = "wildbound-local-chats-v1";
const CURRENT_KEY = "wildbound-local-current-v1";
const $ = (selector) => document.querySelector(selector);

let chats = loadChats();
let currentId = localStorage.getItem(CURRENT_KEY) || null;
let busy = false;
let health = null;
let activityEntries = [];
let usageData = null;
let activeView = 'chat';
let imageStudioRequested = false;
let audioStudioRequested = false;
let assetStudioRequested = false;

const welcome = $("#welcome");
const conversation = $("#conversation");
const composer = $("#composer");
const input = $("#promptInput");
const sendButton = $("#sendButton");
const statusPill = $("#connectionStatus");
const offlineHint = $("#offlineHint");
const modelSelect = $("#modelSelect");
const contextToggle = $("#contextToggle");

function loadChats() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chats.slice(0, 30)));
  if (currentId) localStorage.setItem(CURRENT_KEY, currentId);
}

function activeChat() { return chats.find((chat) => chat.id === currentId); }

function newChat(focus = true) {
  showView('chat');
  currentId = crypto.randomUUID();
  chats.unshift({ id: currentId, title: "New chat", messages: [] });
  persist();
  render();
  if (focus) input.focus();
}

function selectChat(id) { currentId = id; showView('chat'); persist(); render(); }

function renderSidebar() {
  const list = $("#chatList");
  list.replaceChildren();
  for (const chat of chats.slice(0, 24)) {
    const button = document.createElement("button");
    button.className = `history-item${chat.id === currentId ? " active" : ""}`;
    button.type = "button";
    const icon = document.createElement("span");
    icon.textContent = "◷";
    const title = document.createElement("span");
    title.className = "history-title";
    title.textContent = chat.title || "New chat";
    button.append(icon, title);
    button.addEventListener("click", () => selectChat(chat.id));
    list.append(button);
  }
}

function addFormattedText(parent, text) {
  const lines = String(text).split("\n");
  let paragraph = [];
  let code = null;
  const flush = () => {
    if (!paragraph.length) return;
    const p = document.createElement("p");
    p.textContent = paragraph.join(" ");
    parent.append(p);
    paragraph = [];
  };
  for (const line of lines) {
    if (line.trim().startsWith("```") ) {
      flush();
      if (code) { parent.append(code); code = null; }
      else { code = document.createElement("pre"); }
      continue;
    }
    if (code) { code.textContent += (code.textContent ? "\n" : "") + line; continue; }
    if (!line.trim()) { flush(); continue; }
    paragraph.push(line.replace(/^#{1,4}\s+/, "").replace(/`([^`]+)`/g, "$1").replace(/\*\*(.*?)\*\*/g, "$1"));
  }
  flush();
  if (code) parent.append(code);
}

function render() {
  renderSidebar();
  const chat = activeChat();
  const messages = chat?.messages || [];
  welcome.hidden = activeView !== 'chat' || messages.length > 0;
  conversation.hidden = activeView !== 'chat' || messages.length === 0;
  conversation.replaceChildren();
  for (const message of messages) {
    conversation.append(renderMessage(message));
  }
  conversation.scrollTop = conversation.scrollHeight;
  $(".chip-state").textContent = contextToggle.checked ? "ON" : "OFF";
}

function showView(view) {
  activeView = view;
  const isChat = view === 'chat';
  const isActivity = view === 'activity';
  const isProductionStudio = view === 'production-studio';
  const isImageStudio = view === 'image-studio';
  const isAudioStudio = view === 'audio-studio';
  const isAssetStudio = view === 'asset-studio';
  $('#activityViewButton').classList.toggle('active', isActivity);
  $('#productionStudioButton').classList.toggle('active', isProductionStudio);
  $('#imageStudioViewButton').classList.toggle('active', isImageStudio);
  $('#audioStudioViewButton').classList.toggle('active', isAudioStudio);
  $('#assetStudioButton').classList.toggle('active', isAssetStudio);
  $('#welcome').hidden = !isChat || (activeChat()?.messages.length || 0) > 0;
  $('#conversation').hidden = !isChat || !(activeChat()?.messages.length || 0);
  $('.composer-wrap').hidden = !isChat;
  $('#activityView').hidden = !isActivity;
  $('#productionStudioView').hidden = !isProductionStudio;
  $('#imageStudioView').hidden = !isImageStudio;
  $('#audioStudioView').hidden = !isAudioStudio;
  $('#assetStudioView').hidden = !isAssetStudio;
  if (isActivity) refreshActivity();
  window.WildBoundProductionStudio?.setVisible(isProductionStudio);
  if (isImageStudio) openImageStudio();
  if (isAudioStudio) openAudioStudio();
  const assetFrame = $('#assetStudioFrame');
  if (isAssetStudio) openAssetStudio();
  assetFrame.contentWindow?.postMessage({ type: 'asset-studio-visibility', visible: isAssetStudio }, window.location.origin);
}

function setGarageCard(id, tone, value, detail) {
  const card = document.getElementById(id);
  if (!card) return;
  card.className = `garage-status-card ${tone}`;
  card.querySelector('.status-value').textContent = value;
  card.querySelector('.status-detail').textContent = detail;
}

async function refreshStudioStatus() {
  try {
    const [imageResponse, audioResponse] = await Promise.all([
      fetch('/api/image-studio-health', { cache: 'no-store' }),
      fetch('/api/audio-studio-health', { cache: 'no-store' })
    ]);
    const [image, audio] = await Promise.all([imageResponse.json(), audioResponse.json()]);
    const imageValue = !image.available ? 'Image service offline'
      : image.ready ? 'Ready · local GPU'
      : image.engineRunning ? 'Engine on · model unavailable'
      : 'Installed · engine sleeps until used';
    const imageDetail = image.network === 'offline-by-design'
      ? `${image.model || 'DreamShaper XL'} · internet blocked by design · local-only`
      : image.model || 'DreamShaper XL · local GPU';
    setGarageCard('imageStatusCard', image.available ? (image.ready ? 'ready' : 'idle') : 'offline', imageValue, imageDetail);
    const audioTone = audio.available ? (audio.ready ? 'ready' : 'idle') : 'offline';
    const audioValue = audio.available ? (audio.ready ? 'ACE-Step ready · local GPU' : 'ACE-Step installed · idle') : 'Audio service offline';
    const voiceValue = audio.voiceAvailable ? (audio.voiceModel || 'Offline voice model ready') : 'Spoken voice model not installed';
    const audioDetail = `${(audio.supports || ['music','ambience']).join(' · ')} · ${voiceValue}`;
    setGarageCard('audioStatusCard', audioTone, audioValue, audioDetail);
  } catch {
    setGarageCard('imageStatusCard', 'offline', 'Image status unavailable', 'Check local service');
    setGarageCard('audioStatusCard', 'offline', 'Audio status unavailable', 'Check local service');
  }
}
async function openImageStudio() {
  const frame = $('#imageStudioFrame');
  const status = $('#imageStudioStatus');
  if (!imageStudioRequested) {
    imageStudioRequested = true;
    frame.src = 'http://127.0.0.1:8190/';
  }
  status.textContent = 'Connecting to the local image workspace…';
  try {
    const result = await fetch('/api/image-studio-health', { cache: 'no-store' }).then((response) => response.json());
    status.hidden = result.available;
    status.textContent = result.available ? '' : 'Image Studio is offline. Start WildBound Local again or reload the tab.';
  } catch {
    status.hidden = false;
    status.textContent = 'Could not reach Image Studio on this PC.';
  }
}

async function openAudioStudio() {
  const frame = $('#audioStudioFrame');
  const status = $('#audioStudioStatus');
  try {
    const result = await fetch('/api/audio-studio-health', { cache: 'no-store' }).then(response => response.json());
    status.hidden = result.available;
    status.textContent = result.available
      ? ''
      : 'Audio models are not installed yet. No cloud audio service will be used.';
    if (result.available && !audioStudioRequested) {
      audioStudioRequested = true;
      frame.src = 'http://127.0.0.1:8200/';
    }
  } catch {
    status.hidden = false;
    status.textContent = 'Could not reach the local audio service.';
  }
}

async function openAssetStudio() {
  const frame = $('#assetStudioFrame');
  const status = $('#assetStudioStatus');
  if (!assetStudioRequested) {
    assetStudioRequested = true;
    frame.src = '/asset-studio.html';
  }
  try {
    const response = await fetch('/api/asset-studio/health', { cache: 'no-store' });
    if (!response.ok) throw new Error('The local model viewer is unavailable.');
    const result = await response.json();
    status.hidden = result.available;
    status.textContent = result.available ? '' : (result.error || 'The 3D preview library is missing.');
  } catch (error) {
    status.hidden = false;
    status.textContent = error.message || 'Could not reach Asset Studio on this PC.';
  }
}

function renderActivity() {
  const list = $('#activityList');
  list.replaceChildren();
  if (!activityEntries.length) {
    const empty = document.createElement('div');
    empty.className = 'activity-empty';
    empty.textContent = 'No delegated work recorded yet. Codex and local task assignments will appear here.';
    list.append(empty);
    return;
  }
  for (const entry of activityEntries) {
    const card = document.createElement('article');
    card.className = `activity-entry ${entry.agent}`;
    const top = document.createElement('div');
    top.className = 'activity-entry-top';
    const badge = document.createElement('span');
    badge.className = `activity-agent ${entry.agent}`;
    badge.textContent = entry.agent === 'codex' ? 'Codex · account credits' : 'Local AI · on this PC';
    const status = document.createElement('span');
    status.className = `activity-status ${entry.event}`;
    status.textContent = entry.event;
    const time = document.createElement('time');
    time.textContent = entry.at ? new Date(entry.at).toLocaleString() : '';
    top.append(badge, status, time);
    const task = document.createElement('p');
    task.className = 'activity-task';
    task.textContent = entry.task || 'Untitled task';
    card.append(top, task);
    if (entry.details) {
      const details = document.createElement('p');
      details.className = 'activity-details';
      details.textContent = entry.details;
      card.append(details);
    }
    list.append(card);
  }
}

function renderUsage() {
  const panel = $('#usageSummary');
  panel.replaceChildren();
  if (!usageData) return;
  const local = usageData.local || {};
  const codex = usageData.codex || {};
  const routing = usageData.routing || {};
  const savings = usageData.savings || {};
  const jobs = local.jobs || {};
  const energyMs = Number(local.modelElapsedMs || 0);
  const wattsValue = localStorage.getItem('wildbound-energy-watts');
  const rateValue = localStorage.getItem('wildbound-energy-rate');
  const watts = Number(wattsValue === null ? 300 : wattsValue);
  const rate = Number(rateValue === null ? 0.18 : rateValue);
  const energyKwh = energyMs / 3_600_000 * watts / 1_000;
  const currency = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 4, maximumFractionDigits: 4 });
  const number = value => Number.isFinite(value) ? value.toLocaleString() : 'Not reported';
  const createCard = (className, heading) => {
    const card = document.createElement('section');
    card.className = `usage-card ${className}`;
    const title = document.createElement('h2');
    title.textContent = heading;
    card.append(title);
    return card;
  };
  const addMetric = (card, label, value, detail = '') => {
    const row = document.createElement('div');
    row.className = 'usage-metric';
    const name = document.createElement('span'); name.textContent = label;
    const result = document.createElement('strong'); result.textContent = value;
    row.append(name, result);
    if (detail) { const note = document.createElement('small'); note.textContent = detail; row.append(note); }
    card.append(row);
  };

  const localCard = createCard('usage-agent local', 'Ollama · local inference');
  addMetric(localCard, 'Model requests', `${number(local.requestsCompleted)} complete · ${number(local.requestsFailed)} failed`, 'Counted from requests sent to Ollama.');
  const tokenDetail = local.tokenMeasurements ? `${number(local.tokenMeasurements)} requests reported usage` : 'Ollama has not reported token counts yet.';
  addMetric(localCard, 'Tokens', `${number(local.promptTokens)} in · ${number(local.responseTokens)} out`, tokenDetail);
  addMetric(localCard, 'Logged tasks', `${number(jobs.completed)} complete · ${number(jobs.failed)} failed · ${number(jobs.unclosed)} open`);

  const codexCard = createCard('usage-agent codex', 'Codex · cloud');
  addMetric(codexCard, 'Logged tasks', `${number(codex.completed)} complete · ${number(codex.failed)} failed · ${number(codex.unclosed)} open`, 'Task-log entries; these are not model request counts.');
  addMetric(codexCard, 'Requests and tokens', 'Not exposed', 'Codex does not provide per-task usage data to this dashboard.');
  addMetric(codexCard, 'Credit savings', 'Not measurable', `${number(savings.completedLocalHandoffs)} local handoffs completed; not treated as credits saved.`);

  const estimateCard = createCard('usage-estimate', 'Local runtime estimate');
  addMetric(estimateCard, 'Electricity', `${energyKwh.toFixed(4)} kWh · ${currency.format(energyKwh * rate)}`, 'Estimate from Ollama runtime only; excludes idle PC, other tools, and cloud work.');
  const assumptions = document.createElement('div');
  assumptions.className = 'energy-assumptions';
  assumptions.innerHTML = '<label>Assumed system draw <input id="energyWatts" type="number" min="1" max="3000" step="25" aria-label="Assumed system power draw in watts"> W</label><label>Electricity rate <input id="energyRate" type="number" min="0" max="10" step="0.01" aria-label="Electricity price per kilowatt-hour"> $/kWh</label>';
  estimateCard.append(assumptions);

  const routingCard = createCard('usage-routing', 'Routing · classifications only');
  addMetric(routingCard, 'Assignments classified', `${number(routing.localDecisions)} local · ${number(routing.codexDecisions)} Codex`, 'Does not represent all chat turns or completed model requests.');
  panel.append(localCard, codexCard, estimateCard, routingCard);
  $('#energyWatts').value = watts;
  $('#energyRate').value = rate;
  $('#energyWatts').addEventListener('change', (event) => {
    const value = Math.min(3000, Math.max(1, Number(event.target.value) || 300));
    localStorage.setItem('wildbound-energy-watts', String(value));
    renderUsage();
  });
  $('#energyRate').addEventListener('change', (event) => {
    const value = Math.min(10, Math.max(0, Number(event.target.value) || 0));
    localStorage.setItem('wildbound-energy-rate', String(value));
    renderUsage();
  });
  const note = document.createElement('p');
  note.className = 'usage-note';
  note.textContent = 'Counts cover the data this Garage can observe. Ollama request and token numbers are measured when the model reports them; Codex numbers are work-log tasks only. The dashboard cannot calculate local/cloud usage share or Codex credits saved.';
  panel.append(note);
}

async function refreshActivity() {
  try {
    const [activityResponse, usageResponse] = await Promise.all([
      fetch('/api/activity', { cache: 'no-store' }),
      fetch('/api/usage', { cache: 'no-store' })
    ]);
    const [activityPayload, nextUsage] = await Promise.all([activityResponse.json(), usageResponse.json()]);
    if (activityResponse.ok) activityEntries = activityPayload.entries || [];
    if (usageResponse.ok) usageData = nextUsage;
    const updated = new Date();
    $('#activityUpdated').dateTime = updated.toISOString();
    $('#activityUpdated').textContent = `Updated ${updated.toLocaleTimeString()}`;
  } catch {
    $('#activityUpdated').textContent = 'Log refresh failed';
    /* Work log stays available when the local control service reconnects. */
  }
  renderUsage();
  renderActivity();
}

function renderMessage(message) {
  const row = document.createElement("article");
  row.className = `message ${message.role}`;
  const mark = document.createElement("div");
  mark.className = "message-mark";
  mark.textContent = message.role === "assistant" ? "W" : "You";
  const content = document.createElement("div");
  content.className = "message-content";
  addFormattedText(content, message.content);
  if (message.toolsUsed?.length) {
    const tools = document.createElement('div');
    tools.className = 'source-list';
    const label = document.createElement('span');
    label.className = 'source-chip';
    label.textContent = `Local admin checks: ${[...new Set(message.toolsUsed)].join(', ')}`;
    tools.append(label);
    content.append(tools);
  }
  row.append(mark, content);
  if (message.sources?.length) {
    const chips = document.createElement("div");
    chips.className = "source-list";
    for (const source of message.sources) {
      const chip = document.createElement("span");
      chip.className = "source-chip";
      chip.textContent = source;
      chips.append(chip);
    }
    content.append(chips);
  }
  return row;
}

function formatAdminStatus(status) {
  const gib = value => `${(value / (1024 ** 3)).toFixed(1)} GiB`;
  const drives = (status.drives || []).map(item => item.available
    ? `${item.drive} free: ${gib(item.freeBytes)} / ${gib(item.totalBytes)}`
    : `${item.drive} unavailable`).join('\n');
  return [
    'Local admin check (read-only)',
    `System: ${status.os}`,
    `CPU logical cores: ${status.cpuCores}`,
    `Memory: ${gib(status.memory.freeBytes)} free / ${gib(status.memory.totalBytes)} total`,
    `Drives:\n${drives}`,
    status.privileges
  ].join('\n');
}

async function refreshHealth() {
  try {
    const response = await fetch("/api/health", { cache: "no-store" });
    health = await response.json();
  } catch {
    health = { ollamaAvailable: false, models: [], modelAvailable: false };
  }
  statusPill.classList.toggle("online", Boolean(health.ollamaAvailable && health.modelAvailable));
  statusPill.classList.toggle("offline", !health.ollamaAvailable);
  const modelReady = Boolean(health.ollamaAvailable && health.modelAvailable);
  setGarageCard('localAgentCard', modelReady ? 'online' : 'offline', modelReady ? 'Model installed · ready on demand' : (health.ollamaAvailable ? 'Model unavailable' : 'Ollama offline'), health.defaultModel || 'qwen3.5:9b');
  const label = statusPill.querySelector("span");
  if (!health.ollamaAvailable) {
    label.textContent = "Ollama disconnected";
    offlineHint.hidden = false;
  } else if (!health.modelAvailable) {
    label.textContent = "Model not found";
    offlineHint.hidden = false;
    offlineHint.textContent = `Ollama is running, but ${health.defaultModel || 'the configured model'} isn’t listed in the local model store.`;
  } else {
    label.textContent = health.defaultModel;
    offlineHint.hidden = true;
  }
  const chosen = modelSelect.value;
  modelSelect.replaceChildren();
  const models = health.models?.length ? health.models : [health.defaultModel || "qwen3.5:9b"];
  for (const model of models) {
    const option = document.createElement("option");
    option.value = model;
    option.textContent = model;
    modelSelect.append(option);
  }
  if (models.includes(chosen)) modelSelect.value = chosen;
}

async function sendPrompt(text) {
  const value = text.trim();
  if (!value || busy) return;
  if (!currentId || !activeChat()) newChat(false);
  const chat = activeChat();
  chat.messages.push({ role: "user", content: value });
  if (chat.title === "New chat") chat.title = value.length > 42 ? `${value.slice(0, 39)}…` : value;
  persist();
  render();
  input.value = "";
  resizeInput();

  busy = true;
  sendButton.disabled = true;
  const pending = document.createElement("article");
  pending.className = "message assistant";
  pending.innerHTML = '<div class="message-mark">W</div><div class="message-content thinking">Thinking locally <span class="typing-dots"><i></i><i></i><i></i></span></div>';
  conversation.append(pending);
  conversation.hidden = false;
  welcome.hidden = true;
  conversation.scrollTop = conversation.scrollHeight;
  try {
    const adminCommand = value.toLowerCase().replace(/\s+/g, ' ');
    if (adminCommand.startsWith('/admin')) {
      pending.querySelector('.message-content').textContent = 'Running a fixed local admin check…';
      let adminMessage;
      if (adminCommand === '/admin help') {
        adminMessage = 'Local admin tools:\n/admin status — read-only CPU, memory, and drive-space report, without model inference.\n\nYou can also ask the local assistant to check PC resources, Windows pagefile settings, WildBound repository status, or Ollama availability. It can call only those fixed read-only checks. System-changing actions are still disabled; the model cannot invent or run shell commands.';
      } else if (adminCommand === '/admin status') {
        const response = await fetch('/api/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: adminCommand })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'The local admin check failed.');
        adminMessage = formatAdminStatus(result);
      } else {
        adminMessage = 'Unknown admin command. Try /admin help.';
      }
      pending.remove();
      chat.messages.push({ role: 'assistant', content: adminMessage });
      persist();
      render();
      return;
    }
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: modelSelect.value, messages: chat.messages, useWorkspaceContext: contextToggle.checked })
    });
    const result = await response.json();
    pending.remove();
    if (!response.ok) throw new Error(result.error || "The local request failed.");
    chat.messages.push({ role: "assistant", content: result.message, sources: result.sources || [], toolsUsed: result.toolsUsed || [] });
    persist();
    render();
  } catch (error) {
    pending.remove();
    const isAdminCommand = value.toLowerCase().startsWith('/admin');
    chat.messages.push({ role: "assistant", content: isAdminCommand
      ? `The local admin check failed: ${error.message}`
      : `I couldn’t reach the local model: ${error.message}\n\nStart Ollama using **Start-WildBoundLocalAI.cmd** and check that ${health?.defaultModel || 'the configured model'} is available, then send your message again.` });
    persist();
    render();
    if (!isAdminCommand) refreshHealth();
  } finally {
    busy = false;
    sendButton.disabled = false;
    input.focus();
  }
}

function resizeInput() { input.style.height = "auto"; input.style.height = `${Math.min(input.scrollHeight, 180)}px`; }

$("#newChat").addEventListener("click", () => newChat());
$("#clearChats").addEventListener("click", () => {
  chats = [];
  currentId = null;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(CURRENT_KEY);
  render();
});
composer.addEventListener("submit", (event) => { event.preventDefault(); sendPrompt(input.value); });
input.addEventListener("input", resizeInput);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); composer.requestSubmit(); }
});
document.querySelectorAll(".suggestion").forEach((button) => button.addEventListener("click", () => sendPrompt(button.dataset.prompt || "")));
$("#settingsButton").addEventListener("click", () => { $("#settingsPanel").hidden = !$("#settingsPanel").hidden; });
$("#closeSettings").addEventListener("click", () => { $("#settingsPanel").hidden = true; });
contextToggle.addEventListener("change", () => { localStorage.setItem("wildbound-local-context", contextToggle.checked ? "1" : "0"); render(); });
contextToggle.checked = localStorage.getItem("wildbound-local-context") !== "0";
$('#activityViewButton').addEventListener('click', () => showView('activity'));
$('#productionStudioButton').addEventListener('click', () => showView('production-studio'));
$('#imageStatusCard').addEventListener('click', () => showView('image-studio'));
$('#audioStatusCard').addEventListener('click', () => showView('audio-studio'));
$('#imageStudioViewButton').addEventListener('click', () => showView('image-studio'));
$('#audioStudioViewButton').addEventListener('click', () => showView('audio-studio'));
$('#assetStudioButton').addEventListener('click', () => showView('asset-studio'));
$('#reloadImageStudio').addEventListener('click', () => {
  imageStudioRequested = false;
  $('#imageStudioFrame').removeAttribute('src');
  openImageStudio();
});
$('#reloadAudioStudio').addEventListener('click', () => {
  audioStudioRequested = false;
  $('#audioStudioFrame').removeAttribute('src');
  openAudioStudio();
});
$('#reloadAssetStudio').addEventListener('click', () => {
  const frame = $('#assetStudioFrame');
  assetStudioRequested = true;
  frame.src = `/asset-studio.html?reload=${Date.now()}`;
  openAssetStudio();
});
$('#refreshActivity').addEventListener('click', refreshActivity);
if (!chats.length) newChat(false);
else if (!chats.some((chat) => chat.id === currentId)) currentId = chats[0].id;
render();
refreshHealth();
refreshStudioStatus();
refreshActivity();
showView('activity');
setTimeout(() => { const splash = $('#launchSplash'); if (splash) { splash.classList.add('dismissed'); setTimeout(() => splash.remove(), 500); } }, 950);
setInterval(refreshHealth, 15_000);
setInterval(refreshStudioStatus, 7_500);
setInterval(refreshActivity, 5_000);

// Closing the Garage also powers down its local inference engines. The short
// server-side grace period lets a page refresh reconnect without stopping them.
function garageHeartbeat() {
  const sentAt = Date.now();
  fetch('/api/garage-heartbeat', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sentAt }), keepalive: true
  }).catch(() => {});
}
garageHeartbeat();
const garageHeartbeatTimer = setInterval(garageHeartbeat, 3_000);
window.addEventListener('pagehide', () => {
  clearInterval(garageHeartbeatTimer);
  const sentAt = Date.now();
  navigator.sendBeacon('/api/garage-closing', new Blob([JSON.stringify({ sentAt })], { type: 'application/json' }));
});
