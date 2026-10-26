'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const state = { visible:false, busy:false, jobs:[], status:null, library:null, statusAt:0, selectedId:'', timer:null, clock:null, detailFingerprint:'', modelCache:new Map(),recordCache:new Map() };
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const labels = { queued:'Queued',running:'Working',cancelling:'Cancelling',awaiting_review:'Ready for your review',needs_source:'Waiting for a model source',missing_references:'Needs approved references',blocked_capability:'Blocked: capability unavailable',quality_failed:'Rejected by Quality Supervisor',importing:'Importing to Unreal',completed:'Completed',failed:'Needs attention',interrupted:'Interrupted',cancelled:'Cancelled',rejected:'Rejected' };
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
    $('#capabilitySummary').textContent=`${items.filter(item=>item.available).length} available · ${items.filter(item=>!item.available).length} limited`;
    const lifecycle=state.status?.lifecycle||[];
    $('#productionLifecycle').innerHTML=lifecycle.map(item=>`<article class="production-capability ${item.ready?'ready':'limited'}"><span>${item.ready?'READY':'BLOCKED'}</span><strong>${escape(item.name)}</strong><small>${escape(item.detail)}</small></article>`).join('');
    $('#lifecycleSummary').textContent=`${lifecycle.filter(item=>item.ready).length} of ${lifecycle.length} ready`;
    const sfxOption=$('#productionKind option[value="sfx"]');if(sfxOption)sfxOption.disabled=!items.some(item=>item.id==='sfx'&&item.available);
    const text3dOption=$('#productionKind option[value="text-to-3d"]');if(text3dOption)text3dOption.disabled=!items.some(item=>item.id==='text-to-3d'&&item.available);
    const agents=state.status?.agents||state.status?.teams||[];
    const availableCount=agents.filter(agent=>agent.ready).length;
    $('#agentReadinessSummary').textContent=`${availableCount} of ${agents.length} available`;
    $('#productionAgents').innerHTML=agents.map(agent=>`<article class="production-agent"><div class="production-agent-dot ${agent.ready?'ready':'limited'}"></div><div><strong>${escape(agent.name)}</strong><span>${escape(agent.engine)}</span><small>${escape(agent.role)}</small>${(agent.missing||[]).length?`<em>Needs: ${escape(agent.missing.join(', '))}</em>`:''}</div><b class="agent-state ${agent.ready?'ready':'limited'}">${agent.ready?'Available':'Limited'}</b></article>`).join('')||'<p class="production-muted">Agent status is unavailable.</p>';
    const picker=$('#productionVoice'),current=picker.value;picker.innerHTML='<option value="auto">Auto cast a unique voice</option>'+((state.status?.voices||[]).map(voice=>`<option value="${escape(voice.id)}">${escape(voice.name)} · ${escape(voice.accent)}</option>`).join(''));picker.value=[...picker.options].some(option=>option.value===current)?current:'auto';
  }
  function renderLocalManager(){
    const manager=state.status?.localManager,actions=manager?.actions||[],history=manager?.history||[],prerequisites=manager?.prerequisites||[],blocked=prerequisites.filter(item=>item.state!=='ready');
    const resultSummary=item=>(item.steps||[]).map(step=>{const summary=step.result?.summary;if(!summary)return '';if(step.actionId==='asset-artifact-readiness')return `${summary.verifiedChecksums||0}/${summary.artifactCount||0} artifact checksums · ${summary.readyForReview||0} ready for review · ${summary.issueCount||0} issues`;if(step.actionId==='asset-reference-readiness')return `${summary.verifiedArchiveObjects||0} archive originals · ${summary.pinnedReferences||0} pinned references · ${summary.issueCount||0} issues`;return '';}).filter(Boolean).join(' · ');
    $('#localManagerSummary').textContent=manager?.active?'autopilot working':blocked.length?`${blocked.length} blocked · ${actions.length} safe actions`:`${actions.length} safe actions`;
    $('#productionPrerequisites').innerHTML=blocked.map(item=>`<article class="missing-reference"><strong>${escape(item.name)} · ${escape(item.state.toUpperCase())}</strong><span>${escape(item.detail)}</span><small>${escape(item.nextAction)}</small></article>`).join('');
    $('#localManagerActions').innerHTML=actions.map(action=>{const tone=action.state&&action.state!=='ready'?'limited':action.approvalRequired?'limited':'ready',label=action.state==='blocked'?'BLOCKED':action.approvalRequired?'APPROVAL':action.workflow?'AUTOPILOT':'LOCAL',detail=action.detail||(action.write?'Writes only to its fixed approved destination.':'Read-only or test execution.'),steps=action.steps?.length?` Steps: ${action.steps.map(step=>step.name).join(' → ')}.`:'',button=action.id==='metahuman-foundation-preflight'?'Verify again':action.approvalRequired?'Approve & run':action.workflow?'Run one pass':'Run locally';return `<article class="production-capability ${tone}"><span>${label}</span><strong>${escape(action.name)}</strong><small>${escape(detail+steps)}${action.nextAction?` ${escape(action.nextAction)}`:''}</small><button type="button" class="production-secondary" data-manager-action="${escape(action.id)}" data-manager-confirm="${action.approvalRequired?'true':'false'}">${button}</button></article>`;}).join('')||'<p class="production-muted">Local manager is unavailable.</p>';
    const live=manager?.active?`<article><strong>${escape(manager.active.name)}</strong><small>running${manager.active.currentStep?` · ${escape(manager.active.currentStep)}`:''} · completed steps are retained</small></article>`:'';
    $('#localManagerHistory').innerHTML=live+history.slice(0,5).map(item=>`<article><strong>${escape(item.name)}</strong> <small>${escape(item.status)} · ${escape(new Date(item.completedAt||item.startedAt).toLocaleString())}${item.steps?.length?` · ${item.steps.filter(step=>step.status==='completed').length}/${item.steps.length} steps`:''}${resultSummary(item)?`<br>${escape(resultSummary(item))}`:''}</small></article>`).join('')||'<p class="production-muted">No local-manager actions recorded yet.</p>';
  }
  function renderLibrary(){const library=state.library;if(!library)return;const items=library.items||[],verified=items.filter(item=>['verified','unchanged'].includes(item.status)).length,errors=items.filter(item=>item.status==='error');$('#creativeLibraryStatus').textContent=`${library.busy?'Sync in progress · ':''}${verified} verified inbox items · ${(library.records||[]).length} searchable designs${errors.length?` · ${errors.length} need attention`:''}`;$('#creativeLibraryMissing').innerHTML=(library.missing||[]).map(item=>`<article class="missing-reference"><strong>Missing references for task ${escape(item.jobId)}</strong><span>${escape(item.missing.join(', '))}</span><small>${escape(item.action)}</small><div><button class="production-secondary" data-library-action="explore" data-request-id="${escape(item.id)}">Explore design</button><button class="production-secondary" data-library-action="recheck" data-job-id="${escape(item.jobId)}">Recheck references</button></div></article>`).join('')+errors.map(item=>`<article class="missing-reference"><strong>Sync error: ${escape(item.id)}</strong><span>${escape(item.error)}</span></article>`).join('');$('#creativeLibraryRecords').innerHTML=(library.records||[]).map(item=>`<article><strong>${escape(item.title)}</strong> <small>v${escape(item.version)} · ${escape(item.approval)} · ${escape((item.coverage||[]).join(', '))}</small>${item.approval!=='approved'&&item.approvalAllowed!==false?`<button type="button" class="production-secondary" data-library-action="approve" data-record-id="${escape(item.id)}" data-record-version="${escape(item.version)}">Approve this version</button>`:''}</article>`).join('')||'<p>No imported designs yet.</p>';}
  function renderLibraryItems(){
    const items=state.library?.items||[];
    $('#creativeLibraryItems').innerHTML=items.map(item=>`<article><strong>${escape(item.id)}</strong> <small>${escape(item.status)} · v${escape(item.version||'—')}${item.error?` · ${escape(item.error)}`:''}</small></article>`).join('')||'<p>No inbox items checked yet.</p>';
    for(const request of state.library?.missing||[]){
      const button=document.createElement('button');button.type='button';button.className='production-secondary';button.textContent='Supply references';button.dataset.libraryAction='supply';button.dataset.requestId=request.id;
      const actions=$('#creativeLibraryMissing').querySelector(`[data-request-id="${CSS.escape(request.id)}"]`)?.parentElement;
      actions?.append(button);
      if(request.conflicts?.length){const note=document.createElement('small');note.textContent='Conflicting approvals: '+request.conflicts.map(pair=>pair.join(' / ')).join(', ');actions?.parentElement?.append(note);}
    }
    (state.library?.records||[]).forEach((record,index)=>{
      const article=$('#creativeLibraryRecords').querySelectorAll('article')[index];if(!article)return;
      const inspect=document.createElement('button');inspect.type='button';inspect.className='production-secondary';inspect.textContent='Review originals';inspect.dataset.libraryAction='inspect';inspect.dataset.recordId=record.id;article.append(inspect);
      if(record.approval==='approved'){const button=document.createElement('button');button.type='button';button.className='production-secondary';button.textContent='Withdraw approval';button.dataset.libraryAction='withdraw';button.dataset.recordId=record.id;button.dataset.recordVersion=record.version;article.append(button);}
      const detail=state.recordCache.get(record.id);if(detail){const container=document.createElement('div');container.className='library-detail';container.innerHTML=detail.versions.map(version=>`<section><strong>Version ${escape(version.version)} · ${escape(version.approval)}</strong><small>Source: ${escape(version.origin?.method||'unknown')} · ${escape(version.origin?.source||'unknown')}</small><pre>${escape(version.text)}</pre>${(version.media||[]).map((file,index)=>{const src=`/api/garage/library/media/${encodeURIComponent(detail.id)}/${version.version}/${index}`;return `<div><small>${escape(file.kind)} · ${escape(file.name)} · SHA-256 ${escape(file.sha256)}</small>${file.kind==='image'?`<img loading="lazy" alt="Original reference ${escape(file.name)}" src="${src}">`:file.kind==='audio'?`<audio controls preload="none" src="${src}"></audio>`:`<a href="${src}" download>Download original</a>`}</div>`;}).join('')}</section>`).join('');article.append(container);}
    });
    filterLibraryRecords();
  }
  function filterLibraryRecords(){const query=$('#librarySearch').value.trim().toLowerCase();(state.library?.records||[]).forEach((record,index)=>{$('#creativeLibraryRecords').querySelectorAll('article')[index].hidden=!!query&&!`${record.title} ${record.id} ${(record.coverage||[]).join(' ')}`.toLowerCase().includes(query);});}
  function visibleJobs() {
    const filter=$('#productionFilter').value;
    return state.jobs.filter(job=>filter==='all'||(filter==='active'?['queued','running','cancelling','importing','needs_source','missing_references'].includes(job.status):filter==='failed'?['failed','interrupted'].includes(job.status):job.status===filter));
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
    if(['voice','music','ambience','sfx'].includes(kind))return `<div class="artifact-preview audio-preview"><div><strong>${kind==='voice'?'Character voice':kind==='music'?'Music':kind==='sfx'?'Sound effect':'Musical ambience'}</strong><small>${escape(job.checks?.seconds??'')} seconds · ${escape(job.checks?.sampleRate??'')} Hz</small></div><audio controls preload="metadata" src="/api/garage/jobs/${id}/files/preview"></audio><a href="/api/garage/jobs/${id}/files/preview" download>Download WAV</a></div>`;
    return `<div class="artifact-preview model-preview"><canvas id="modelPreviewCanvas" width="720" height="460" aria-label="Interactive 3D model preview"></canvas><small>Drag to orbit · scroll to zoom · material colors previewed without Unreal lighting</small><a href="/api/garage/jobs/${id}/files/source" download>Download prepared model</a></div>`;
  }
  function renderReferencePackage(job) {
    const requirements=job.brief?.requirements||[],pack=job.referencePackage,references=pack?.references||[],missing=pack?.missing||[],conflicts=pack?.conflicts||[];
    if(!requirements.length&&!references.length&&!missing.length&&!conflicts.length)return '';
    const state=missing.length||conflicts.length?'BLOCKED':references.length?'APPROVED':'UNRESOLVED';
    const requirementList=requirements.length?`<section><strong>Production requirements</strong><ul>${requirements.map(item=>`<li>${escape(item)}</li>`).join('')}</ul></section>`:'';
    const referenceList=references.length?references.map(ref=>`<article><strong>${escape(ref.id)}@v${escape(ref.version)} · APPROVED</strong><small>${escape((ref.coverage||[]).join(', '))}</small>${(ref.media||[]).map(media=>`<span>${escape(media.kind)} · ${escape(media.name)} · SHA-256 ${escape(media.sha256)}</span>`).join('')}</article>`).join(''):'<p class="production-muted">No approved references are attached.</p>';
    const issues=[...missing.map(item=>'Missing: '+item),...conflicts.map(pair=>'Conflict: '+pair.join(' / '))];
    return `<details class="production-process reference-package"><summary>Worker reference package · ${state} · ${references.length} version-pinned</summary>${requirementList}<section><strong>Approved Creative Library references</strong>${referenceList}</section>${issues.length?`<p class="production-error">${escape(issues.join(' · '))}</p>`:''}</details>`;
  }
  function renderProductionPlan(job) {
    const groups=[['Character design',job.characterDesign],['3D artist handoff',job.spec]].filter(([,value])=>value&&typeof value==='object');
    if(!groups.length)return '';
    const fields=value=>Object.entries(value).map(([name,content])=>`<article><strong>${escape(name.replace(/([A-Z])/g,' $1'))}</strong><span>${escape(Array.isArray(content)?content.join(' · '):typeof content==='object'?JSON.stringify(content):content)}</span></article>`).join('');
    return `<details class="production-process production-plan"><summary>Specialist production plan · ${groups.length} handoff${groups.length===1?'':'s'} ready</summary>${groups.map(([name,value])=>`<section><strong>${escape(name)}</strong>${fields(value)}</section>`).join('')}</details>`;
  }
  function renderDetails(job) {
    if(!job){$('#productionDetails').innerHTML='<div class="production-empty">Select a task to follow its handoffs, review its output, and approve or reject the Unreal import.</div>';return;}
    const status=labels[job.status]||job.status;
    const checks=job.checks;
    let report='';
    if(checks){report=['model','text-to-3d'].includes(job.artifact?.kind)?`${checks.triangles||0} triangles · ${checks.meshes||0} meshes · ${checks.armatures||0} armatures · ${checks.animations?.length||0} animation clips`:job.artifact?.kind==='texture'?`${checks.width} × ${checks.height} · ${checks.format||'image'}`:`${Number(checks.seconds||0).toFixed(1)} seconds · ${checks.sampleRate} Hz · ${checks.bitDepth}-bit · ${checks.channels} channels`;}
    const engineAssets=job.engine?.assets||[];
    const actionButtons=[];
    if(job.status==='awaiting_review')actionButtons.push('<button data-job-action="approve" class="production-primary">Approve &amp; import</button>','<button data-job-action="reject" class="production-secondary">Reject</button>');
    if(job.status==='needs_source'&&!job.spec)actionButtons.push('<button data-job-action="prepare-plan" class="production-primary">Prepare model plan</button>');
    if(job.status==='needs_source')actionButtons.push('<button data-job-action="attach" class="production-primary">Attach GLB / FBX</button>');
    if(['queued','running','cancelling','importing','needs_source','missing_references','blocked_capability','quality_failed'].includes(job.status))actionButtons.push('<button data-job-action="cancel" class="production-secondary">Cancel task</button>');
    if(job.status==='interrupted')actionButtons.push('<button data-job-action="resume" class="production-primary">Resume from checkpoint</button>');
    if(['failed','interrupted'].includes(job.status)&&job.approvedAt)actionButtons.push('<button data-job-action="retry-import" class="production-primary">Retry Unreal import</button>');
    const current=job.agentRuns?.findLast(run=>run.status==='running');
    const live=current?`<div class="production-live" role="status"><i></i><strong>${escape(current.agentName)} is working</strong><span>${escape(current.step)}</span><time data-live-start="${escape(current.startedAt)}">0:00</time></div>`:'';
    const voice=job.brief?.kind==='voice'?`<p class="asset-report">${job.characterName?`Character: ${escape(job.characterName)} · `:''}Voice: ${escape((state.status?.voices||[]).find(item=>item.id===job.voice)?.name||job.voice)}</p>`:'';
    const revision=['awaiting_review','quality_failed'].includes(job.status)?`<div class="production-revision"><label for="productionRevision">Request specific changes for version ${escape(job.revision||1)}</label><textarea id="productionRevision" maxlength="2000" rows="2" placeholder="Describe what to change in the next pass."></textarea>${job.brief?.kind==='voice'?`<select id="productionRevisionVoice" aria-label="Voice for the next take"><option value="auto">Try a different unique voice</option>${(state.status?.voices||[]).filter(item=>item.id!==job.voice).map(item=>`<option value="${escape(item.id)}">${escape(item.name)} · ${escape(item.accent)}</option>`).join('')}</select>`:''}${job.brief?.kind==='model'?'<small>Geometry edits need an updated GLB or FBX after you submit the feedback.</small>':''}<button type="button" data-job-action="revise" class="production-secondary">Request changes</button></div>`:'';
    const quality=job.preflight||job.quality?`<div class="engine-evidence"><strong>Quality Supervisor</strong><span>Preflight: ${escape(job.preflight?.passed?'passed':'blocked')}${job.quality?` · Output: ${escape(job.quality.passed?'passed':'rejected')}`:''}${job.quality?.issues?.length?`<br>${escape(job.quality.issues.join(' '))}`:''}</span></div>`:'';
    $('#productionDetails').innerHTML=`<div class="production-detail-heading"><div><div class="eyebrow">TASK REVIEW · VERSION ${escape(job.revision||1)}</div><h2>${escape(summary(job))}</h2><span class="job-state ${escape(job.status)}">${escape(status)} · ${escape(kindLabel(job))}</span></div><button class="quiet-refresh" data-job-action="refresh" type="button">↻</button></div>${live}${voice}${job.error?`<p class="production-error">${escape(job.error)}</p>`:''}${report?`<p class="asset-report">${escape(report)}</p>`:''}${quality}<div class="production-job-actions">${actionButtons.join('')}</div>${renderReferencePackage(job)}${renderProductionPlan(job)}${revision}<div class="production-preview">${renderPreview(job)}</div><details class="production-process"><summary>Production stages and agent handoffs</summary>${renderSteps(job)}${renderAgentRuns(job)}</details>${job.revisionHistory?.length?`<details class="production-process"><summary>Earlier reviews (${job.revisionHistory.length})</summary>${job.revisionHistory.map(entry=>`<p>Version ${escape(entry.revision)} · ${escape(entry.feedback)}</p>`).join('')}</details>`:''}${engineAssets.length?`<div class="engine-evidence"><strong>Unreal verified</strong><span>${engineAssets.map(a=>escape(a.class)+' · '+escape(a.path)).join('<br>')}</span></div>`:''}`;
    if(['model','text-to-3d'].includes(job.artifact?.kind))loadModelPreview(job);
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
      const needStatus=!state.status||Date.now()-state.statusAt>10000;
      const [status,jobs,library]=await Promise.all([needStatus?api('/api/garage/status'):Promise.resolve(state.status),api('/api/garage/jobs?limit=100'),api('/api/garage/library')]);if(needStatus)state.statusAt=Date.now();
      state.status=status;state.jobs=jobs.jobs||[];state.library=library;state.selectedId=selectId&&state.jobs.some(j=>j.id===selectId)?selectId:(state.jobs[0]?.id||'');const resume=$('#resumeGarage');resume.hidden=!status.recovery?.resumeAvailable;resume.textContent=status.recovery?.interrupted?`Resume Garage (${status.recovery.interrupted})`:'Resume Garage';
      renderCapabilities();renderLocalManager();renderLibrary();renderLibraryItems();renderJobs();const job=state.jobs.find(j=>j.id===state.selectedId);const fingerprint=job?`${job.id}:${job.updatedAt}:${job.status}`:'empty';if(fingerprint!==state.detailFingerprint){state.detailFingerprint=fingerprint;renderDetails(job);}tickLive();
      $('#productionUpdated').textContent=`Updated ${new Date().toLocaleTimeString()}`;if(!state.jobs.length)notice(`${state.status?.agents?.length||0} production roles are connected to the shared queue. Start a task to create the first handoff.`,'success');else notice('Your tasks and review decisions stay on this PC.','success');
    }catch(error){$('#productionUpdated').textContent='Production service unavailable';notice(`${error.message} The browser, image, audio, and asset studios remain available.`, 'error');}
    finally{state.busy=false;}
  }
  async function act(action,job) {
    if(action==='refresh')return refresh(job.id);
    if(action==='attach')return $('#productionModelFile').click();
    if(action==='prepare-plan'){const button=$('[data-job-action="prepare-plan"]');if(button)button.disabled=true;try{await api(`/api/garage/jobs/${encodeURIComponent(job.id)}/prepare-plan`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});notice('The character designer and 3D artist are preparing the model plan.','success');await refresh(job.id);}catch(error){notice(error.message,'error');if(button)button.disabled=false;}return;}
    if(action==='revise'){const feedback=$('#productionRevision')?.value.trim(),voice=$('#productionRevisionVoice')?.value||'auto';if(!feedback){notice('Describe the changes you want in the next version.','error');$('#productionRevision')?.focus();return;}try{await api(`/api/garage/jobs/${encodeURIComponent(job.id)}/revise`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({feedback,voice})});notice('Changes saved. The next version is starting.','success');await refresh(job.id);}catch(error){notice(error.message,'error');}return;}
    if(action==='resume'){try{await api('/api/garage/resume',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jobId:job.id})});notice('Task resumed from its last saved checkpoint.','success');await refresh(job.id);}catch(error){notice(error.message,'error');}return;}
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
  $('#localManagerActions').addEventListener('click',async event=>{const button=event.target.closest('[data-manager-action]');if(!button)return;const actionId=button.dataset.managerAction,requiresApproval=button.dataset.managerConfirm==='true';if(requiresApproval&&!window.confirm('Approve this fixed local write action? The command and destination are predefined and the result will be audited.'))return;button.disabled=true;try{const result=await api('/api/garage/local-manager/run',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({actionId,dryRun:false,confirmation:requiresApproval?actionId:null})});notice(result.status==='blocked'?`${result.name}: blocked. ${result.error}`:`${result.name}: ${result.status}.`,result.status==='completed'?'success':result.status==='blocked'?'error':'info');state.statusAt=0;await refresh();}catch(error){notice(error.message,'error');}finally{button.disabled=false;}});
  $('#localManagerForm').addEventListener('submit',async event=>{event.preventDefault();const button=event.submitter,task=$('#localManagerTask').value.trim();button.disabled=true;$('#localManagerPlan').textContent='Qwen is selecting from the fixed local action registry…';try{const plan=await api('/api/garage/local-manager/plan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({task})});$('#localManagerPlan').textContent=plan.actionId==='none'?`No safe action selected: ${plan.reason}`:`Selected ${plan.actionId}${plan.approvalRequired?' · owner approval still required':''}: ${plan.reason}`;state.statusAt=0;await refresh();}catch(error){$('#localManagerPlan').textContent=error.message;}finally{button.disabled=false;}});
  $('#productionFilter').addEventListener('change',renderJobs);
  $('#updateIdeaBoard').addEventListener('click',async()=>{const button=$('#updateIdeaBoard');button.disabled=true;notice('Checking the private Idea Board inbox and verifying originals…');try{await api('/api/garage/library/sync',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});notice('Idea Board sync started. Progress and missing references update here.','success');await refresh();}catch(error){notice(error.message,'error');}finally{button.disabled=false;}});
  $('#creativeLibraryForm').addEventListener('submit',async event=>{
    event.preventDefault();const button=event.submitter;button.disabled=true;
    try{
      const files=[...[...$('#libraryImages').files].map(file=>({file,kind:'image'})),...[...$('#libraryAudio').files].map(file=>({file,kind:'audio'}))];
      if(files.length>10||files.some(({file})=>file.size>15*1024*1024)||files.reduce((sum,{file})=>sum+file.size,0)>25*1024*1024)throw new Error('Choose up to ten original files, 15 MiB each and 25 MiB total. Larger files can use the private NAS inbox.');
      const media=[];
      for(const {file,kind} of files){const bytes=new Uint8Array(await file.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));media.push({kind,name:file.name,base64:btoa(binary)});}
      const tags=$('#libraryCoverage').value.split(',').map(value=>value.trim().toLowerCase()).filter(Boolean);
      const payload={id:$('#libraryDesignId').value.trim(),title:$('#libraryTitle').value.trim(),text:$('#libraryText').value,coverage:tags,relations:$('#libraryRelations').value.split(',').map(value=>value.trim().toLowerCase()).filter(Boolean),media};
      await api('/api/garage/library/supply',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      notice('Originals saved to the private Library inbox. Verification is running; this version stays exploratory until you approve it.','success');event.target.reset();$('#creativeLibrarySupply').open=false;await refresh();
    }catch(error){notice(error.message,'error');}finally{button.disabled=false;}
  });
  $('#creativeLibraryStatus').addEventListener('click',()=>refresh());
  $('#librarySearch').addEventListener('input',filterLibraryRecords);
  $('#creativeLibraryMissing').addEventListener('click',async event=>{const button=event.target.closest('[data-library-action]');if(!button)return;if(button.dataset.libraryAction==='supply'){const request=(state.library?.missing||[]).find(item=>item.id===button.dataset.requestId);if(request){$('#creativeLibrarySupply').open=true;$('#libraryCoverage').value=request.missing.join(', ');$('#libraryTitle').value=`References for ${request.prompt.slice(0,90)}`;$('#libraryDesignId').focus();}return;}if(button.dataset.libraryAction==='explore'){const request=(state.library?.missing||[]).find(item=>item.id===button.dataset.requestId);if(request){$('#productionPrompt').value=`Explore references for ${request.prompt}. Missing: ${request.missing.join(', ')}. Mark all results exploratory for owner review.`;$('#productionPrompt').focus();}return;}if(button.dataset.libraryAction==='recheck'){try{await api('/api/garage/library/resolve',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jobId:button.dataset.jobId})});await refresh();}catch(error){notice(error.message,'error');}}});
  $('#creativeLibraryRecords').addEventListener('click',async event=>{const button=event.target.closest('[data-library-action]');if(!button)return;if(button.dataset.libraryAction==='inspect'){try{const record=await api(`/api/garage/library/records/${encodeURIComponent(button.dataset.recordId)}`);state.recordCache.set(record.id,record);renderLibrary();renderLibraryItems();}catch(error){notice(error.message,'error');}return;}const withdraw=button.dataset.libraryAction==='withdraw';if(!window.confirm(`${withdraw?'Withdraw approval of':'Approve'} ${button.dataset.recordId} version ${button.dataset.recordVersion} ${withdraw?'for future worker tasks':'for creative worker use'}?`))return;try{await api(`/api/garage/library/${withdraw?'withdraw':'approve'}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:button.dataset.recordId,version:Number(button.dataset.recordVersion)})});state.recordCache.delete(button.dataset.recordId);notice(withdraw?'Approval withdrawn for future tasks.':'Reference version approved and available to workers.','success');await refresh();}catch(error){notice(error.message,'error');}});
  $('#productionKind').addEventListener('change',()=>{$('#productionCharacterLabel').hidden=$('#productionKind').value!=='voice';});
  $('#refreshProduction').addEventListener('click',()=>refresh());
  $('#resumeGarage').addEventListener('click',async()=>{const button=$('#resumeGarage');button.disabled=true;try{const result=await api('/api/garage/resume',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});notice(`${result.resumed} interrupted task${result.resumed===1?'':'s'} resumed from saved checkpoints.`,'success');await refresh();}catch(error){notice(error.message,'error');}finally{button.disabled=false;}});
  $('#productionForm').addEventListener('submit',async event=>{
    event.preventDefault();const submit=$('#submitProduction');if(submit.disabled)return;submit.disabled=true;notice('The production director is assigning this task to the shared team…');
    try{const job=await api('/api/garage/jobs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:$('#productionPrompt').value,kind:$('#productionKind').value,biome:$('#productionBiome').value,characterName:$('#productionCharacterName').value,voice:$('#productionVoice').value,seconds:Number($('#productionSeconds').value)})});$('#productionPrompt').value='';state.selectedId=job.id;notice('Task accepted. The director and specialist are starting their handoff.','success');await refresh(job.id);}
    catch(error){notice(error.message,'error');}
    finally{submit.disabled=false;}
  });
  $('#productionModelFile').addEventListener('change',async event=>{const file=event.target.files?.[0],job=selectedJob();event.target.value='';if(!file||!job)return;if(file.size>250*1024*1024){notice('Model files must be 250 MB or smaller.','error');return;}notice('Uploading the selected model to the local production queue…');try{await api(`/api/garage/jobs/${encodeURIComponent(job.id)}/source?filename=${encodeURIComponent(file.name)}`,{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:file});notice('Model attached. The technical artist is preparing it.','success');await refresh(job.id);}catch(error){notice(error.message,'error');}});
  function tickLive(){for(const element of document.querySelectorAll('[data-live-start]')){const elapsed=Math.max(0,Math.floor((Date.now()-Date.parse(element.dataset.liveStart))/1000));element.textContent=`${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')}`;}}
  window.WildBoundProductionStudio={setVisible(visible){state.visible=visible;if(visible){refresh();if(!state.timer)state.timer=setInterval(()=>{if(state.visible)refresh();},2000);if(!state.clock)state.clock=setInterval(tickLive,1000);}else{if(state.timer){clearInterval(state.timer);state.timer=null;}if(state.clock){clearInterval(state.clock);state.clock=null;}}},refresh};
  window.addEventListener('beforeunload',event=>{if(state.visible&&state.jobs.some(job=>['queued','running','cancelling','importing'].includes(job.status))){event.preventDefault();event.returnValue='';}});
})();
