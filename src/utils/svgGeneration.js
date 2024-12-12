/**
 * Applies Sobel edge detection to find strong edges
 * @param {ImageData} imageData - Grayscale image data
 * @returns {ImageData} Edge detection result
 */
function detectEdges(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const result = new Uint8ClampedArray(data.length);
  
  // Sobel operators
  const sobelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ];
  
  const sobelY = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1]
  ];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0;
      let gy = 0;
      
      // Apply Sobel operators
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const value = data[idx];
          gx += value * sobelX[ky + 1][kx + 1];
          gy += value * sobelY[ky + 1][kx + 1];
        }
      }
      
      // Calculate gradient magnitude
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      const idx = (y * width + x) * 4;
      const normalized = Math.min(255, magnitude);
      
      result[idx] = result[idx + 1] = result[idx + 2] = normalized;
      result[idx + 3] = 255;
    }
  }
  
  return new ImageData(result, width, height);
}

/**
 * Creates SVG paths from edge detection result
 * @param {ImageData} edgeData - Edge detection result
 * @param {number} threshold - Edge detection threshold
 * @returns {string} SVG path data
 */
function generateSvgPath(edgeData, threshold) {
  const width = edgeData.width;
  const height = edgeData.height;
  const data = edgeData.data;
  const paths = [];
  const visited = new Set();
  
  // Find edge pixels and create paths
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (data[idx] > threshold && !visited.has(`${x},${y}`)) {
        const path = traceEdge(x, y, data, width, height, visited, threshold);
        if (path && path.length > 10) { // Filter out tiny paths
          paths.push(path);
        }
      }
    }
  }
  
  return paths.join(' ');
}

/**
 * Traces a single edge path
 * @param {number} startX - Starting X coordinate
 * @param {number} startY - Starting Y coordinate
 * @param {Uint8ClampedArray} data - Image data
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {Set} visited - Set of visited pixels
 * @param {number} threshold - Edge detection threshold
 * @returns {string} SVG path data
 */
function traceEdge(startX, startY, data, width, height, visited, threshold) {
  let path = `M ${startX} ${startY}`;
  let x = startX;
  let y = startY;
  let points = [[x, y]];
  
  const directions = [
    [1, 0], [1, 1], [0, 1], [-1, 1],
    [-1, 0], [-1, -1], [0, -1], [1, -1]
  ];
  
  while (true) {
    visited.add(`${x},${y}`);
    let found = false;
    
    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      
      if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
        const idx = (newY * width + newX) * 4;
        const key = `${newX},${newY}`;
        
        if (data[idx] > threshold && !visited.has(key)) {
          path += ` L ${newX} ${newY}`;
          points.push([newX, newY]);
          x = newX;
          y = newY;
          found = true;
          break;
        }
      }
    }
    
    if (!found || points.length > 1000) break;
  }
  
  return points.length >= 3 ? path : null;
}

/**
 * Creates an SVG from image data with improved edge detection
 * @param {ImageData} imageData - Grayscale image data
 * @param {Object} options - Conversion options
 * @returns {string} Generated SVG string
 */
export function createSvgFromImageData(imageData, options) {
  try {
    const { threshold = 128, color = '#000000' } = options;
    
    // Apply edge detection
    const edgeData = detectEdges(imageData);
    
    // Generate SVG paths
    const path = generateSvgPath(edgeData, threshold * 0.3); // Adjust threshold for edge detection
    
    if (!path) {
      throw new Error('No significant edges found in the image');
    }
    
    // Create SVG with viewBox for better scaling
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${imageData.width} ${imageData.height}">
      <path d="${path}" fill="none" stroke="${color}" stroke-width="1" />
    </svg>`;
  } catch (error) {
    throw new Error(`Failed to generate SVG: ${error.message}`);
  }
}