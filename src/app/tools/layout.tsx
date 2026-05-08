import Link from 'next/link';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/tools" className="text-xl font-bold text-gray-900">
                LLM Tools Compare
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link
                  href="/tools"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  サマリー
                </Link>
                <Link
                  href="/tools/compare"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  比較選択
                </Link>
              </nav>
            </div>
            <div className="text-sm text-gray-500">
              コーディングLLMツール比較サイト
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>コーディングLLMツール比較サイト</p>
            <p className="mt-1">最終更新: 2026-05-09</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
