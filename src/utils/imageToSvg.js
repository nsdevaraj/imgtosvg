import { convertToGrayscale } from './imageProcessing';
import { createSvgFromImageData } from './svgGeneration';

/**
 * Converts an image to SVG format
 * @param {Blob|File} input - Image blob or file
 * @param {Object} options - Conversion options
 * @param {number} [options.threshold=128] - Threshold for black and white conversion (0-255)
 * @param {string} [options.color='#000000'] - Color of the SVG output
 * @returns {Promise<string>} The SVG content as a string
 */
export async function imageToSvg(input, options = {}) {
  try {
    // Convert to grayscale first
    const imageData = await convertToGrayscale(input);
    
    // Generate SVG from the processed image
    const svg = createSvgFromImageData(imageData, options);
    
    return svg;
  } catch (error) {
    throw new Error(`Failed to convert image to SVG: ${error.message}`);
  }
}