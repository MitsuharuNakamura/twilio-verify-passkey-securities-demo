"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startRegistration } from "@simplewebauthn/browser";
import AuthModal from "@/components/AuthModal";
import SecuritiesHeader from "@/components/SecuritiesHeader";
import SecuritiesFooter from "@/components/SecuritiesFooter";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const startTime = Date.now();
    setIsRegistering(true);
    setError(null);

    try {
      if (!email) {
        throw new Error("メールアドレスを入力してください");
      }

      const userId = email;

      const challengeRes = await fetch("/api/auth/register/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email }),
      });

      if (!challengeRes.ok) {
        const errorData = await challengeRes.json();
        throw new Error(errorData.error || "パスキー登録の準備に失敗しました");
      }

      const { options } = await challengeRes.json();

      let credential;
      try {
        credential = await startRegistration(options);
      } catch (webauthnError: any) {
        console.error("WebAuthn registration error:", webauthnError);
        console.error("Error name:", webauthnError.name);
        console.error("Error message:", webauthnError.message);

        if (webauthnError.name === "NotAllowedError") {
          throw new Error("生体認証がキャンセルされました");
        } else if (webauthnError.name === "NotSupportedError") {
          throw new Error("お使いのブラウザはパスキーに対応していません");
        } else if (webauthnError.name === "InvalidStateError") {
          throw new Error("このパスキーは既に登録されています");
        }
        throw new Error(
          `パスキー作成に失敗しました: ${webauthnError.name} - ${webauthnError.message}`,
        );
      }

      const verifyRes = await fetch("/api/auth/register/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-start-time": startTime.toString(),
        },
        body: JSON.stringify({
          userId,
          email,
          credential,
          challenge: options.challenge,
        }),
      });

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json();
        throw new Error(errorData.error || "パスキー登録に失敗しました");
      }

      const result = await verifyRes.json();

      localStorage.setItem(
        "passkey_user",
        JSON.stringify({
          userId,
          email,
          credentialID: result.registrationInfo.credentialID,
          credentialPublicKey: result.registrationInfo.credentialPublicKey,
          counter: 0,
        }),
      );

      await fetch("/api/metrics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "passkey_register",
          duration: Date.now() - startTime,
          method: "passkey",
          success: true,
          timestamp: Date.now(),
        }),
      });

      router.push(`/?registered=true&email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "登録に失敗しました");
      setIsRegistering(false);
    }
  };

  return (
    <>
      <SecuritiesHeader />

      <main className="min-h-screen bg-gray-50">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">口座開設（無料）</h1>
            <p className="text-orange-100">パスキーで安全・簡単に開設</p>
          </div>
        </div>

        {/* ステップインジケーター */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"}`}
                >
                  1
                </div>
                <span className="ml-2 text-sm font-medium">メール入力</span>
              </div>
              <div className="w-16 h-1 bg-gray-300"></div>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"}`}
                >
                  2
                </div>
                <span className="ml-2 text-sm font-medium">パスキー登録</span>
              </div>
              <div className="w-16 h-1 bg-gray-300"></div>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"}`}
                >
                  3
                </div>
                <span className="ml-2 text-sm font-medium">完了</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="font-bold text-gray-900 mb-1">最短5分</h3>
                <p className="text-sm text-gray-600">口座開設完了</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-4xl mb-2">🔐</div>
                <h3 className="font-bold text-gray-900 mb-1">パスキー</h3>
                <p className="text-sm text-gray-600">パスワード不要</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-4xl mb-2">🎁</div>
                <h3 className="font-bold text-gray-900 mb-1">キャンペーン</h3>
                <p className="text-sm text-gray-600">手数料無料</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-4 border-orange-500 pb-2">
                口座開設フォーム
              </h2>

              <form onSubmit={handleRegister}>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-gray-900 font-bold mb-2"
                  >
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                    required
                    disabled={isRegistering}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    ※ ログイン時のIDとして使用します
                  </p>
                </div>

                <div className="mb-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <h3 className="font-bold text-blue-900 mb-3 flex items-center text-lg">
                    <span className="text-2xl mr-2">🔐</span>
                    パスキー認証について
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>パスワードの入力・記憶が不要</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>Face ID / Touch ID で安全にログイン</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>フィッシング攻撃に強い次世代認証</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>このデバイスに安全に保存されます</span>
                    </li>
                  </ul>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                    <p className="font-bold">エラーが発生しました</p>
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isRegistering ? "パスキー登録中..." : "口座開設を申し込む"}
                </button>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="text-blue-600 hover:text-blue-800 font-semibold underline"
                  >
                    すでに口座をお持ちの方はログイン
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200 text-xs text-gray-600">
                <p className="mb-2">
                  ※ 本サービスはパスキー認証のデモンストレーションです。
                </p>
                <p>※ 実際の証券取引は行えません。個人情報は保存されません。</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SecuritiesFooter />

      <AuthModal
        isOpen={isRegistering}
        message="デバイスで生体認証を完了してパスキーを作成してください"
      />
    </>
  );
}
