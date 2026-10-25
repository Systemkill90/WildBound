'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const source=fs.readFileSync(path.resolve(__dirname,'..','src','adapters.js'),'utf8');
const blender=fs.readFileSync(path.resolve(__dirname,'..','src','prepare-model.py'),'utf8');
const dashboard=fs.readFileSync(path.resolve(__dirname,'..','..','Dashboard','production-studio.js'),'utf8');

test('prompt-to-3D uses OBJ export and prepares it through Blender',()=>{
  assert.match(source,/--model-save-format','obj'/);
  assert.match(source,/path\.join\(generatedRoot,'0','mesh\.obj'\)/);
  assert.match(source,/HF_HOME:huggingfaceHome/);
  assert.match(blender,/endswith\(\('\.glb', '\.gltf'\)\)/);
  assert.match(blender,/bpy\.ops\.wm\.obj_import\(filepath=source\)/);
  assert.match(dashboard,/\['model','text-to-3d'\]\.includes\(job\.artifact\?\.kind\)\)loadModelPreview\(job\)/);
});
