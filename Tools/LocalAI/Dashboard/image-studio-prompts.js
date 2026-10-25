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

function buildPrompt({ style, biome, intent, text }) {
  const prefix = String(style?.promptPrefix || '').trim();
  const subject = String(text || '').trim();
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

module.exports = { buildPrompt, buildNegative, TEXTURE_REQUIREMENTS, TEXTURE_NEGATIVE };
