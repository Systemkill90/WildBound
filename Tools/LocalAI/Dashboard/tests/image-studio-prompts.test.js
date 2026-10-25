'use strict';

const test=require('node:test');
const assert=require('node:assert/strict');
const {buildPrompt,buildNegative}=require('../image-studio-prompts');

test('texture prompt excludes landscape biome context and asks for a repeatable material swatch',()=>{
  const prompt=buildPrompt({style:{promptPrefix:'grounded realistic material'},biome:'woodland, sky, meadow',intent:'texture',text:'dark willow bark with subtle vine fibers'});
  assert.match(prompt,/seamless, repeatable, tileable 2D material texture/);
  assert.match(prompt,/dark willow bark/);
  assert.doesNotMatch(prompt,/woodland, sky, meadow/);
  assert.match(buildNegative('blurry','', 'texture'),/whole tree, tree silhouette, forest/);
});

test('non-texture prompts retain their biome context and ordinary negative prompt',()=>{
  assert.match(buildPrompt({style:{promptPrefix:'realistic game art'},biome:'rolling meadow',intent:'environment',text:'a creek'}),/rolling meadow/);
  assert.equal(buildNegative('blurry','bad hands','environment'),'blurry, bad hands');
});
