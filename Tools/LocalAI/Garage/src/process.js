'use strict';
const {spawn}=require('node:child_process');
function run(exe,args,{env={},signal,timeout=180000,cwd}={}){return new Promise((resolve,reject)=>{
  if(signal?.aborted)return reject(signal.reason);
  const child=spawn(exe,args,{windowsHide:true,cwd,env:{...process.env,...env},stdio:['ignore','pipe','pipe']});let out='',err='',ended=false;
  child.stdout.on('data',b=>out=(out+b).slice(-250000));child.stderr.on('data',b=>err=(err+b).slice(-12000));
  const stop=()=>{if(child.pid){const killer=spawn('taskkill.exe',['/PID',String(child.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});killer.on('error',()=>child.kill());}};
  const timer=setTimeout(()=>{ended=true;stop();},timeout);const abort=()=>{ended=true;stop();};signal?.addEventListener('abort',abort,{once:true});
  const cleanup=()=>{clearTimeout(timer);signal?.removeEventListener('abort',abort);};
  child.once('error',e=>{cleanup();reject(e);});child.once('close',code=>{cleanup();if(ended)return reject(signal?.reason||new Error('Worker deadline exceeded.'));if(code!==0)return reject(new Error((err||out||'Worker exited '+code).slice(-2500)));resolve(out);});
});}
module.exports={run};
