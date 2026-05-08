'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { tools, getToolBySlug } from '@/data/tools';
import { categories, criteria } from '@/data/comparison';

export default function ToolDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">ツールが見つかりません</h1>
        <Link href="/tools" className="text-blue-600 hover:underline">
          サマリーに戻る
        </Link>
      </div>
    );
  }

  const getAverageRating = () => {
    const values = Object.values(tool.ratings);
    return (values.reduce((s, v) => s + v, 0) / values.length).toFixed(1);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-blue-600';
    if (rating >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingBarWidth = (rating: number) => {
    return `${(rating / 5) * 100}%`;
  };

  const getPricingBadge = () => {
    switch (tool.pricingModel) {
      case 'free': return <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded">無料</span>;
      case 'paid': return <span className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 rounded">有料</span>;
      case 'both': return <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded">無料/有料</span>;
      default: return null;
    }
  };

  return (
    <div>
      {/* パンくずリスト */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/tools" className="hover:text-blue-600">サマリー</Link>
          </li>
          <li>›</li>
          <li className="text-gray-900 font-medium">{tool.name}</li>
        </ol>
      </nav>

      {/* ツールヘッダー */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
              {tool.isOpenSource && (
                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">OSS</span>
              )}
              {getPricingBadge()}
            </div>
            <p className="text-gray-600 mb-4">{tool.description}</p>
            <div className="flex flex-wrap gap-2">
              {tool.keyFeatures.map(feature => (
                <span key={feature} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded">
                  {feature}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="text-4xl font-bold text-blue-600">{getAverageRating()}</div>
            <div className="text-sm text-gray-500">総合評価</div>
            <a
              href={tool.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              公式サイトへ
            </a>
          </div>
        </div>
      </div>

      {/* 基本スペック */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2
          className="text-xl font-bold text-gray-900 mb-4"
          style={{ color: categories[0].color }}
        >
          {categories[0].name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">開発元:</span>
              <span className="ml-2 text-sm text-gray-900">{tool.developer}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">リリース年:</span>
              <span className="ml-2 text-sm text-gray-900">{tool.releaseYear}年</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">主な利用シーン:</span>
              <span className="ml-2 text-sm text-gray-900">{tool.primaryUseCase}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">料金:</span>
              <span className="ml-2 text-sm text-gray-900">{tool.pricingDetails}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">対応IDE:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {tool.supportedIDEs.map(ide => (
                  <span key={ide} className="px-2 py-0.5 text-xs bg-gray-100 rounded">
                    {ide}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">対応モデル:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {tool.supportedModels.map(model => (
                  <span key={model} className="px-2 py-0.5 text-xs bg-gray-100 rounded">
                    {model}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 評価詳細 */}
      {categories.slice(1).map(category => (
        <div key={category.id} className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2
            className="text-xl font-bold text-gray-900 mb-4"
            style={{ color: category.color }}
          >
            {category.name}
          </h2>
          <div className="space-y-4">
            {criteria
              .filter(c => c.categoryId === category.id)
              .map(criterion => {
                const rating = tool.ratings[criterion.id as keyof typeof tool.ratings];
                return (
                  <div key={criterion.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{criterion.name}</span>
                      <span className={`text-sm font-bold ${getRatingColor(rating)}`}>{rating}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: getRatingBarWidth(rating),
                          backgroundColor: category.color,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{criterion.description}</p>
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      {/* 詳細リンク */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">詳細リンク</h2>
        <div className="space-y-2">
          {tool.detailLinks.map(link => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-600 hover:underline"
            >
              <span>{link.label}</span>
              <span className="text-gray-400">→</span>
            </a>
          ))}
        </div>
      </div>

      {/* メモ */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">メモ</h2>
        <p className="text-gray-600">{tool.notes}</p>
      </div>

      {/* ナビゲーション */}
      <div className="flex justify-between">
        <Link href="/tools" className="text-blue-600 hover:underline">
          ← サマリーに戻る
        </Link>
        <Link href="/tools/compare" className="text-blue-600 hover:underline">
          比較選択へ →
        </Link>
      </div>
    </div>
  );
}
