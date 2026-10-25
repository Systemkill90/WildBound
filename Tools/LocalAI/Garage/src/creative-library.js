'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {planReferences,key}=require('./reference-planner');

const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const safeId=value=>typeof value==='string'&&/^[a-z0-9][a-z0-9-]{2,79}$/.test(value);
function atomic(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});const temp=file+'.'+crypto.randomUUID()+'.tmp';const fd=fs.openSync(temp,'wx');try{fs.writeFileSync(fd,JSON.stringify(value,null,2)+'\n');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}fs.renameSync(temp,file);}
function inside(root,relative){if(typeof relative!=='string'||!relative||path.isAbsolute(relative)||relative.includes('..')||relative.includes(':')||relative.includes('\\'))throw new Error('Use a simple relative file path.');const base=fs.realpathSync(root),file=fs.realpathSync(path.join(base,relative));const part=path.relative(base,file);if(!part||part.startsWith('..')||path.isAbsolute(part))throw new Error('Source escaped the inbox item.');return file;}
function read(file,fallback){try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch(error){if(error.code==='ENOENT')return fallback;throw error;}}
function mediaType(file,kind){const b=Buffer.alloc(16),fd=fs.openSync(file,'r');try{fs.readSync(fd,b,0,16,0);}finally{fs.closeSync(fd);}const ext=path.extname(file).toLowerCase();const image=(ext==='.png'&&b.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')))||(('.jpg'===ext||'.jpeg'===ext)&&b[0]===0xff&&b[1]===0xd8)||(ext==='.webp'&&b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP');const audio=(ext==='.wav'&&b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WAVE')||(ext==='.flac'&&b.toString('ascii',0,4)==='fLaC')||(ext==='.mp3'&&(b.toString('ascii',0,3)==='ID3'||(b[0]===0xff&&(b[1]&0xe0)===0xe0)))||(ext==='.m4a'&&b.toString('ascii',4,8)==='ftyp');if((kind==='image'&&!image)||(kind==='audio'&&!audio))throw new Error('Media content does not match its declared image/audio type: '+path.basename(file));return ext;}

class CreativeLibrary {
  constructor({nasRoot,repoRoot,stateRoot}){this.nasRoot=nasRoot;this.repoRoot=repoRoot;this.stateRoot=stateRoot;this.inbox=nasRoot?path.join(nasRoot,'inbox'):null;this.archive=nasRoot?path.join(nasRoot,'archive'):null;this.records=path.join(repoRoot,'docs','creative-library','records');this.stateFile=path.join(stateRoot,'sync-state.json');this.missingFile=path.join(stateRoot,'missing-requests.json');this.busy=false;for(const dir of [this.records,this.stateRoot])fs.mkdirSync(dir,{recursive:true});try{if(nasRoot)for(const dir of [this.inbox,this.archive])fs.mkdirSync(dir,{recursive:true});this.nasError=nasRoot?null:'Configure a private Creative Library NAS root.';}catch(error){this.nasError=error.message;}}
  state(){return read(this.stateFile,{items:{}});}
  missing(){return read(this.missingFile,{});}
  record(id){if(!safeId(id))throw new Error('Invalid design ID.');return read(path.join(this.records,id+'.json'),null);}
  list(){return fs.readdirSync(this.records).filter(name=>name.endsWith('.json')).map(name=>read(path.join(this.records,name),null)).filter(Boolean);}
  status(){const state=this.state();return {available:Boolean(this.inbox&&this.archive&&fs.existsSync(this.inbox)&&fs.existsSync(this.archive)),error:this.nasError,busy:this.busy,items:Object.values(state.items),missing:Object.values(this.missing()).filter(item=>item.status==='open'),records:this.list().map(item=>({id:item.id,title:item.title,version:item.versions.at(-1)?.version,approval:item.versions.at(-1)?.approval,approvalAllowed:item.versions.at(-1)?.approvalAllowed!==false,coverage:item.coverage}))};}
  store(original){const digest=hash(original),ext=path.extname(original).toLowerCase();const destination=path.join(this.archive,digest.slice(0,2),digest+ext);fs.mkdirSync(path.dirname(destination),{recursive:true});if(fs.existsSync(destination)){if(hash(destination)!==digest)throw new Error('Archived file failed checksum verification: '+path.basename(destination));return {sha256:digest,bytes:fs.statSync(destination).size,object:path.relative(this.nasRoot,destination).replaceAll('\\','/')};}const temp=destination+'.'+crypto.randomUUID()+'.tmp';try{fs.copyFileSync(original,temp,fs.constants.COPYFILE_EXCL);const fd=fs.openSync(temp,'r+');try{fs.fsyncSync(fd);}finally{fs.closeSync(fd);}if(hash(temp)!==digest)throw new Error('NAS copy checksum mismatch.');fs.renameSync(temp,destination);if(hash(destination)!==digest)throw new Error('NAS archive verification failed.');return {sha256:digest,bytes:fs.statSync(destination).size,object:path.relative(this.nasRoot,destination).replaceAll('\\','/')};}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}}
  importOne(folder){const base=path.join(this.inbox,folder),manifestPath=inside(base,'manifest.json'),raw=fs.readFileSync(manifestPath,'utf8'),manifest=JSON.parse(raw);if(!safeId(manifest.id)||manifest.id!==folder)throw new Error('Manifest ID must match the inbox folder.');if(typeof manifest.title!=='string'||!manifest.title.trim()||manifest.title.length>160)throw new Error('Design title is required.');if(!manifest.origin||typeof manifest.origin.method!=='string'||!manifest.origin.method||!manifest.origin.source)throw new Error('Origin method and source are required.');if(!Array.isArray(manifest.media)||!Array.isArray(manifest.coverage))throw new Error('Media and coverage arrays are required.');if(manifest.media.length>30)throw new Error('Too many media files.');const originalText=inside(base,manifest.textFile);if(fs.statSync(originalText).size>1024*1024)throw new Error('Text exceeds 1 MiB.');const text=fs.readFileSync(originalText,'utf8');const media=manifest.media.map(item=>{if(!['image','audio','other'].includes(item.kind))throw new Error('Unsupported media kind.');const source=inside(base,item.file);if(fs.statSync(source).size>250*1024*1024)throw new Error('Media exceeds 250 MiB.');mediaType(source,item.kind);return {kind:item.kind,name:path.basename(source),source:item.source||manifest.origin.source,...this.store(source)};});const textObject=this.store(originalText),manifestObject=this.store(manifestPath);const fingerprint=crypto.createHash('sha256').update(raw+textObject.sha256+media.map(item=>item.sha256).join('')).digest('hex');const previous=this.record(manifest.id);if(previous?.versions.some(version=>version.fingerprint===fingerprint))return {id:manifest.id,status:'unchanged',version:previous.versions.find(version=>version.fingerprint===fingerprint).version};const version=(previous?.versions.at(-1)?.version||0)+1;const record={schema:1,id:manifest.id,title:manifest.title,coverage:[...new Set(manifest.coverage.filter(x=>typeof x==='string'&&/^[a-z0-9:-]{2,80}$/.test(x)))],relations:Array.isArray(manifest.relations)?manifest.relations.filter(x=>typeof x==='string').slice(0,30):[],versions:[...(previous?.versions||[]),{version,fingerprint,coverage:manifest.coverage,relations:manifest.relations||[],approval:'exploratory',approvalAllowed:manifest.approvalAllowed!==false,origin:manifest.origin,text,originalText:textObject,originalManifest:manifestObject,media,conflictsWith:Array.isArray(manifest.conflictsWith)?manifest.conflictsWith.filter(safeId).slice(0,20):[],importedAt:new Date().toISOString()}]};atomic(path.join(this.records,manifest.id+'.json'),record);return {id:manifest.id,status:'verified',version,media:media.length};}
  async sync(){if(!this.nasRoot)throw new Error('Configure a private Creative Library NAS root.');if(this.busy)throw new Error('Idea Board sync is already running.');this.busy=true;const state=this.state();try{for(const dir of [this.inbox,this.archive])fs.mkdirSync(dir,{recursive:true});this.nasError=null;for(const folder of fs.readdirSync(this.inbox)){if(!safeId(folder)||!fs.statSync(path.join(this.inbox,folder)).isDirectory())continue;state.items[folder]={id:folder,status:'queued',updatedAt:new Date().toISOString()};atomic(this.stateFile,state);await new Promise(resolve=>setImmediate(resolve));try{state.items[folder].status='archiving';atomic(this.stateFile,state);await new Promise(resolve=>setImmediate(resolve));state.items[folder]={...this.importOne(folder),updatedAt:new Date().toISOString()};}catch(error){state.items[folder]={id:folder,status:'error',error:String(error.message||error).slice(0,500),updatedAt:new Date().toISOString()};}atomic(this.stateFile,state);}}catch(error){this.nasError=error.message;throw error;}finally{this.busy=false;}return this.status();}
  supply(payload){
    if(!this.nasRoot)throw new Error('Configure a private Creative Library NAS root.');
    if(this.busy)throw new Error('Wait for the current library sync to finish.');
    if(!safeId(payload.id))throw new Error('Use a lowercase design ID with letters, numbers, and hyphens.');
    if(typeof payload.title!=='string'||!payload.title.trim()||payload.title.length>160)throw new Error('A short design title is required.');
    if(typeof payload.text!=='string'||!payload.text.trim()||Buffer.byteLength(payload.text)>1024*1024)throw new Error('Design text is required and must be under 1 MiB.');
    if(!Array.isArray(payload.coverage)||payload.coverage.some(tag=>!key(tag)))throw new Error('Coverage must use subject:facet tags.');
    if(!Array.isArray(payload.media)||payload.media.length>10)throw new Error('Upload up to ten original media files.');
    const temporary=path.join(this.inbox,'.incoming-'+crypto.randomUUID());
    const destination=path.join(this.inbox,payload.id);
    const previous=path.join(this.inbox,'.previous',payload.id+'-'+Date.now());
    let oldMoved=false;
    fs.mkdirSync(temporary,{recursive:true});
    try{
      fs.writeFileSync(path.join(temporary,'idea.md'),payload.text,'utf8');
      const names=new Set(['idea.md','manifest.json']);
      const media=payload.media.map(item=>{
        const name=item?.name;
        if(typeof name!=='string'||!(/^[A-Za-z0-9][A-Za-z0-9_.-]{0,100}$/.test(name))||name.includes('..')||names.has(name))throw new Error('Media filenames must be unique and simple.');
        if(!['image','audio','other'].includes(item.kind)||typeof item.base64!=='string'||item.base64.length>21*1024*1024||!/^[A-Za-z0-9+/]+={0,2}$/.test(item.base64))throw new Error('Unsupported media type or size.');
        const bytes=Buffer.from(item.base64,'base64');
        if(!bytes.length||bytes.length>15*1024*1024||bytes.toString('base64')!==item.base64)throw new Error('Media data is invalid or exceeds 15 MiB.');
        names.add(name);const file=path.join(temporary,name);fs.writeFileSync(file,bytes);mediaType(file,item.kind);
        return {kind:item.kind,file:name,source:'Owner-uploaded original through local Garage UI'};
      });
      const manifest={id:payload.id,title:payload.title.trim(),origin:{method:'garage-desktop-upload',source:'Owner-uploaded original through local Garage UI',createdAt:new Date().toISOString()},textFile:'idea.md',media,coverage:[...new Set(payload.coverage)],relations:Array.isArray(payload.relations)?payload.relations.filter(value=>typeof value==='string').slice(0,30):[],conflictsWith:Array.isArray(payload.conflictsWith)?payload.conflictsWith.filter(safeId).slice(0,20):[],approvalAllowed:true};
      atomic(path.join(temporary,'manifest.json'),manifest);
      if(fs.existsSync(destination)){fs.mkdirSync(path.dirname(previous),{recursive:true});fs.renameSync(destination,previous);oldMoved=true;}
      fs.renameSync(temporary,destination);
      return {id:payload.id,status:'queued',files:media.length+2};
    }catch(error){
      if(oldMoved&&!fs.existsSync(destination))fs.renameSync(previous,destination);
      if(fs.existsSync(temporary))fs.rmSync(temporary,{recursive:true,force:true});
      throw error;
    }
  }
  approve(id,version){const record=this.record(id);if(!record)throw new Error('Design not found.');const selected=record.versions.find(item=>item.version===version);if(!selected)throw new Error('Version not found.');if(selected.approvalAllowed===false)throw new Error('This mixed-media transport fixture cannot be approved as a design.');const originals=[selected.originalText,selected.originalManifest,...selected.media];if(!originals.every(item=>{try{const file=path.join(this.nasRoot,item.object);return fs.statSync(file).size===item.bytes&&hash(file)===item.sha256;}catch{return false;}}))throw new Error('An original is inaccessible or failed checksum verification on the NAS.');selected.approval='approved';selected.approvedAt=new Date().toISOString();atomic(path.join(this.records,id+'.json'),record);return record;}
  withdraw(id,version){const record=this.record(id);if(!record)throw new Error('Design not found.');const selected=record.versions.find(item=>item.version===version);if(!selected||selected.approval!=='approved')throw new Error('Only an approved version can be withdrawn.');selected.approval='withdrawn';selected.withdrawnAt=new Date().toISOString();atomic(path.join(this.records,id+'.json'),record);return record;}
  requirements(prompt,brief){return planReferences({prompt,brief,records:this.list()});}
  packageFor({jobId,prompt,brief={},required}){
    const records=this.list(),needs=required===undefined?this.requirements(prompt,brief):required;
    if(!Array.isArray(needs)||needs.length>24||needs.some(value=>!key(value)))throw new Error('Reference needs must be valid subject:facet tags.');
    const approved=records.flatMap(record=>{
      const version=record.versions.filter(item=>item.approval==='approved').at(-1);
      return version?[{record,version}]:[];
    });
    const available=[],unavailable=new Set();
    for(const entry of approved){
      const tags=entry.version.coverage||entry.record.coverage||[];
      let valid=true;
      for(const item of [entry.version.originalText,entry.version.originalManifest,...entry.version.media]){
        try{const file=path.join(this.nasRoot,item.object);if(fs.statSync(file).size!==item.bytes||hash(file)!==item.sha256)valid=false;}catch{valid=false;}
      }
      if(valid)available.push(entry);else for(const tag of tags)unavailable.add(tag);
    }
    const terms=new Set(String(prompt||'').toLowerCase().match(/[a-z0-9-]+/g)||[]);
    const selected=available.filter(({record,version})=>{
      const tags=version.coverage||record.coverage||[];
      const relations=version.relations||record.relations||[];
      return tags.some(tag=>needs.includes(tag)||terms.has(tag.split(':')[0]))||relations.some(term=>terms.has(String(term).toLowerCase()));
    });
    const covered=new Set(selected.flatMap(({record,version})=>version.coverage||record.coverage||[]));
    const missing=needs.filter(tag=>!covered.has(tag));
    const inaccessible=missing.filter(tag=>unavailable.has(tag));
    const conflicts=[];
    for(let i=0;i<selected.length;i++)for(let n=i+1;n<selected.length;n++){
      const a=selected[i],b=selected[n];
      if((a.version.conflictsWith||[]).includes(b.record.id)||(b.version.conflictsWith||[]).includes(a.record.id))conflicts.push([a.record.id,b.record.id]);
    }
    const result={jobId,required:needs,missing,inaccessible,conflicts,references:selected.map(({record,version})=>({id:record.id,title:record.title,version:version.version,coverage:version.coverage||record.coverage,relations:version.relations||record.relations,origin:version.origin,text:version.text,media:version.media.map(item=>({...item,localPath:path.join(this.nasRoot,item.object)}))}))};
    if((missing.length||conflicts.length)&&jobId){
      const requests=this.missing(),id=crypto.createHash('sha256').update(jobId+missing.join('|')).digest('hex').slice(0,20);
      requests[id]={id,jobId,status:'open',missing,inaccessible,conflicts,prompt:String(prompt||'').slice(0,500),action:conflicts.length?'Clarify or withdraw one conflicting approval, then recheck references.':inaccessible.length?'Restore the listed original NAS files, then recheck references.':'Supply originals or approve a relevant exploratory design, then recheck references.',createdAt:requests[id]?.createdAt||new Date().toISOString()};
      atomic(this.missingFile,requests);result.requestId=id;
    }
    return result;
  }
  resolve(jobId,prompt,brief={}){const pack=this.packageFor({jobId,prompt,brief});if(pack.missing.length||pack.conflicts.length)return pack;const requests=this.missing();let changed=false;for(const request of Object.values(requests))if(request.jobId===jobId&&request.status==='open'){request.status='resolved';request.resolvedAt=new Date().toISOString();changed=true;}if(changed)atomic(this.missingFile,requests);return pack;}
}
module.exports={CreativeLibrary};
