'use strict';

const TEXTURE_REQUIREMENTS = [
  'a seamless, repeatable, tileable 2D material texture',
  'an orthographic close-up of the exact requested surface only',
  'the material fills the entire square image edge to edge',
  'flat, diffuse, even lighting with no cast shadow or lighting gradient',
  'matching opposite edges so the image tiles cleanly'
].join('; ');

const TEXTURE_NEGATIVE = [
  'whole tree', 'tree silhouette', 'forest', 'woodland scene', 'landscape', 'horizon', 'sky', 'ground plane',
  'environment', 'distant object', 'branch', 'leaves', 'roots', 'props', 'camera perspective', 'wide shot',
  'cast shadow', 'lighting gradient', 'vignette', 'border', 'frame', 'text', 'lettering', 'logo', 'watermark'
].join(', ');

const VFX_REQUIREMENTS = [
  'one isolated VFX sprite source image, a single centered effect burst only',
  'plain black background for later compositing, with a clean readable silhouette',
  'the effect fills the center without scenery, ground, landscape, camera perspective, or repeated copies',
  'not a forest scene, not a collage, not a tiled sheet, and not multiple separate leaves or effects'
].join('; ');

const CONCEPT_REQUIREMENTS = [
  'one standalone 2D concept illustration of the requested subject',
  'when the brief specifies an isolated or plain studio background, show no environment, scenery, landscape, or horizon'
].join('; ');

const SKYBOX_REQUIREMENTS = [
  'a full 360-degree equirectangular panorama in 2:1 latitude-longitude projection',
  'the left and right edges must join seamlessly, with one level continuous horizon and no frame or vignette'
].join('; ');

function isVfxSource(text) {
  return /\b(?:vfx\s+source\s+art(?:work)?|visual\s+effect\s+source)\b/i.test(String(text || ''));
}

function isStandaloneConcept(text) {
  return /\bconcept\s+(?:art|illustration)\b/i.test(String(text || '')) &&
    /\b(?:isolated|plain\s+(?:neutral\s+)?studio\s+background|no\s+environmental\s+context)\b/i.test(String(text || ''));
}

function isSkyboxSource(text) {
  return /\b(?:skybox|equirectangular\s+panorama|360[- ]degree\s+(?:environment\s+)?panorama)\b/i.test(String(text || ''));
}

function isGenericRequest(text) {
  const value=String(text||'');
  return /\bgeneric\b/i.test(value) && !/\b(?:greenveil|drowned\s+march|emberstep|gloamwood)\b/i.test(value);
}

function biomeOnly(biome) {
  return String(biome || '').split(/;\s*environment concept for a playable game level/i)[0].trim();
}

function buildPrompt({ style, biome, intent, text }) {
  const prefix = String(style?.promptPrefix || '').trim();
  const subject = String(text || '').trim();
  if (isVfxSource(subject)) {
    // The image service currently normalizes unknown intents to "environment".
    // Detect the typed VFX brief in its text and omit scene-level biome prompts.
    const deDuplicatedSubject = prefix && subject.startsWith(prefix) ? subject.slice(prefix.length).trim() : subject;
    return [prefix, VFX_REQUIREMENTS, deDuplicatedSubject].filter(Boolean).join('. ').slice(0, 5000);
  }
  if (isStandaloneConcept(subject)) {
    const deDuplicatedSubject = prefix && subject.startsWith(prefix) ? subject.slice(prefix.length).trim() : subject;
    return [prefix, CONCEPT_REQUIREMENTS, deDuplicatedSubject].filter(Boolean).join('. ').slice(0, 5000);
  }
  if (isSkyboxSource(subject)) {
    return [prefix, isGenericRequest(subject)?'':biomeOnly(biome), SKYBOX_REQUIREMENTS, subject].filter(Boolean).join('. ').slice(0, 5000);
  }
  if (intent === 'texture') {
    // Biome summaries describe whole environments. Adding one to a material
    // prompt biases the image model toward a scene instead of a surface swatch.
    return [prefix, TEXTURE_REQUIREMENTS, subject].filter(Boolean).join('. ').slice(0, 5000);
  }
  return [prefix, biome, String(intent || ''), subject].filter(Boolean).join('; ').slice(0, 5000);
}

function buildNegative(defaultNegative, customNegative, intent) {
  return [defaultNegative, intent === 'texture' ? TEXTURE_NEGATIVE : '', String(customNegative || '').trim()]
    .filter(Boolean).join(', ').slice(0, 3000);
}

module.exports = { buildPrompt, buildNegative, TEXTURE_REQUIREMENTS, TEXTURE_NEGATIVE, VFX_REQUIREMENTS, CONCEPT_REQUIREMENTS, SKYBOX_REQUIREMENTS };
