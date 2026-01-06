'use client';

import { useState } from 'react';

interface MenuUrlCopyProps {
  url: string;
}

export default function MenuUrlCopy({ url }: MenuUrlCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!url || url.includes('undefined')) {
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!url || url.includes('undefined')) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Menu URL
        </label>
        <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm">
          Generating menu URL...
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Menu URL
      </label>
      <div className="flex">
        <input
          type="text"
          readOnly
          value={url}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-white text-gray-900 text-sm"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 text-sm font-medium"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}



