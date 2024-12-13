/**
 * Validates and preprocesses the input image file
 * @param {File} file - Image file to validate
 * @throws {Error} If file is invalid
 */
function validateImageFile(file) {
  if (!file) {
    throw new Error('No image file provided');
  }
  
  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Please upload an image file');
  }
  
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('Image file is too large. Maximum size is 10MB');
  }
}

/**
 * Applies image preprocessing for better edge detection
 * @param {ImageData} imageData - Raw image data
 * @returns {ImageData} Processed image data
 */
function preprocessImage(ctx, imageData) {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  // Apply Gaussian blur to reduce noise
  const kernel = [
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1]
  ];
  const kernelSum = 16;
  
  const tempData = new Uint8ClampedArray(data);
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let r = 0, g = 0, b = 0;
      
      // Apply convolution
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const weight = kernel[ky + 1][kx + 1];
          r += data[idx] * weight;
          g += data[idx + 1] * weight;
          b += data[idx + 2] * weight;
        }
      }
      
      const idx = (y * width + x) * 4;
      tempData[idx] = r / kernelSum;
      tempData[idx + 1] = g / kernelSum;
      tempData[idx + 2] = b / kernelSum;
      tempData[idx + 3] = data[idx + 3];
    }
  }
  
  return new ImageData(tempData, width, height);
}

/**
 * Converts an image to grayscale using Canvas API with improved preprocessing
 * @param {Blob|File} input - Image blob or file
 * @param {Object} options - Options for image processing
 * @param {string} options.colorMode - Color mode (mono or original)
 * @param {Object} options.monoColor - Monochrome color (r, g, b)
 * @returns {Promise<ImageData>} Processed image data
 */
export async function convertToGrayscale(input, options) {
  try {
    validateImageFile(input);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    const imageUrl = URL.createObjectURL(input);
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        try {
          // Scale image if needed
          const maxDimension = 2000;
          let width = img.width;
          let height = img.height;
          
          if (width > maxDimension || height > maxDimension) {
            const ratio = Math.min(maxDimension / width, maxDimension / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and get image data
          ctx.drawImage(img, 0, 0, width, height);
          let imageData = ctx.getImageData(0, 0, width, height);
          
          // Preprocess the image
          imageData = preprocessImage(ctx, imageData);
          
          // Process image based on color mode
          const data = imageData.data;
          const colorData = new Uint8ClampedArray(data.length);
          
          for (let i = 0; i < data.length; i += 4) {
            if (options?.colorMode === 'mono') {
              // Calculate brightness from original pixel
              const brightness = Math.round(
                0.299 * data[i] + 
                0.587 * data[i + 1] + 
                0.114 * data[i + 2]
              );
              
              const monoColor = options.monoColor || { r: 0, g: 0, b: 255 }; // Default to blue
              
              // Apply brightness to the mono color components
              const intensity = brightness / 255;
              data[i] = Math.round(monoColor.r * intensity);
              data[i + 1] = Math.round(monoColor.g * intensity);
              data[i + 2] = Math.round(monoColor.b * intensity);
            } else {
              // Keep original color values
              data[i] = data[i];
              data[i + 1] = data[i + 1];
              data[i + 2] = data[i + 2];
            }
            
            // Store color data for reference
            colorData[i] = data[i];
            colorData[i + 1] = data[i + 1];
            colorData[i + 2] = data[i + 2];
            colorData[i + 3] = data[i + 3];
          }
          
          imageData.colorData = colorData; // Attach color data to imageData
          
          URL.revokeObjectURL(imageUrl);
          resolve(imageData);
        } catch (err) {
          URL.revokeObjectURL(imageUrl);
          reject(new Error('Failed to process image: ' + err.message));
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        reject(new Error('Failed to load image. Please ensure it\'s a valid image file'));
      };
      
      img.src = imageUrl;
    });
  } catch (error) {
    throw new Error(`Failed to process image: ${error.message}`);
  }
}