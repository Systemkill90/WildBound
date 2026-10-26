'use strict';

const CHARACTER_WORDS=/\b(character|humanoid|npc|hero|protagonist|creature|monster|beast|person|people|player)\b/i;

function isCharacterRequest(job){return CHARACTER_WORDS.test(String(job?.prompt||''));}

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
  const issues=[];
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
  return {passed:issues.length===0,stage:character?'production-character':'draft-artifact',character,issues,checkedAt:new Date().toISOString(),contract:job.preflight?.contract||[]};
}

module.exports={preflight,evaluate,isCharacterRequest};
