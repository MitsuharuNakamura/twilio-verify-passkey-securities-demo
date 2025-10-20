"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { startAuthentication } from "@simplewebauthn/browser";
import AuthModal from "@/components/AuthModal";
import SecuritiesHeader from "@/components/SecuritiesHeader";
import SecuritiesFooter from "@/components/SecuritiesFooter";
import QRCodeAccess from "@/components/QRCodeAccess";

export default function Home() {
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPasskey, setHasPasskey] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const passkeyUser = localStorage.getItem("passkey_user");
    setHasPasskey(!!passkeyUser);

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("registered") === "true") {
      setSuccessMessage(
        "口座開設が完了しました！パスキーでログインしてください。",
      );
      window.history.replaceState({}, "", "/");
    }
  }, []);

  const handlePasskeyLogin = async () => {
    const startTime = Date.now();
    setIsAuthenticating(true);
    setError(null);

    try {
      const passkeyUserData = localStorage.getItem("passkey_user");
      if (!passkeyUserData) {
        throw new Error(
          "パスキーが登録されていません。先に口座開設してください。",
        );
      }

      const passkeyUser = JSON.parse(passkeyUserData);
      const { userId, credentialPublicKey, counter } = passkeyUser;

      console.log("[LOGIN] Passkey user data:", passkeyUser);

      console.log("[LOGIN] Passkey user data:", passkeyUser);

      const challengeRes = await fetch("/api/auth/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!challengeRes.ok) {
        throw new Error("認証チャレンジの取得に失敗しました");
      }

      const { options } = await challengeRes.json();

      let credential;
      try {
        credential = await startAuthentication(options);
      } catch (webauthnError: any) {
        console.error("WebAuthn authentication error:", webauthnError);
        console.error("Error name:", webauthnError.name);
        console.error("Error message:", webauthnError.message);

        if (webauthnError.name === "NotAllowedError") {
          throw new Error("生体認証がキャンセルされました");
        } else if (webauthnError.name === "NotSupportedError") {
          throw new Error("お使いのブラウザはパスキーに対応していません");
        }
        throw new Error(
          `認証に失敗しました: ${webauthnError.name} - ${webauthnError.message}`,
        );
      }

      const loginDuration = Date.now() - startTime;
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-start-time": startTime.toString(),
        },
        body: JSON.stringify({
          userId,
          credential,
          challenge: options.challenge,
          credentialPublicKey,
          counter,
        }),
      });

      if (!verifyRes.ok) {
        throw new Error("認証に失敗しました");
      }

      await fetch("/api/metrics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "passkey_login",
          duration: loginDuration,
          method: "passkey",
          success: true,
          clickCount: 2,
          timestamp: Date.now(),
        }),
      });

      router.push(`/dashboard?duration=${loginDuration}`);
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err instanceof Error ? err.message : "認証に失敗しました");
      setIsAuthenticating(false);
    }
  };

  return (
    <>
      <SecuritiesHeader />

      <main className="min-h-screen bg-gray-50">
        {/* メインビジュアル */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">NextGen証券へようこそ</h1>
            <p className="text-xl text-blue-100">
              パスキーで、より安全で快適な取引を
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* ログインエリア */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-4 border-blue-600 pb-2">
                ログイン
              </h2>

              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-800">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">✓</span>
                    <div>
                      <p className="font-bold">口座開設完了</p>
                      <p className="text-sm">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {hasPasskey ? (
                <div>
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
                    <h3 className="font-bold text-blue-900 mb-2 flex items-center">
                      <span className="text-2xl mr-2">🔐</span>
                      パスキーログイン
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>✓ パスワード入力不要</li>
                      <li>✓ 生体認証で安全・簡単</li>
                      <li>✓ わずか2秒でログイン完了</li>
                    </ul>
                  </div>

                  <button
                    onClick={handlePasskeyLogin}
                    disabled={isAuthenticating}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md mb-4"
                  >
                    {isAuthenticating ? "認証中..." : "パスキーでログイン"}
                  </button>

                  <div className="text-center text-sm text-gray-600">
                    <p>または</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🔐</div>
                  <p className="text-gray-700 mb-6">
                    パスキーが登録されていません
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                  {error}
                </div>
              )}

              {/* 従来のログイン（ダミー） */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ログインID
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ログインID"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      パスワード
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="パスワード"
                      disabled
                    />
                  </div>
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 font-bold py-3 px-8 rounded cursor-not-allowed"
                  >
                    従来方式でログイン（デモでは無効）
                  </button>
                  <div className="text-xs text-gray-500 text-center">
                    <a href="#" className="hover:text-blue-600">
                      パスワードをお忘れの方
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* サイドバー */}
            <div className="space-y-6">
              {/* 口座開設案内 */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-4">
                  まだ口座をお持ちでない方
                </h3>
                <p className="mb-6 text-orange-50">
                  パスキーで、口座開設から取引までスムーズに。
                  <br />
                  最短5分で開設完了！
                </p>
                <button
                  onClick={() => router.push("/register")}
                  className="w-full bg-white text-orange-600 font-bold py-3 px-6 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  無料で口座開設
                </button>
              </div>

              {/* 新機能案内 */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded mr-2">
                    NEW
                  </span>
                  パスキーログイン開始
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  パスワード不要！生体認証で安全・簡単にログイン。
                  従来のID・パスワード方式と比べて
                  <strong className="text-blue-600">15倍速い</strong>
                  ログインを実現。
                </p>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="font-bold text-blue-600">2秒</div>
                    <div className="text-gray-600">ログイン時間</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="font-bold text-blue-600">0回</div>
                    <div className="text-gray-600">入力回数</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="font-bold text-blue-600">100%</div>
                    <div className="text-gray-600">安全性</div>
                  </div>
                </div>
              </div>

              {/* QRコード */}
              <QRCodeAccess />

              {/* お知らせ */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                  お知らせ
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">●</span>
                    <div>
                      <span className="text-gray-500 text-xs">2025/01/15</span>
                      <p className="text-gray-700">
                        パスキー認証サービス開始のお知らせ
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">●</span>
                    <div>
                      <span className="text-gray-500 text-xs">2025/01/10</span>
                      <p className="text-gray-700">
                        取引手数料無料キャンペーン実施中
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">●</span>
                    <div>
                      <span className="text-gray-500 text-xs">2025/01/05</span>
                      <p className="text-gray-700">
                        システムメンテナンスのお知らせ
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SecuritiesFooter />

      <AuthModal
        isOpen={isAuthenticating}
        message="デバイスで生体認証を完了してください"
      />
    </>
  );
}
