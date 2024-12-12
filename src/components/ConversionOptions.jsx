import React from 'react';

export default function ConversionOptions({ options, onChange }) {
  return (
    <div className="mt-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Threshold
        </label>
        <input
          type="range"
          min="0"
          max="255"
          value={options.threshold}
          onChange={(e) => onChange({ threshold: Number(e.target.value) })}
          className="mt-1 w-full"
        />
        <div className="text-sm text-gray-500 mt-1">
          Value: {options.threshold}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Color
        </label>
        <input
          type="color"
          value={options.color}
          onChange={(e) => onChange({ color: e.target.value })}
          className="mt-1"
        />
      </div>
    </div>
  );
}