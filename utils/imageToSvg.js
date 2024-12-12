const potrace = require('potrace');
const sharp = require('sharp');

/**
 * Converts an image to SVG format
 * @param {Buffer|string} input - Image buffer or path to image file
 * @param {Object} options - Conversion options
 * @param {number} [options.threshold=128] - Threshold for black and white conversion (0-255)
 * @param {number} [options.color='black'] - Color of the SVG output
 * @returns {Promise<string>} The SVG content as a string
 */
async function imageToSvg(input, options = {}) {
  try {
    // Convert input image to grayscale PNG
    const pngBuffer = await sharp(input)
      .grayscale()
      .toBuffer();

    return new Promise((resolve, reject) => {
      const trace = new potrace.Potrace(options);
      
      trace.loadImage(pngBuffer, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        const svg = trace.getSVG();
        resolve(svg);
      });
    });
  } catch (error) {
    throw new Error(`Failed to convert image to SVG: ${error.message}`);
  }
}