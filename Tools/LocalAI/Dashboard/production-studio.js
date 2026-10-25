'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const state = { visible:false, busy:false, jobs:[], status:null, selectedId:'', timer:null, detailFingerprint:'', modelCache:new Map() };
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const labels = { queued:'Queued',running:'Working',cancelling:'Cancelling',awaiting_review:'Ready for your review',needs_source:'Waiting for a model source',importing:'Importing to Unreal',completed:'Completed',failed:'Needs attention',interrupted:'Interrupted',cancelled:'Cancelled',rejected:'Rejected' };
  const api = async (url, options={}) => {
    const response = await fetch(url,{cache:'no-store',...options});
    const type=response.headers.get('content-type')||'';
    const value=type.includes('application/json')?await response.json():null;
    if(!response.ok)throw new Error(value?.error||`Production request failed (${response.status}).`);
    return value;
  };
  function notice(message, tone='info') { const box=$('#productionNotice');box.textContent=message;box.className=`production-notice ${tone}`;box.hidden=!message; }
  function kindLabel(job) { return job.brief?.kind||job.kind||'Preparing brief'; }
  function summary(job) { return job.brief?.name?.replaceAll('_',' ')||job.prompt||'New production task'; }
  function selectedJob() { return state.jobs.find(job=>job.id===state.selectedId); }
  function renderCapabilities() {
    const items=state.status?.capabilities||[];
    $('#productionCapabilities').innerHTML=items.map(item=>`<article class="production-capability ${item.available?'ready':'limited'}"><span>${item.available?'AVAILABLE':'LIMITED'}</span><strong>${escape(item.name)}</strong><small>${escape(item.reason)}</small></article>`).join('');
    const agents=state.status?.agents||state.status?.teams||[];
    const availableCount=agents.filter(agent=>agent.ready).length;
    $('#agentReadinessSummary').textContent=`${availableCount} of ${agents.length} available`;
    $('#productionAgents').innerHTML=agents.map(agent=>`<article class="production-agent"><div class="production-agent-dot ${agent.ready?'ready':'limited'}"></div><div><strong>${escape(agent.name)}</strong><span>${escape(agent.engine)}</span><small>${escape(agent.role)}</small>${(agent.missing||[]).length?`<em>Needs: ${escape(agent.missing.join(', '))}</em>`:''}</div><b class="agent-state ${agent.ready?'ready':'limited'}">${agent.ready?'Available':'Limited'}</b></article>`).join('')||'<p class="production-muted">Agent status is unavailable.</p>';
  }
  function visibleJobs() {
    const filter=$('#productionFilter').value;
    return state.jobs.filter(job=>filter==='all'||(filter==='active'?['queued','running','cancelling','importing','needs_source'].includes(job.status):filter==='failed'?['failed','interrupted'].includes(job.status):job.status===filter));
  }
  function renderJobs() {
    const items=visibleJobs();
    $('#productionJobs').innerHTML=items.length?items.map(job=>`<button type="button" class="production-job ${job.id===state.selectedId?'selected':''}" data-select-job="${escape(job.id)}"><span><strong>${escape(summary(job))}</strong><small>${escape(kindLabel(job))} · ${escape(new Date(job.updatedAt||job.createdAt).toLocaleString())}</small></span><b class="job-state ${escape(job.status)}">${escape(labels[job.status]||job.status)}</b></button>`).join(''):'<div class="production-empty">No tasks match this filter.</div>';
  }
  function renderSteps(job) {
    const steps=job.steps||[];
    return `<ol class="production-steps">${steps.map(step=>`<li class="step-${escape(step.status)}"><i></i><span><strong>${escape(step.name)}</strong><small>${escape(step.status.replaceAll('_',' '))}${step.agentId?` · ${escape(step.agentId.replaceAll('-',' '))}`:''}${step.error?` · ${escape(step.error)}`:''}</small></span></li>`).join('')}</ol>`;
  }
  function renderAgentRuns(job) {
    const runs=job.agentRuns||[];
    if(!runs.length)return '';
    return `<details class="agent-handoffs"><summary>Agent handoffs (${runs.length})</summary><div>${runs.map(run=>`<article><strong>${escape(run.agentName)}</strong><span>${escape(run.step)} · ${escape(run.status)}</span>${run.summary?`<small>${escape(JSON.stringify(run.summary))}</small>`:''}${run.error?`<em>${escape(run.error)}</em>`:''}</article>`).join('')}</div></details>`;
  }
  function renderPreview(job) {
    if(!job.artifact)return '<div class="preview-empty">The team’s output will appear here when production and technical review are complete.</div>';
    const id=encodeURIComponent(job.id),kind=job.artifact.kind;
    if(kind==='texture')return `<div class="artifact-preview"><img alt="Generated texture preview" src="/api/garage/jobs/${id}/files/preview"><a href="/api/garage/jobs/${id}/files/preview" download>Download texture</a></div>`;
    if(['voice','music','ambience'].includes(kind))return `<div class="artifact-preview audio-preview"><div><strong>${kind==='voice'?'Character voice':kind==='music'?'Music':'Musical ambience'}</strong><small>${escape(job.checks?.seconds??'')} seconds · ${escape(job.checks?.sampleRate??'')} Hz</small></div><audio controls preload="metadata" src="/api/garage/jobs/${id}/files/preview"></audio><a href="/api/garage/jobs/${id}/files/preview" download>Download WAV</a></div>`;
    return `<div class="artifact-preview model-preview"><canvas id="modelPreviewCanvas" width="720" height="460" aria-label="Interactive 3D model preview"></canvas><small>Drag to orbit · scroll to zoom · material colors previewed without Unreal lighting</small><a href="/api/garage/jobs/${id}/files/source" download>Download prepared model</a></div>`;
  }
  function renderDetails(job) {
    if(!job){$('#productionDetails').innerHTML='<div class="production-empty">Select a task to follow its handoffs, review its output, and approve or reject the Unreal import.</div>';return;}
    const status=labels[job.status]||job.status;
    const checks=job.checks;
    let report='';
    if(checks){report=job.artifact?.kind==='model'?`${checks.triangles||0} triangles · ${checks.meshes||0} meshes · ${checks.armatures||0} armatures · ${checks.animations?.length||0} animation clips`:job.artifact?.kind==='texture'?`${checks.width} × ${checks.height} · ${checks.format||'image'}`:`${Number(checks.seconds||0).toFixed(1)} seconds · ${checks.sampleRate} Hz · ${checks.bitDepth}-bit · ${checks.channels} channels`;}
    const engineAssets=job.engine?.assets||[];
    const actionButtons=[];
    if(job.status==='awaiting_review')actionButtons.push('<button data-job-action="approve" class="production-primary">Approve &amp; import</button>','<button data-job-action="reject" class="production-secondary">Reject</button>');
    if(job.status==='needs_source')actionButtons.push('<button data-job-action="attach" class="production-primary">Attach GLB / FBX</button>');
    if(['queued','running','cancelling','importing','needs_source'].includes(job.status))actionButtons.push('<button data-job-action="cancel" class="production-secondary">Cancel task</button>');
    if(['failed','interrupted'].includes(job.status)&&job.approvedAt)actionButtons.push('<button data-job-action="retry-import" class="production-primary">Retry Unreal import</button>');
    $('#productionDetails').innerHTML=`<div class="production-detail-heading"><div><div class="eyebrow">TASK REVIEW</div><h2>${escape(summary(job))}</h2><span class="job-state ${escape(job.status)}">${escape(status)} · ${escape(kindLabel(job))}</span></div><button class="quiet-refresh" data-job-action="refresh" type="button">↻</button></div>${job.error?`<p class="production-error">${escape(job.error)}</p>`:''}${report?`<p class="asset-report">${escape(report)}</p>`:''}${renderSteps(job)}${renderAgentRuns(job)}<div class="production-preview">${renderPreview(job)}</div>${engineAssets.length?`<div class="engine-evidence"><strong>Unreal verified</strong><span>${engineAssets.map(a=>escape(a.class)+' · '+escape(a.path)).join('<br>')}</span></div>`:''}<div class="production-job-actions">${actionButtons.join('')}</div>`;
    if(job.artifact?.kind==='model')loadModelPreview(job);
  }
  async function loadModelPreview(job) {
    const canvas=$('#modelPreviewCanvas');if(!canvas)return;
    const key=job.id+':'+(job.artifact?.sha256||'');
    if(state.modelCache.has(key)){drawModel(canvas,state.modelCache.get(key).groups||[]);return;}
    try { const response=await fetch(`/api/garage/jobs/${encodeURIComponent(job.id)}/files/preview`,{cache:'no-store'});if(!response.ok)throw new Error('Preview file unavailable.');const model=await response.json();state.modelCache.set(key,model);if(state.selectedId===job.id)drawModel(canvas,model.groups||[]); }
    catch(error){const box=canvas.parentElement;box.insertAdjacentHTML('afterbegin',`<small class="production-error">${escape(error.message)}</small>`);}
  }
  function drawModel(canvas,groups) {
    const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
    let yaw=.65,pitch=.2,zoom=1,drag=false,lastX=0,lastY=0;
    const vertices=[];let bound=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];
    for(const group of groups){const p=group.positions||[];for(let i=0;i+2<p.length;i+=3){const point=[Number(p[i])||0,Number(p[i+1])||0,Number(p[i+2])||0];vertices.push(point);for(let a=0;a<3;a++){bound[a]=Math.min(bound[a],point[a]);bound[a+3]=Math.max(bound[a+3],point[a]);}}}
    if(!vertices.length){ctx.fillStyle='#aeb7aa';ctx.fillText('No preview geometry',20,30);return;}
    const center=[0,1,2].map(a=>(bound[a]+bound[a+3])/2),size=Math.max(...[0,1,2].map(a=>bound[a+3]-bound[a]),.001);
    function paint(){ctx.fillStyle='#121a14';ctx.fillRect(0,0,w,h);const faces=[];let all=0;for(const group of groups)all+=(group.indices||[]).length/3;const stride=Math.max(1,Math.ceil(all/18000));let ordinal=0;
      for(const group of groups){const p=group.positions||[],indices=group.indices||[],color=group.color||[.55,.62,.5];for(let i=0;i+2<indices.length;i+=3,ordinal++){if(ordinal%stride)continue;const pts=[];let depth=0;for(let k=0;k<3;k++){const idx=Number(indices[i+k])*3;let x=(Number(p[idx])||0)-center[0],y=(Number(p[idx+1])||0)-center[1],z=(Number(p[idx+2])||0)-center[2];const rx=x*Math.cos(yaw)+z*Math.sin(yaw),rz=-x*Math.sin(yaw)+z*Math.cos(yaw),ry=y*Math.cos(pitch)-rz*Math.sin(pitch),rz2=y*Math.sin(pitch)+rz*Math.cos(pitch);depth+=rz2;pts.push([(w/2+rx*(Math.min(w,h)*.62/size)*zoom),(h/2-ry*(Math.min(w,h)*.62/size)*zoom),rz2]);}faces.push({pts,depth,color});}}
      faces.sort((a,b)=>a.depth-b.depth);for(const face of faces){ctx.beginPath();ctx.moveTo(face.pts[0][0],face.pts[0][1]);ctx.lineTo(face.pts[1][0],face.pts[1][1]);ctx.lineTo(face.pts[2][0],face.pts[2][1]);ctx.closePath();const c=face.color,channel=value=>Math.round(Math.max(0,Math.min(1,Number(value)||0))*255);ctx.fillStyle=`rgb(${channel(c[0])} ${channel(c[1])} ${channel(c[2])} / 96%)`;ctx.fill();ctx.strokeStyle='#1117';ctx.lineWidth=.35;ctx.stroke();}}
    paint();canvas.onpointerdown=e=>{drag=true;lastX=e.offsetX;lastY=e.offsetY;canvas.setPointerCapture(e.pointerId);};canvas.onpointerup=()=>{drag=false;};canvas.onpointermove=e=>{if(!drag)return;yaw+=(e.offsetX-lastX)*.012;pitch=Math.max(-1.4,Math.min(1.4,pitch+(e.offsetY-lastY)*.012));lastX=e.offsetX;lastY=e.offsetY;paint();};canvas.onwheel=e=>{e.preventDefault();zoom=Math.max(.35,Math.min(4,zoom*(e.deltaY<0?1.1:.9)));paint();};
  }
  async function refresh(selectId=state.selectedId) {
    if(state.busy)return;state.busy=true;
    try{
      const [status,jobs]=await Promise.all([api('/api/garage/status'),api('/api/garage/jobs?limit=100')]);
      state.status=status;state.jobs=jobs.jobs||[];state.selectedId=selectId&&state.jobs.some(j=>j.id===selectId)?selectId:(state.jobs[0]?.id||'');
      renderCapabilities();renderJobs();const job=state.jobs.find(j=>j.id===state.selectedId);const fingerprint=job?`${job.id}:${job.updatedAt}:${job.status}`:'empty';if(fingerprint!==state.detailFingerprint){state.detailFingerprint=fingerprint;renderDetails(job);}
      $('#productionUpdated').textContent=`Updated ${new Date().toLocaleTimeString()}`;if(!state.jobs.length)notice('All six production roles are connected to the shared queue. Start a task to create the first handoff.','success');else notice('Your tasks and review decisions stay on this PC.','success');
    }catch(error){$('#productionUpdated').textContent='Production service unavailable';notice(`${error.message} The browser, image, audio, and asset studios remain available.`, 'error');}
    finally{state.busy=false;}
  }
  async function act(action,job) {
    if(action==='refresh')return refresh(job.id);
    if(action==='attach')return $('#productionModelFile').click();
    const endpoint={approve:'approve',reject:'reject',cancel:'cancel','retry-import':'retry-import'}[action];
    if(!endpoint)return;
    const labelsByAction={approve:'approve this asset and start its Unreal import',reject:'reject this asset',cancel:'cancel this production task','retry-import':'retry importing this approved asset'};
    if(!window.confirm(`Do you want to ${labelsByAction[action]}?`))return;
    const button=$(`[data-job-action="${action}"]`);if(button)button.disabled=true;
    try{await api(`/api/garage/jobs/${encodeURIComponent(job.id)}/${endpoint}`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});notice(action==='approve'?'Approved. Unreal import and verification are now running.':`Task ${action==='retry-import'?'import retry':action} requested.`,'success');await refresh(job.id);}
    catch(error){notice(error.message,'error');if(button)button.disabled=false;}
  }
  $('#productionJobs').addEventListener('click',event=>{const button=event.target.closest('[data-select-job]');if(button){state.selectedId=button.dataset.selectJob;state.detailFingerprint='';renderJobs();renderDetails(selectedJob());state.detailFingerprint=selectedJob()?.id+':'+selectedJob()?.updatedAt+':'+selectedJob()?.status;}});
  $('#productionDetails').addEventListener('click',event=>{const button=event.target.closest('[data-job-action]');const job=selectedJob();if(button&&job)act(button.dataset.jobAction,job);});
  $('#productionFilter').addEventListener('change',renderJobs);
  $('#refreshProduction').addEventListener('click',()=>refresh());
  $('#productionForm').addEventListener('submit',async event=>{
    event.preventDefault();const submit=$('#submitProduction');if(submit.disabled)return;submit.disabled=true;notice('The production director is assigning this task to the shared team…');
    try{const job=await api('/api/garage/jobs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:$('#productionPrompt').value,kind:$('#productionKind').value,biome:$('#productionBiome').value,voice:$('#productionVoice').value,seconds:Number($('#productionSeconds').value)})});$('#productionPrompt').value='';state.selectedId=job.id;notice('Task accepted. The director and specialist are starting their handoff.','success');await refresh(job.id);}
    catch(error){notice(error.message,'error');}
    finally{submit.disabled=false;}
  });
  $('#productionModelFile').addEventListener('change',async event=>{const file=event.target.files?.[0],job=selectedJob();event.target.value='';if(!file||!job)return;if(file.size>250*1024*1024){notice('Model files must be 250 MB or smaller.','error');return;}notice('Uploading the selected model to the local production queue…');try{await api(`/api/garage/jobs/${encodeURIComponent(job.id)}/source?filename=${encodeURIComponent(file.name)}`,{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:file});notice('Model attached. The technical artist is preparing it.','success');await refresh(job.id);}catch(error){notice(error.message,'error');}});
  window.WildBoundProductionStudio={setVisible(visible){state.visible=visible;if(visible){refresh();if(!state.timer)state.timer=setInterval(()=>{if(state.visible)refresh();},4000);}else if(state.timer){clearInterval(state.timer);state.timer=null;}},refresh};
  window.addEventListener('beforeunload',event=>{if(state.visible&&state.jobs.some(job=>['queued','running','cancelling','importing'].includes(job.status))){event.preventDefault();event.returnValue='';}});
})();
