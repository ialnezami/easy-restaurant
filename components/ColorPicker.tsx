'use client';

import { useState } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  defaultColor?: string;
}

const PRESET_COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Rose', value: '#F43F5E' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Cyan', value: '#06B6D4' },
];

export default function ColorPicker({
  label,
  value,
  onChange,
  defaultColor = '#3B82F6',
}: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const displayColor = value || defaultColor;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-3">
        {/* Color Preview */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm hover:border-gray-400 transition-colors"
            style={{ backgroundColor: displayColor }}
            title={`Current color: ${displayColor}`}
          />
          {showPicker && (
            <div className="absolute z-10 mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
              {/* Preset Colors */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Preset Colors
                </p>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => {
                        onChange(color.value);
                        setShowPicker(false);
                      }}
                      className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Custom Color Input */}
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Custom Color
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={displayColor}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={displayColor}
                    onChange={(e) => {
                      const color = e.target.value;
                      if (/^#[0-9A-F]{6}$/i.test(color)) {
                        onChange(color);
                      }
                    }}
                    placeholder="#000000"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Reset Button */}
              <button
                type="button"
                onClick={() => {
                  onChange(defaultColor);
                  setShowPicker(false);
                }}
                className="mt-3 w-full px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Reset to Default
              </button>
            </div>
          )}
        </div>

        {/* Color Display */}
        <div className="flex-1">
          <input
            type="text"
            value={displayColor}
            onChange={(e) => {
              const color = e.target.value;
              if (/^#[0-9A-F]{6}$/i.test(color) || color === '') {
                onChange(color || defaultColor);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="#000000"
          />
          <p className="mt-1 text-xs text-gray-500">
            Click the color box to choose from presets or enter a hex code
          </p>
        </div>
      </div>

      {/* Click outside to close */}
      {showPicker && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

