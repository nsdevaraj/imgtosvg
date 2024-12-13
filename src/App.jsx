import React from 'react';
import ImageUploader from './components/ImageUploader';
import ConversionOptions from './components/ConversionOptions';
import Preview from './components/Preview';
import { useImageConverter } from './hooks/useImageConverter';

function App() {
  const {
    convertedSvgs,
    isConverting,
    error,
    options,
    handleImageUpload,
    handleOptionsChange,
    handleDownload
  } = useImageConverter();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Image to SVG Converter
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <ImageUploader onUpload={handleImageUpload} isConverting={isConverting} />
          
          <ConversionOptions 
            options={options}
            onChange={handleOptionsChange}
          />
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>

        {convertedSvgs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {convertedSvgs.map((svg, index) => (
              <Preview 
                key={index}
                svg={svg}
                onDownload={() => handleDownload(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;