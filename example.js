const { imageToSvg } = require('./utils/imageToSvg');
const fs = require('fs').promises;

async function example() {
  try {
    // Example usage with a file
    const svg = await imageToSvg('input.jpg', {
      threshold: 128,
      color: '#000000'
    });
    
    await fs.writeFile('output.svg', svg);
    console.log('SVG conversion completed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

example();