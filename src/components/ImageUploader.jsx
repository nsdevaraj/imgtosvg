import React, { useCallback, useState } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function ImageUploader({ onUpload, isConverting }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      onUpload(files);
    }
  }, [onUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <ArrowUpTrayIcon className={`h-12 w-12 mx-auto mb-4 transition-colors ${
        isDragging ? 'text-blue-500' : 'text-gray-400'
      }`} />
      <label className="block">
        <span className="sr-only">Choose images</span>
        <input
          type="file"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) onUpload(files);
          }}
          disabled={isConverting}
        />
      </label>
      <p className="mt-2 text-sm text-gray-500">
        {isConverting 
          ? 'Converting...' 
          : 'Drop your images here or click to upload'}
      </p>
      <p className="mt-1 text-xs text-gray-400">
        Supported formats: PNG, JPG, GIF, WebP (Max 10MB)
      </p>
    </div>
  );
}