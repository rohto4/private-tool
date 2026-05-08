'use client';

import { useState } from 'react';
import Link from 'next/link';
import { tools } from '@/data/tools';
import { categories } from '@/data/comparison';

export default function ToolsPage() {
  const [filter, setFilter] = useState<'all' | 'openSource' | 'free' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'year'>('name');

  const filteredTools = tools.filter(tool => {
    if (filter === 'openSource') return tool.isOpenSource;
    if (filter === 'free') return tool.pricingModel === 'free' || tool.pricingModel === 'both';
    if (filter === 'paid') return tool.pricingModel === 'paid' || tool.pricingModel === 'both';
    return true;
  });

  const sortedTools = [...filteredTools].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'rating') {
      const avgA = Object.values(a.ratings).reduce((s, v) => s + v, 0) / Object.values(a.ratings).length;
      const avgB = Object.values(b.ratings).reduce((s, v) => s + v, 0) / Object.values(b.ratings).length;
      return avgB - avgA;
    }
    return b.releaseYear - a.releaseYear;
  });

  const getAverageRating = (tool: typeof tools[0]) => {
    const values = Object.values(tool.ratings);
    return (values.reduce((s, v) => s + v, 0) / values.length).toFixed(1);
  };

  const getPricingBadge = (model: string) => {
    switch (model) {
      case 'free': return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">無料</span>;
      case 'paid': return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">有料</span>;
      case 'both': return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">無料/有料</span>;
      default: return null;
    }
  };

  const getOpenSourceBadge = (isOpenSource: boolean) => {
    if (isOpenSource) {
      return <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">OSS</span>;
    }
    return null;
  };

  return (
    <div>
      {/* ページタイトル */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          コーディングLLMツール比較
        </h1>
        <p className="text-gray-600">
          主要なコーディングLLMツールの特徴、機能、価格を比較します。
        </p>
      </div>

      {/* フィルター・ソート */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">フィルター:</span>
          {(['all', 'openSource', 'free', 'paid'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'すべて' : f === 'openSource' ? 'OSS' : f === 'free' ? '無料あり' : '有料'}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">ソート:</span>
          {(['name', 'rating', 'year'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                sortBy === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {s === 'name' ? '名前順' : s === 'rating' ? '評価順' : '新着順'}
            </button>
          ))}
        </div>
      </div>

      {/* ツール一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTools.map(tool => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="block bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
          >
            <div className="p-6">
              {/* ヘッダー */}
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-bold text-gray-900">{tool.name}</h2>
                <div className="flex space-x-2">
                  {getOpenSourceBadge(tool.isOpenSource)}
                  {getPricingBadge(tool.pricingModel)}
                </div>
              </div>

              {/* 説明 */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {tool.description}
              </p>

              {/* 主な特徴 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {tool.keyFeatures.slice(0, 3).map(feature => (
                  <span
                    key={feature}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* 評価 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map(star => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(parseFloat(getAverageRating(tool)))
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {getAverageRating(tool)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {tool.releaseYear}年
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* カテゴリ凡例 */}
      <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">比較カテゴリ</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map(category => (
            <div key={category.id} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm text-gray-700">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
