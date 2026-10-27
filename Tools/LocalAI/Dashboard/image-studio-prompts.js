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

function isVfxSource(text) {
  return /\b(?:vfx\s+source\s+art(?:work)?|visual\s+effect\s+source)\b/i.test(String(text || ''));
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

module.exports = { buildPrompt, buildNegative, TEXTURE_REQUIREMENTS, TEXTURE_NEGATIVE, VFX_REQUIREMENTS };
