'use client';

export default function ComparisonPanel() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
        従来方式との比較
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* パスキー方式 */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-500">
          <h3 className="text-2xl font-bold mb-4 text-blue-900 flex items-center">
            <span className="mr-2">🔐</span>
            パスキー
          </h3>
          <div className="space-y-4">
            <div className="bg-white rounded p-4">
              <div className="text-sm text-gray-600">ステップ数</div>
              <div className="text-3xl font-bold text-blue-600">2</div>
            </div>
            <div className="bg-white rounded p-4">
              <div className="text-sm text-gray-600">クリック数</div>
              <div className="text-3xl font-bold text-blue-600">2</div>
            </div>
            <div className="bg-white rounded p-4">
              <div className="text-sm text-gray-600">所要時間（平均）</div>
              <div className="text-3xl font-bold text-blue-600">3秒</div>
            </div>
            <div className="bg-white rounded p-4">
              <div className="text-sm text-gray-600">入力内容</div>
              <div className="text-lg font-semibold text-blue-600">なし</div>
            </div>
          </div>
        </div>

        {/* 従来方式 */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border-2 border-gray-400">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
            <span className="mr-2">🔑</span>
            従来方式 (ID+PW+SMS)
          </h3>
          <div className="space-y-4">
            <div className="bg-white rounded p-4">
              <div className="text-sm text-gray-600">ステップ数</div>
              <div className="text-3xl font-bold text-gray-700">5</div>
            </div>
            <div className="bg-white rounded p-4">
              <div className="text-sm text-gray-600">クリック数</div>
              <div className="text-3xl font-bold text-gray-700">8</div>
            </div>
            <div className="bg-white rounded p-4">
              <div className="text-sm text-gray-600">所要時間（平均）</div>
              <div className="text-3xl font-bold text-gray-700">45秒</div>
            </div>
            <div className="bg-white rounded p-4">
              <div className="text-sm text-gray-600">入力内容</div>
              <div className="text-sm text-gray-700">
                ID、パスワード、SMS認証コード
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="inline-block bg-yellow-100 border-2 border-yellow-500 rounded-lg px-6 py-4">
          <p className="text-2xl font-bold text-yellow-900">
            パスキーなら <span className="text-4xl text-blue-600">15倍速い</span>
          </p>
          <p className="text-sm text-yellow-800 mt-2">
            覚える必要なし・入力なし・高セキュリティ
          </p>
        </div>
      </div>
    </div>
  );
}
