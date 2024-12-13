import React from 'react';

export default function ConversionOptions({ options, onChange }) {
  return (
    <div className="mt-6 space-y-4">
      {/* <div>
        <label className="block text-sm font-medium text-gray-700">
          Color Mode
        </label>
        <select
          value={options.colorMode || 'original'}
          onChange={(e) => onChange({ colorMode: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="original">Original Colors</option>
          <option value="mono">Monochrome</option>
        </select>
      </div>

      {options.colorMode === 'mono' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mono Color
          </label>
          <input
            type="color"
            value={options.monoColor ? `#${(options.monoColor.r << 16 | options.monoColor.g << 8 | options.monoColor.b).toString(16).padStart(6, '0')}` : '#0000ff'}
            onChange={(e) => {
              const hex = e.target.value.substring(1);
              const r = parseInt(hex.substring(0, 2), 16);
              const g = parseInt(hex.substring(2, 4), 16);
              const b = parseInt(hex.substring(4, 6), 16);
              onChange({ monoColor: { r, g, b } });
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      )} */}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Edge Detection Sensitivity
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
    </div>
  );
}