'use strict';

const FACETS={
  character:['appearance','anatomy','culture','clothing','character-reference'],
  person:['appearance','anatomy','culture','clothing','character-reference'],
  model:['appearance','anatomy','materials','technical'],
  prop:['culture','materials','prop-reference','technical'],
  appliance:['culture','materials','prop-reference','technical'],
  architecture:['culture','materials','architecture-reference','technical'],
  texture:['materials','surface-reference'],
  voice:['culture','voice-reference'],
  music:['culture','music-reference'],
  ambience:['environment','audio-reference'],
  sfx:['materials','environment','audio-reference']
};
const key=value=>typeof value==='string'&&/^[a-z0-9][a-z0-9-]{1,48}:[a-z0-9][a-z0-9-]{1,48}$/.test(value);
const normalize=value=>String(value||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const contains=(text,term)=>new RegExp('(^|[^a-z0-9])'+term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replaceAll('-','[\\s-]+')+'(?=$|[^a-z0-9])','i').test(text);

function planReferences({prompt,brief={},records=[]}){
  const required=new Set(),text=String(prompt||'').toLowerCase();
  const add=value=>{if(key(value))required.add(value);};
  for(const need of Array.isArray(brief.referenceNeeds)?brief.referenceNeeds.slice(0,20):[]){
    if(typeof need==='string')add(normalize(need.split(':')[0])+':'+normalize(need.split(':')[1]));
    else if(need&&typeof need==='object')add(normalize(need.subject)+':'+normalize(need.facet));
  }
  const known=new Map();
  for(const record of records){
    for(const version of record.versions||[]){
      for(const coverage of version.coverage||record.coverage||[]){
        if(!key(coverage))continue;
        const [subject,facet]=coverage.split(':');
        if(!known.has(subject))known.set(subject,new Set());
        known.get(subject).add(facet);
      }
    }
  }
  const kind=String(brief.kind||'').toLowerCase();
  const role=Object.keys(FACETS).find(word=>contains(text,word))||kind;
  const facets=FACETS[role]||[];
  for(const subject of known.keys())if(contains(text,subject)){
    for(const facet of facets)add(subject+':'+facet);
    if(!facets.length)for(const facet of known.get(subject))add(subject+':'+facet);
  }
  return [...required].slice(0,24);
}

module.exports={planReferences,normalize,key};
