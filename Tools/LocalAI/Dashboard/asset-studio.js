const viewer = document.querySelector('#modelViewer');
const list = document.querySelector('#modelList');
const libraryStatus = document.querySelector('#libraryStatus');
const emptyState = document.querySelector('#emptyState');
const viewerStatus = document.querySelector('#viewerStatus');
const fileInput = document.querySelector('#modelFile');
const selectedFile = document.querySelector('#selectedFile');
const saveButton = document.querySelector('#saveModel');
const animationSelect = document.querySelector('#animationSelect');
const playButton = document.querySelector('#playAnimation');
const speedInput = document.querySelector('#animationSpeed');
const speedValue = document.querySelector('#speedValue');
const animationInfo = document.querySelector('#animationInfo');
const dropZone = document.querySelector('#dropZone');
const maxFileBytes = 250 * 1024 * 1024;
let pendingFile = null;
let currentObjectUrl = null;
let resumeAfterHide = false;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

async function refreshLibrary() {
  libraryStatus.textContent = 'Reading local model library…';
  list.replaceChildren();
  try {
    const response = await fetch('/api/asset-studio/models', { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'The model library could not be read.');
    if (!data.models.length) {
      libraryStatus.textContent = 'No models saved yet.';
      const empty = document.createElement('li');
      empty.className = 'empty-library';
      empty.textContent = 'Choose a self-contained .glb file to preview it. Save it here when you want to keep it in the WildBound project.';
      list.append(empty);
      return;
    }
    libraryStatus.textContent = `${data.models.length} model${data.models.length === 1 ? '' : 's'} in the library`;
    for (const model of data.models) {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'model-row';
      button.title = model.name;
      const name = document.createElement('span'); name.className = 'model-name'; name.textContent = model.name;
      const info = document.createElement('span'); info.className = 'model-meta'; info.textContent = formatBytes(model.bytes);
      button.append(name, info);
      button.addEventListener('click', () => loadModel(`/api/asset-studio/models/${encodeURIComponent(model.name)}`, model.name, model.bytes, button));
      item.append(button);
      list.append(item);
    }
  } catch (error) {
    libraryStatus.textContent = error.message;
  }
}

function clearPreviewError() { viewerStatus.textContent = ''; }

function loadModel(source, name, bytes, selectedButton = null) {
  clearPreviewError();
  for (const button of list.querySelectorAll('.model-row')) button.classList.toggle('active', button === selectedButton);
  document.querySelector('#modelTitle').textContent = name;
  document.querySelector('#modelDetails').textContent = `${formatBytes(bytes)} · drag to orbit · scroll to zoom · right-drag to pan`;
  document.querySelector('#modelBadge').textContent = 'GLB · LOCAL';
  animationSelect.replaceChildren(new Option('Loading clips…', ''));
  animationSelect.disabled = true;
  playButton.disabled = true;
  speedInput.disabled = true;
  animationInfo.textContent = 'Reading model animation clips…';
  playButton.textContent = '▶ Play';
  viewer.pause();
  emptyState.hidden = true;
  viewer.src = source;
  document.querySelector('#resetView').disabled = false;
}

async function previewFile(file) {
  if (!file || !file.name.toLowerCase().endsWith('.glb')) {
    viewerStatus.textContent = 'Choose a .glb file. glTF JSON files with external sidecar files are not supported yet.';
    return;
  }
  if (file.size > maxFileBytes) {
    viewerStatus.textContent = 'This file is over the 250 MB limit.';
    return;
  }
  if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
  currentObjectUrl = URL.createObjectURL(file);
  pendingFile = file;
  selectedFile.textContent = `${file.name} · ${formatBytes(file.size)}`;
  saveButton.disabled = false;
  clearPreviewError();
  loadModel(currentObjectUrl, file.name, file.size);
  libraryStatus.textContent = 'Previewing a local file. Save it to keep it in the project library.';
}

viewer.addEventListener('load', () => {
  const animations = viewer.availableAnimations || [];
  animationSelect.replaceChildren();
  if (!animations.length) {
    animationSelect.add(new Option('No embedded clips', ''));
    animationSelect.disabled = true;
    playButton.disabled = true;
    speedInput.disabled = true;
    animationInfo.textContent = 'This GLB has no embedded animation. Rig and animate it before expecting character movement.';
  } else {
    animations.forEach((name, index) => animationSelect.add(new Option(name, name, index === 0, index === 0)));
    animationSelect.disabled = false;
    playButton.disabled = false;
    speedInput.disabled = false;
    viewer.animationName = animations[0];
    animationInfo.textContent = `${animations.length} embedded animation clip${animations.length === 1 ? '' : 's'}. Choose one and press Play.`;
  }
  viewer.timeScale = Number(speedInput.value);
  document.querySelector('#modelBadge').textContent = `GLB · ${animations.length} CLIP${animations.length === 1 ? '' : 'S'}`;
  clearPreviewError();
});

viewer.addEventListener('error', event => {
  viewerStatus.textContent = event.detail?.message || 'The model could not be loaded. Check that it is a valid, self-contained GLB.';
});

animationSelect.addEventListener('change', () => {
  if (!animationSelect.value) return;
  const wasPlaying = !viewer.paused;
  viewer.pause();
  viewer.animationName = animationSelect.value;
  viewer.currentTime = 0;
  if (wasPlaying) viewer.play();
});

playButton.addEventListener('click', () => {
  if (!animationSelect.value) return;
  if (viewer.paused) {
    viewer.play();
    playButton.textContent = 'Ⅱ Pause';
  } else {
    viewer.pause();
    playButton.textContent = '▶ Play';
  }
});

speedInput.addEventListener('input', () => {
  viewer.timeScale = Number(speedInput.value);
  speedValue.textContent = `${Number(speedInput.value).toFixed(2).replace(/0+$/, '').replace(/\.$/, '')}×`;
});

document.querySelector('#resetView').addEventListener('click', () => {
  viewer.cameraOrbit = '0deg 75deg auto';
  viewer.cameraTarget = 'auto auto auto';
  viewer.jumpCameraToGoal();
});

fileInput.addEventListener('change', () => previewFile(fileInput.files?.[0]));
document.querySelector('#refreshLibrary').addEventListener('click', refreshLibrary);
saveButton.addEventListener('click', async () => {
  if (!pendingFile) return;
  saveButton.disabled = true;
  saveButton.textContent = 'Adding…';
  try {
    const response = await fetch(`/api/asset-studio/models?filename=${encodeURIComponent(pendingFile.name)}`, {
      method: 'POST', headers: { 'Content-Type': 'model/gltf-binary' }, body: pendingFile
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'The GLB could not be added to the library.');
    const saved = result.model;
    pendingFile = null;
    selectedFile.textContent = 'No file selected';
    fileInput.value = '';
    saveButton.textContent = 'Add to library';
    saveButton.disabled = true;
    await refreshLibrary();
    const button = [...list.querySelectorAll('.model-row')].find(item => item.title === saved.name);
    loadModel(`/api/asset-studio/models/${encodeURIComponent(saved.name)}`, saved.name, saved.bytes, button);
    libraryStatus.textContent = `Saved ${saved.name} · ${saved.animations} embedded animation clip${saved.animations === 1 ? '' : 's'}`;
  } catch (error) {
    viewerStatus.textContent = error.message;
  } finally {
    saveButton.textContent = 'Add to library';
    saveButton.disabled = !pendingFile;
  }
});

dropZone.addEventListener('dragover', event => { event.preventDefault(); dropZone.classList.add('dragging'); });
dropZone.addEventListener('dragleave', event => { if (!dropZone.contains(event.relatedTarget)) dropZone.classList.remove('dragging'); });
dropZone.addEventListener('drop', event => {
  event.preventDefault();
  dropZone.classList.remove('dragging');
  previewFile(event.dataTransfer.files?.[0]);
});

window.addEventListener('message', event => {
  if (event.origin !== window.location.origin || event.data?.type !== 'asset-studio-visibility') return;
  if (!event.data.visible && !viewer.paused) {
    resumeAfterHide = true;
    viewer.pause();
    playButton.textContent = '▶ Play';
  } else if (event.data.visible && resumeAfterHide) {
    resumeAfterHide = false;
    viewer.play();
    playButton.textContent = 'Ⅱ Pause';
  }
});

refreshLibrary();
