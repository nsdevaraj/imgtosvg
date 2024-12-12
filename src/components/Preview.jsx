import React from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function Preview({ svg, onDownload }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Preview</h2>
        <button
          onClick={onDownload}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
          Download SVG
        </button>
      </div>
      
      <div 
        className="w-full bg-gray-50 rounded-lg p-4"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}