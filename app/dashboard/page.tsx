"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Toast from "@/components/Toast";
import SecuritiesHeader from "@/components/SecuritiesHeader";
import SecuritiesFooter from "@/components/SecuritiesFooter";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showToast, setShowToast] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const loginDuration = searchParams.get("duration") || "0";

  const handleReset = async () => {
    if (!confirm("ログアウトしてセッションをリセットしますか？")) {
      return;
    }

    setIsResetting(true);
    try {
      await fetch("/api/session/reset", {
        method: "POST",
      });
      localStorage.clear(); // パスキー情報もクリア
      router.push("/");
    } catch (error) {
      console.error("Reset error:", error);
      alert("リセットに失敗しました");
      setIsResetting(false);
    }
  };

  return (
    <>
      <SecuritiesHeader />

      <main className="min-h-screen bg-gray-50">
        {/* サブヘッダー */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              <div className="flex gap-6 text-sm">
                <a
                  href="#"
                  className="font-bold text-blue-600 border-b-2 border-blue-600 pb-3"
                >
                  ホーム
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 pb-3">
                  注文
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 pb-3">
                  資産状況
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 pb-3">
                  入出金
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 pb-3">
                  マーケット情報
                </a>
              </div>
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="text-sm text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
              >
                {isResetting ? "ログアウト中..." : "ログアウト"}
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* ログイン成功バナー */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-4xl mr-4">✓</div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">ログイン成功</h2>
                  <p className="text-green-100">
                    パスキー認証完了 - 所要時間:{" "}
                    <span className="font-bold text-white">
                      {(parseInt(loginDuration) / 1000).toFixed(2)}秒
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-green-100">従来方式と比較</div>
                <div className="text-3xl font-bold">15倍速い</div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* メインエリア */}
            <div className="lg:col-span-2 space-y-6">
              {/* 資産サマリー */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-blue-100 mb-1">総資産評価額</p>
                      <h2 className="text-4xl font-bold">¥12,345,678</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-100">前日比</p>
                      <p className="text-2xl font-bold text-green-300">
                        +¥234,567
                      </p>
                      <p className="text-sm text-green-200">(+1.94%)</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-blue-500">
                    <div>
                      <p className="text-xs text-blue-200">現金</p>
                      <p className="font-bold">¥2,345,678</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-200">株式評価額</p>
                      <p className="font-bold">¥9,500,000</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-200">評価損益</p>
                      <p className="font-bold text-green-300">+¥500,000</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 保有銘柄 */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b bg-gray-50">
                  <h3 className="text-lg font-bold text-gray-900">保有銘柄</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 text-sm text-gray-700">
                      <tr>
                        <th className="text-left py-3 px-4">銘柄</th>
                        <th className="text-right py-3 px-4">保有数</th>
                        <th className="text-right py-3 px-4">現在値</th>
                        <th className="text-right py-3 px-4">前日比</th>
                        <th className="text-right py-3 px-4">評価損益</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900">
                            トヨタ自動車
                          </div>
                          <div className="text-xs text-gray-500">7203</div>
                        </td>
                        <td className="text-right py-3 px-4">100株</td>
                        <td className="text-right py-3 px-4 font-bold">
                          ¥2,450
                        </td>
                        <td className="text-right py-3 px-4 text-green-600">
                          <div>+¥25</div>
                          <div className="text-xs">+1.03%</div>
                        </td>
                        <td className="text-right py-3 px-4 font-bold text-green-600">
                          +¥12,500
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900">
                            ソニーグループ
                          </div>
                          <div className="text-xs text-gray-500">6758</div>
                        </td>
                        <td className="text-right py-3 px-4">50株</td>
                        <td className="text-right py-3 px-4 font-bold">
                          ¥13,200
                        </td>
                        <td className="text-right py-3 px-4 text-green-600">
                          <div>+¥180</div>
                          <div className="text-xs">+1.38%</div>
                        </td>
                        <td className="text-right py-3 px-4 font-bold text-green-600">
                          +¥35,000
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900">
                            日本電信電話
                          </div>
                          <div className="text-xs text-gray-500">9432</div>
                        </td>
                        <td className="text-right py-3 px-4">200株</td>
                        <td className="text-right py-3 px-4 font-bold">¥168</td>
                        <td className="text-right py-3 px-4 text-red-600">
                          <div>-¥3</div>
                          <div className="text-xs">-1.75%</div>
                        </td>
                        <td className="text-right py-3 px-4 font-bold text-red-600">
                          -¥2,400
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900">三菱UFJ</div>
                          <div className="text-xs text-gray-500">8306</div>
                        </td>
                        <td className="text-right py-3 px-4">500株</td>
                        <td className="text-right py-3 px-4 font-bold">
                          ¥1,234
                        </td>
                        <td className="text-right py-3 px-4 text-green-600">
                          <div>+¥15</div>
                          <div className="text-xs">+1.23%</div>
                        </td>
                        <td className="text-right py-3 px-4 font-bold text-green-600">
                          +¥45,600
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* クイックアクション */}
              <div className="grid grid-cols-3 gap-4">
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-lg transition-colors shadow">
                  買い注文
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-lg transition-colors shadow">
                  売り注文
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition-colors shadow">
                  入出金
                </button>
              </div>
            </div>

            {/* サイドバー */}
            <div className="space-y-6">
              {/* マーケット情報 */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">
                  マーケット情報
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">日経平均</span>
                    <div className="text-right">
                      <div className="font-bold">38,450.00</div>
                      <div className="text-green-600 text-xs">
                        +250.50 (+0.65%)
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">TOPIX</span>
                    <div className="text-right">
                      <div className="font-bold">2,687.25</div>
                      <div className="text-green-600 text-xs">
                        +18.30 (+0.69%)
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">ドル/円</span>
                    <div className="text-right">
                      <div className="font-bold">145.80</div>
                      <div className="text-red-600 text-xs">-0.25 (-0.17%)</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">NYダウ</span>
                    <div className="text-right">
                      <div className="font-bold">38,120.50</div>
                      <div className="text-green-600 text-xs">
                        +125.80 (+0.33%)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ニュース */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">
                  最新ニュース
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <span className="text-gray-500 text-xs">12:30</span>
                    <p className="text-gray-800">
                      日経平均、午前終値は38,450円
                    </p>
                  </li>
                  <li>
                    <span className="text-gray-500 text-xs">11:45</span>
                    <p className="text-gray-800">
                      トヨタ、新型EV発表で株価上昇
                    </p>
                  </li>
                  <li>
                    <span className="text-gray-500 text-xs">10:20</span>
                    <p className="text-gray-800">日銀、金融政策維持を決定</p>
                  </li>
                </ul>
              </div>

              {/* パスキー認証情報 */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">🔐</span>
                  パスキー認証
                </h3>
                <div className="text-sm text-blue-800 space-y-2">
                  <div className="flex justify-between">
                    <span>認証方法:</span>
                    <span className="font-bold">生体認証</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ログイン時間:</span>
                    <span className="font-bold">
                      {(parseInt(loginDuration) / 1000).toFixed(2)}秒
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>セキュリティ:</span>
                    <span className="font-bold text-green-600">高</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* デモ注記 */}
          <div className="mt-8 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 text-center">
            <p className="text-sm text-yellow-800">
              <strong>※ これはデモ画面です。</strong>{" "}
              実際の取引データではありません。
              パスキー認証の体験デモンストレーション用です。
            </p>
          </div>
        </div>
      </main>

      <SecuritiesFooter />

      {showToast && (
        <Toast
          message="パスキー認証に成功しました！"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
