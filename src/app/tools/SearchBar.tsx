'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { tools } from '@/data/tools';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof tools>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = tools.filter(tool =>
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.keyFeatures.some(f => f.toLowerCase().includes(lowerQuery)) ||
      tool.developer.toLowerCase().includes(lowerQuery)
    );
    setResults(filtered);
  }, [query]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="ツールを検索..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map(tool => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{tool.name}</div>
              <div className="text-sm text-gray-600 mt-1 line-clamp-1">{tool.description}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {tool.keyFeatures.slice(0, 3).map(feature => (
                  <span key={feature} className="px-2 py-0.5 text-xs bg-gray-100 rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}

      {isOpen && query.trim() !== '' && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-center text-gray-500">
          該当するツールが見つかりません
        </div>
      )}
    </div>
  );
}
