import { getSvgPath } from 'figma-squircle';

/**
 * Generates an SVG path for a squircle shape using Figma's corner smoothing algorithm
 * @param width - Width of the squircle
 * @param height - Height of the squircle
 * @param cornerRadius - Corner radius in pixels (default: 40)
 * @param cornerSmoothing - Smoothing value from 0 to 1 (default: 0.6 for Apple-like look)
 * @returns SVG path string
 */
export function getSquirclePath(
  width: number,
  height: number,
  cornerRadius: number = 40,
  cornerSmoothing: number = 0.6
): string {
  return getSvgPath({
    width,
    height,
    cornerRadius,
    cornerSmoothing,
  });
}

/**
 * Generates a data URI for an inline SVG clip-path
 * This creates a responsive squircle that works in all browsers
 * @param cornerSmoothing - Smoothing value from 0 to 1 (default: 0.6)
 * @returns Data URI string for use in CSS clip-path
 */
export function getSquircleClipPath(cornerSmoothing: number = 0.6): string {
  // Using normalized coordinates (0-1 range) for responsive scaling
  const path = getSvgPath({
    width: 100,
    height: 100,
    cornerRadius: 25, // 25% of 100 = similar to our 40px on larger elements
    cornerSmoothing,
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><clipPath id="squircle" clipPathUnits="objectBoundingBox" transform="scale(0.01 0.01)"><path d="${path}"/></clipPath></svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
