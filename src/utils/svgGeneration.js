/**
 * Applies Sobel edge detection to find strong edges
 * @param {ImageData} imageData - Grayscale image data
 * @returns {ImageData} Edge detection result
 */
function detectEdges(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const colorData = imageData.colorData;
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
      let colorGx = [0, 0, 0];
      let colorGy = [0, 0, 0];
      
      // Apply Sobel operators for both grayscale and color channels
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const value = data[idx];
          gx += value * sobelX[ky + 1][kx + 1];
          gy += value * sobelY[ky + 1][kx + 1];
          
          // Calculate color gradients
          for (let c = 0; c < 3; c++) {
            colorGx[c] += colorData[idx + c] * sobelX[ky + 1][kx + 1];
            colorGy[c] += colorData[idx + c] * sobelY[ky + 1][kx + 1];
          }
        }
      }
      
      // Calculate combined gradient magnitude
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      const colorMagnitude = Math.sqrt(
        colorGx.reduce((sum, g) => sum + g * g, 0) +
        colorGy.reduce((sum, g) => sum + g * g, 0)
      ) / 3;
      
      // Combine grayscale and color edge detection
      const idx = (y * width + x) * 4;
      const normalized = Math.min(255, (magnitude + colorMagnitude) / 2);
      
      result[idx] = result[idx + 1] = result[idx + 2] = normalized;
      result[idx + 3] = 255;
    }
  }
  
  const edgeData = new ImageData(result, width, height);
  edgeData.colorData = colorData;
  return edgeData;
}

/**
 * Gets the dominant color for a path segment
 * @param {Array} points - Array of points in the path
 * @param {Uint8ClampedArray} colorData - Original color data
 * @param {number} width - Image width
 * @returns {string} Color in hex format
 */
function getDominantColor(points, colorData, width) {
  const colors = {};
  
  for (const [x, y] of points) {
    const idx = (y * width + x) * 4;
    const r = colorData[idx];
    const g = colorData[idx + 1];
    const b = colorData[idx + 2];
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    colors[hex] = (colors[hex] || 0) + 1;
  }
  
  return Object.entries(colors).sort((a, b) => b[1] - a[1])[0][0];
}

/**
 * Creates SVG paths from edge detection result
 * @param {ImageData} edgeData - Edge detection result
 * @param {number} threshold - Edge detection threshold
 * @returns {Array} SVG path data with colors
 */
function generateSvgPath(edgeData, threshold) {
  const width = edgeData.width;
  const height = edgeData.height;
  const data = edgeData.data;
  const colorData = edgeData.colorData;
  const paths = [];
  const visited = new Set();
  
  // Find edge pixels and create paths
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (data[idx] > threshold && !visited.has(`${x},${y}`)) {
        const result = traceEdge(x, y, data, width, height, visited, threshold);
        if (result && result.path && result.path.length > 10) { 
          const color = getDominantColor(result.points, colorData, width);
          paths.push({ path: result.path, color });
        }
      }
    }
  }
  
  return paths;
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
 * @returns {Object} SVG path data with points
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
  
  return points.length >= 3 ? { path, points } : null;
}

/**
 * Creates an SVG from image data with improved edge detection
 * @param {ImageData} imageData - Grayscale image data
 * @param {Object} options - Conversion options
 * @returns {string} Generated SVG string
 */
export function createSvgFromImageData(imageData, options) {
  try {
    const { threshold = 128 } = options;
    
    // Apply edge detection
    const edgeData = detectEdges(imageData);
    
    // Generate SVG paths with adjusted threshold
    const paths = generateSvgPath(edgeData, threshold * 0.3);
    
    if (!paths || paths.length === 0) {
      throw new Error('No significant edges found in the image. Try adjusting the sensitivity.');
    }
    
    // Create SVG with viewBox for better scaling
    const pathElements = paths.map(({ path, color }) => 
      `<path d="${path}" fill="none" stroke="${color}" stroke-width="1" />`
    ).join('\n      ');
    
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${imageData.width} ${imageData.height}">
      ${pathElements}
    </svg>`;
  } catch (error) {
    console.error('SVG generation error:', error);
    throw new Error(`Failed to generate SVG: ${error.message}`);
  }
}