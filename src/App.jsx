import React from 'react';
import ImageUploader from './components/ImageUploader';
import ConversionOptions from './components/ConversionOptions';
import Preview from './components/Preview';
import { useImageConverter } from './hooks/useImageConverter';

function App() {
  const {
    convertedSvg,
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

        {convertedSvg && (
          <Preview 
            svg={convertedSvg}
            onDownload={handleDownload}
          />
        )}
      </div>
    </div>
  );
}

export default App;