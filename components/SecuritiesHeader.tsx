'use client';

import Link from 'next/link';

export default function SecuritiesHeader() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      {/* トップバー */}
      <div className="bg-blue-900 text-white text-xs">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex gap-4">
            <span>お問い合わせ</span>
            <span>|</span>
            <span>よくあるご質問</span>
            <span>|</span>
            <span>サイトマップ</span>
          </div>
          <div>
            <span className="bg-green-600 px-2 py-1 rounded text-xs font-bold">NEW!</span>
            <span className="ml-2">パスキーログイン開始</span>
          </div>
        </div>
      </div>

      {/* メインヘッダー */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* ロゴ */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-blue-900">
              🏦 NextGen証券
            </Link>

            {/* ナビゲーション */}
            <nav className="hidden md:flex gap-6 text-sm">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                口座開設
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                商品・サービス
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                マーケット情報
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                お取引
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                サポート
              </a>
            </nav>
          </div>

          {/* 右側メニュー */}
          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="hidden md:block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-bold text-sm transition-colors"
            >
              口座開設（無料）
            </Link>
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold text-sm transition-colors"
            >
              ログイン
            </Link>
          </div>
        </div>
      </div>

      {/* サブナビゲーション */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex gap-8 text-xs py-2 overflow-x-auto">
            <a href="#" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">国内株式</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">外国株式</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">投資信託</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">債券</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">FX</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">先物・オプション</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">CFD</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">NISA</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">iDeCo</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
