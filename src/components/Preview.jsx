import React, { useState } from 'react';
import { ArrowDownTrayIcon, ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

export default function Preview({ svg, onDownload }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`"data:image/svg+xml;utf8,${svg}"`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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
        className="w-full bg-gray-50 rounded-lg p-4 mb-4"
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">SVG Code</h3>
          <button
            onClick={handleCopy}
            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
              copied 
                ? 'text-green-700 bg-green-50 hover:bg-green-100' 
                : 'text-gray-700 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {copied ? (
              <>
                <ClipboardDocumentCheckIcon className="h-5 w-5 mr-1.5" />
                Copied!
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="h-5 w-5 mr-1.5" />
                Copy
              </>
            )}
          </button>
        </div>
        <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
          <code className="text-sm text-gray-700">
            {svg}
          </code>
        </pre>
      </div>
    </div>
  );
}