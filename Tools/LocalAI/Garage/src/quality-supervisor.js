'use strict';

const CHARACTER_WORDS=/\b(character|humanoid|npc|hero|protagonist|creature|monster|beast|person|people|player)\b/i;
const NEGATED_CHARACTER_CLAUSE=/\b(?:no|without|exclude(?:s|d|ing)?|avoid(?:s|ed|ing)?|not)\b[^.!?;\n]{0,96}\b(?:character|humanoid|npc|hero|protagonist|creature|monster|beast|person|people|player)\b/ig;

function isCharacterRequest(job){const prompt=String(job?.prompt||'').replace(/\bnon[- ]character\b/ig,'').replace(NEGATED_CHARACTER_CLAUSE,'');return CHARACTER_WORDS.test(prompt);}

function preflight(request){
  const character=isCharacterRequest(request);
  const requestedKind=request.kind||'auto';
  const contract=character?[
    'approved character references',
    'recognizable anatomy and silhouette',
    '1.2–2.5 m review scale',
    'armature and skinning',
    'at least one animation clip',
    'owner approval before Unreal import'
  ]:['valid inspected artifact','owner approval before Unreal import'];
  if(character&&['auto','text-to-3d'].includes(requestedKind))return {
    passed:false,code:'character_pipeline_unavailable',stage:'preflight',character:true,contract,
    reason:'Player characters and creatures cannot use prompt-to-3D. Attach a reviewed GLB/FBX through the supplied-model pipeline until a validated character authoring worker is installed.'
  };
  return {passed:true,code:'accepted',stage:'preflight',character,contract,reason:character?'Character work requires a supplied, reference-approved, rigged model.':'The requested workflow has a supported review path.'};
}

function evaluate(job,checks){
  const character=isCharacterRequest(job);
  const kind=job.brief?.kind||job.kind||'unknown';
  const issues=[];
  const evidence=[];
  if(checks?.valid===false)issues.push('The asset inspector marked this file invalid.');
  if(['concept-art','texture','skybox','vfx-source'].includes(kind)){
    if(checks?.width!==undefined&&Number(checks.width)<64)issues.push('Image width must be at least 64 pixels.');
    if(checks?.height!==undefined&&Number(checks.height)<64)issues.push('Image height must be at least 64 pixels.');
    if(kind==='skybox'&&checks?.width&&checks?.height&&Math.abs(Number(checks.width)/Number(checks.height)-2)>0.02)issues.push('Skybox source art must be a 2:1 equirectangular image.');
    if(checks?.width&&checks?.height)evidence.push(`image ${checks.width}×${checks.height} ${checks.format||''}`.trim());
  }
  if(['voice','music','ambience','sfx'].includes(kind)){
    if(checks?.sampleRate!==undefined&&Number(checks.sampleRate)!==48000)issues.push('Audio must be converted to 48 kHz PCM before review.');
    if(checks?.bitDepth!==undefined&&![16,24].includes(Number(checks.bitDepth)))issues.push('Audio must be PCM16 or PCM24.');
    if(checks?.peak!==undefined&&Number(checks.peak)<=1e-6)issues.push('Audio output is silent.');
    if(checks?.seconds!==undefined)evidence.push(`audio ${checks.seconds}s · ${checks.sampleRate} Hz · ${checks.bitDepth}-bit`);
  }
  if(['text-to-3d','model','rigging','animation'].includes(kind)){
    if(checks?.meshes!==undefined&&Number(checks.meshes)<1)issues.push('No mesh geometry was detected.');
    if(checks?.triangles!==undefined&&Number(checks.triangles)<1)issues.push('No triangles were detected.');
    if(checks?.meshes)evidence.push(`${checks.meshes} mesh · ${checks.triangles||0} triangles`);
  }
  if(kind==='rigging'&&checks?.armatures!==undefined&&Number(checks.armatures)<1)issues.push('No armature was found in the supplied model. Rigging authoring is unavailable; this workflow only prepares and verifies supplied rigs.');
  if(kind==='animation'&&checks?.armatures!==undefined&&Number(checks.armatures)<1)issues.push('No armature was found to carry the animation.');
  if(kind==='animation'&&Array.isArray(checks?.animations)&&checks.animations.length<1)issues.push('No animation clip was found in the supplied model. Animation authoring is unavailable; this workflow only prepares and verifies supplied clips.');
  if(character){
    if(job.brief?.kind!=='model')issues.push('Character work did not use the supplied-model character pipeline.');
    if(!(job.referencePackage?.references||[]).length)issues.push('No approved Creative Library character reference was used.');
    if(Number(checks?.meshes||0)<1)issues.push('No mesh geometry was detected.');
    if(Number(checks?.armatures||0)<1)issues.push('No armature was detected.');
    if(!Array.isArray(checks?.animations)||checks.animations.length<1)issues.push('No animation clip was detected.');
    const dimensions=Array.isArray(checks?.dimensionsMeters)?checks.dimensionsMeters.map(Number).filter(Number.isFinite):[];
    const height=dimensions.length?Math.max(...dimensions):0;
    if(height<1.2||height>2.5)issues.push(`Character review scale is ${height.toFixed(2)} m; expected 1.2–2.5 m.`);
  }
  return {passed:issues.length===0,stage:character?'production-character':'draft-artifact',character,kind,issues,evidence,checkedAt:new Date().toISOString(),contract:job.preflight?.contract||[]};
}

module.exports={preflight,evaluate,isCharacterRequest};
