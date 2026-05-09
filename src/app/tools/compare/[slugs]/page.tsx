'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { tools, getToolBySlug } from '@/data/tools';
import { categories, criteria } from '@/data/comparison';

export default function CompareViewPage() {
  const params = useParams();
  const slugsParam = params.slugs as string;
  const slugs = slugsParam.split('-');
  const selectedToolData = slugs.map(slug => getToolBySlug(slug)).filter(Boolean) as typeof tools;

  if (selectedToolData.length < 2) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">比較するツールが不足しています</h1>
        <p className="text-gray-600 mb-4">
          URLは `/tools/compare/tool1-tool2-tool3` の形式で指定してください。
        </p>
        <Link href="/tools/compare" className="text-blue-600 hover:underline">
          比較選択ページへ
        </Link>
      </div>
    );
  }

  const getAverageRating = (tool: typeof tools[0]) => {
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

  return (
    <div>
      {/* パンくずリスト */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/tools" className="hover:text-blue-600">サマリー</Link>
          </li>
          <li>›</li>
          <li>
            <Link href="/tools/compare" className="hover:text-blue-600">比較選択</Link>
          </li>
          <li>›</li>
          <li className="text-gray-900 font-medium">
            {selectedToolData.map(t => t.name).join(' vs ')}
          </li>
        </ol>
      </nav>

      {/* ページタイトル */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ツール比較
        </h1>
        <p className="text-gray-600">
          {selectedToolData.map(t => t.name).join(' vs ')}
        </p>
      </div>

      {/* 比較結果 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* 基本スペック比較 */}
        <div className="p-6 border-b border-gray-200">
          <h2
            className="text-xl font-bold text-gray-900 mb-4"
            style={{ color: categories[0].color }}
          >
            {categories[0].name}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">項目</th>
                  {selectedToolData.map(tool => (
                    <th key={tool.slug} className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      <Link href={`/tools/${tool.slug}`} className="hover:text-blue-600">
                        {tool.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-600">公式サイト</td>
                  {selectedToolData.map(tool => (
                    <td key={tool.slug} className="py-3 px-4">
                      <a href={tool.officialUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {tool.officialUrl}
                      </a>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-600">価格モデル</td>
                  {selectedToolData.map(tool => (
                    <td key={tool.slug} className="py-3 px-4 text-sm text-gray-900">
                      {tool.pricingModel === 'free' ? '無料' : tool.pricingModel === 'paid' ? '有料' : '無料/有料'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-600">料金詳細</td>
                  {selectedToolData.map(tool => (
                    <td key={tool.slug} className="py-3 px-4 text-sm text-gray-900">
                      {tool.pricingDetails}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-600">OSS</td>
                  {selectedToolData.map(tool => (
                    <td key={tool.slug} className="py-3 px-4 text-sm text-gray-900">
                      {tool.isOpenSource ? '✓' : '✗'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-600">対応IDE</td>
                  {selectedToolData.map(tool => (
                    <td key={tool.slug} className="py-3 px-4 text-sm text-gray-900">
                      <div className="flex flex-wrap gap-1">
                        {tool.supportedIDEs.slice(0, 3).map(ide => (
                          <span key={ide} className="px-2 py-0.5 text-xs bg-gray-100 rounded">
                            {ide}
                          </span>
                        ))}
                        {tool.supportedIDEs.length > 3 && (
                          <span className="text-xs text-gray-500">+{tool.supportedIDEs.length - 3}</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-gray-600">対応モデル</td>
                  {selectedToolData.map(tool => (
                    <td key={tool.slug} className="py-3 px-4 text-sm text-gray-900">
                      {tool.supportedModels.slice(0, 2).join(', ')}
                      {tool.supportedModels.length > 2 && '...'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 評価比較 */}
        {categories.slice(1).map(category => (
          <div key={category.id} className="p-6 border-b border-gray-200">
            <h2
              className="text-xl font-bold text-gray-900 mb-4"
              style={{ color: category.color }}
            >
              {category.name}
            </h2>
            <div className="space-y-4">
              {criteria
                .filter(c => c.categoryId === category.id)
                .map(criterion => (
                  <div key={criterion.id}>
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      {criterion.name}
                    </div>
                    <div className="space-y-2">
                      {selectedToolData.map(tool => {
                        const rating = tool.ratings[criterion.id as keyof typeof tool.ratings];
                        return (
                          <div key={tool.slug} className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600 w-24 truncate">
                              {tool.name}
                            </span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all"
                                style={{
                                  width: getRatingBarWidth(rating),
                                  backgroundColor: category.color,
                                }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${getRatingColor(rating)}`}>
                              {rating}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* 総合評価 */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">総合評価</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedToolData.map(tool => (
              <div key={tool.slug} className="p-4 bg-gray-50 rounded-lg">
                <div className="font-bold text-gray-900 mb-2">{tool.name}</div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {getAverageRating(tool)}
                </div>
                <div className="text-sm text-gray-600">
                  {tool.notes}
                </div>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="inline-block mt-3 text-sm text-blue-600 hover:underline"
                >
                  詳細を見る →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ナビゲーション */}
      <div className="flex justify-between mt-6">
        <Link href="/tools/compare" className="text-blue-600 hover:underline">
          ← 比較選択に戻る
        </Link>
        <Link href="/tools" className="text-blue-600 hover:underline">
          サマリーへ →
        </Link>
      </div>
    </div>
  );
}
