import { getSvgPath } from 'figma-squircle';

// Generate squircle path with Figma's corner smoothing
// Using normalized 0-1 coordinates for responsive scaling
const path = getSvgPath({
  width: 1,
  height: 1,
  cornerRadius: 0.25, // 25% corner radius
  cornerSmoothing: 0.6, // Apple-like smoothing
});

console.log('Squircle SVG path:');
console.log(path);

// Also generate a more extreme smoothing for reference
const pathSmooth = getSvgPath({
  width: 1,
  height: 1,
  cornerRadius: 0.25,
  cornerSmoothing: 0.8,
});

console.log('\nExtra smooth squircle path:');
console.log(pathSmooth);
