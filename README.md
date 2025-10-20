# 証券Webログイン パスキーデモ

Twilio Verify Passkeyを使用した次世代認証のデモアプリケーションです。展示会ブースでの来場者向けに、パスキー認証の「簡単さ」と「高いセキュリティ」を体感してもらうことを目的としています。

## 🎯 プロジェクト概要

- **デモタイプ**: シナリオドリブン体験型
- **ターゲット**: 展示会ブース来場者（非技術/事業/経営層を含む）
- **体験目標**: 2秒以内のログイン、直感的な理解、商談化
- **技術スタック**: Next.js 15 (App Router) + Twilio Verify Passkey (Beta) + Vercel

## ✨ 主な機能

1. **新規ユーザー登録** - メールアドレス入力 + パスキー作成で簡単登録
2. **パスキー認証** - 生体認証による高速・安全なログイン（既存ユーザー）
3. **OTPフォールバック** - 非対応端末向けのSMS/Email認証
4. **比較パネル** - 従来方式との摩擦差を可視化
5. **メトリクス収集** - 成功率、所要時間、クリック数の匿名追跡
6. **1クリックリセット** - ブース運用を考慮した高速リセット機能

## 🔄 ユーザーフロー

### 新規ユーザー（初回）
1. トップページで「新規アカウント登録」をクリック
2. メールアドレスを入力
3. 「パスキーを登録してアカウント作成」をクリック
4. 生体認証（Face ID / Touch ID）でパスキーを作成
5. ダッシュボードに自動ログイン

### 既存ユーザー（2回目以降）
1. トップページで「ログイン」をクリック
2. 生体認証（Face ID / Touch ID）で認証
3. ダッシュボードに即座にログイン（約2-3秒）

詳細なフローは [docs/USER_FLOW.md](docs/USER_FLOW.md) を参照してください。

## 🚀 クイックスタート

### 前提条件

- Node.js 18以上
- Twilioアカウント
- Vercelアカウント（デプロイ用）

### ローカル開発

1. **リポジトリのクローン**

```bash
git clone <repository-url>
cd twilio-securities
```

2. **依存関係のインストール**

```bash
npm install
```

3. **環境変数の設定**

`.env.example`を`.env.local`にコピーして、必要な値を設定します。

```bash
cp .env.example .env.local
```

`.env.local`を編集：

```env
# Twilio認証情報
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here

# Twilio Verifyサービス
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_VERIFY_PASSKEY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# アプリケーション設定
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000
NEXT_PUBLIC_RP_ID=localhost
NEXT_PUBLIC_RP_NAME=Booth Passkey Demo

# セッション秘密鍵（32文字以上）
SESSION_SECRET=your_random_session_secret_min_32_chars
```

4. **開発サーバーの起動**

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセス

## 🔧 Twilio設定

### 1. Verify OTPサービスの作成

1. [Twilio Console](https://console.twilio.com) にログイン
2. **Verify** > **Services** に移動
3. 新しいサービスを作成
4. サービスSIDを `.env.local` の `TWILIO_VERIFY_SERVICE_SID` に設定

### 2. Verify Passkeyサービスの作成（ベータ）

1. Twilioアカウントでベータ版へのアクセスをリクエスト
2. **Verify** > **Passkeys** に移動
3. 新しいPasskeyサービスを作成
4. **RP (Relying Party)設定**:
   - RP ID: `localhost` (開発) / `your-domain.com` (本番)
   - RP Name: `Booth Passkey Demo`
   - Origin: `http://localhost:3000` (開発) / `https://your-domain.com` (本番)
5. サービスSIDを `.env.local` の `TWILIO_VERIFY_PASSKEY_SERVICE_SID` に設定

## 📦 GitHubへの登録とVercelデプロイ

### GitHubリポジトリの作成

1. **Gitリポジトリの初期化**

```bash
cd twilio-securities
git init
git add .
git commit -m "Initial commit: Twilio Verify Passkey demo with securities company UI"
```

2. **GitHub CLIでリポジトリ作成＆プッシュ**

```bash
# GitHub CLIの認証（初回のみ）
gh auth login

# リポジトリを作成してプッシュ
gh repo create twilio-verify-passkey-securities-demo \
  --public \
  --source=. \
  --description="Twilio Verify Passkey authentication demo with securities company UI - Next.js App Router, TypeScript, Tailwind CSS" \
  --push
```

または、GitHub Webインターフェースで作成：
1. https://github.com/new でリポジトリ作成
2. ローカルで以下のコマンドを実行：

```bash
git remote add origin https://github.com/YOUR_USERNAME/twilio-verify-passkey-securities-demo.git
git branch -M main
git push -u origin main
```

### Vercelへのデプロイ

1. **Vercel CLIのインストールとログイン**

```bash
npm install -g vercel
vercel login
```

2. **環境変数の設定**

Vercelに本番環境の環境変数を設定します：

```bash
# Twilio認証情報
vercel env add TWILIO_ACCOUNT_SID production
# プロンプトで値を入力: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

vercel env add TWILIO_AUTH_TOKEN production
# プロンプトで値を入力: your_auth_token

vercel env add TWILIO_VERIFY_SERVICE_SID production
# プロンプトで値を入力: VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# セッション秘密鍵（ランダムに生成）
echo $(openssl rand -base64 32) | vercel env add SESSION_SECRET production

# 公開環境変数（Vercelドメインに合わせて設定）
echo "https://your-project.vercel.app" | vercel env add NEXT_PUBLIC_APP_BASE_URL production
echo "your-project.vercel.app" | vercel env add NEXT_PUBLIC_RP_ID production
echo "NextGen Securities Passkey Demo" | vercel env add NEXT_PUBLIC_RP_NAME production
```

3. **Twilio Verify Serviceの更新**

Vercelドメインに合わせてTwilio Verify Passkeyサービスを更新：

```bash
curl -X POST "https://verify.twilio.com/v2/Services/YOUR_SERVICE_SID" \
  -u YOUR_ACCOUNT_SID:YOUR_AUTH_TOKEN \
  --data-urlencode "Passkeys.RelyingParty.Id=your-project.vercel.app" \
  --data-urlencode "Passkeys.RelyingParty.Origins=https://your-project.vercel.app"
```

4. **本番環境にデプロイ**

```bash
vercel --prod
```

デプロイが完了すると、本番URLが表示されます：
```
✅  Production: https://your-project.vercel.app
```

5. **デプロイの確認**

```bash
# デプロイ一覧を表示
vercel ls

# 最新デプロイメントのログを確認
vercel logs
```

### 継続的デプロイ（オプション）

VercelとGitHubを連携すると、`main`ブランチへのプッシュで自動デプロイされます：

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. "Import Project" をクリック
3. GitHubリポジトリを選択
4. 環境変数を設定（上記と同じ）
5. "Deploy" をクリック

これで、GitHubにプッシュするたびに自動的にVercelにデプロイされます。

詳細は [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) を参照してください。

## 🎬 ブース運用ガイド

### デモフロー（1分版）

1. **新規ユーザー体験**（30秒）
   - 来場者に「新規アカウント登録」を実演
   - メールアドレス入力 → パスキー作成 → 完了
   - 所要時間を強調

2. **比較説明**（20秒）
   - 「従来方式との比較を見る」をクリック
   - クリック数・入力数・時間の差を説明

3. **リセット**（10秒）
   - 「リセット」ボタンで次の来場者へ

詳細な台本は [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) を参照してください。

## 📊 プロジェクト構造

```
twilio-securities/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── challenge/route.ts          # ログイン用チャレンジ
│   │   │   ├── verify/route.ts             # ログイン検証
│   │   │   ├── register/
│   │   │   │   ├── challenge/route.ts      # 登録用チャレンジ
│   │   │   │   └── verify/route.ts         # 登録検証
│   │   │   └── otp/
│   │   │       ├── start/route.ts          # OTP送信
│   │   │       └── verify/route.ts         # OTP検証
│   │   ├── session/reset/route.ts          # セッションリセット
│   │   └── metrics/track/route.ts          # メトリクス収集
│   ├── register/page.tsx                   # 新規登録画面
│   ├── dashboard/page.tsx                  # ダッシュボード
│   ├── page.tsx                            # ホーム/ログイン画面
│   ├── layout.tsx                          # ルートレイアウト
│   └── globals.css                         # グローバルスタイル
├── components/
│   ├── AuthModal.tsx                       # 認証中モーダル
│   ├── Toast.tsx                           # トースト通知
│   └── ComparisonPanel.tsx                 # 比較パネル
├── lib/
│   ├── twilio.ts                           # Twilioクライアント
│   └── session.ts                          # セッション管理
├── types/
│   └── index.ts                            # TypeScript型定義
└── docs/
    ├── USER_FLOW.md                        # ユーザーフロー詳細
    ├── DEPLOYMENT.md                       # デプロイ手順
    ├── DEMO_SCRIPT.md                      # デモ台本
    └── ARCHITECTURE.md                     # アーキテクチャ図
```

## 🔐 セキュリティ

### デモ環境の制約

- **PII非保存**: 個人情報は保存されません（メールアドレスは識別用のみ）
- **短期セッション**: セッションは1時間で自動失効
- **デモデータのみ**: 実際の取引データは使用されません

### パスキーのセキュリティ

- **秘密鍵**: デバイス内に保管、外部に出ない
- **公開鍵暗号**: フィッシング攻撃に耐性
- **生体認証**: Face ID / Touch IDによる強固な本人確認

## ⚠️ 重要な注意事項

### 現在の実装について

このプロジェクトはデモ用途であり、以下の点で簡略化されています：

1. **WebAuthn統合**: デモではシミュレーション。本番環境では `@simplewebauthn/browser` と `@simplewebauthn/server` を使用してください

2. **Twilio API呼び出し**: 実際のTwilio Verify Passkey APIの仕様に合わせて調整が必要です（現在ベータ版）

3. **ユーザー管理**: 簡易的な実装。本番環境では適切なデータベースとユーザー管理が必要です

### 本番環境への展開時の考慮事項

- セッション管理の強化（Redis等）
- CSRF保護の実装
- レート制限の追加
- 監査ログの実装
- PII保護とGDPR/個人情報保護法への対応
- 実際のWebAuthn APIの完全な実装

## 📚 ドキュメント

- [ユーザーフロー詳細](docs/USER_FLOW.md) - 登録・ログインの完全なシーケンス図
- [デプロイ手順](docs/DEPLOYMENT.md) - Twilio/Vercelの詳細設定
- [デモ台本](docs/DEMO_SCRIPT.md) - ブース運用の1分/5分バージョン
- [アーキテクチャ](docs/ARCHITECTURE.md) - システム構成とデータフロー

## 🛠️ 開発

### ビルド

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## 🤔 FAQ

**Q: パスキーを登録したデバイスを紛失したら？**
A: 別のデバイスで再度パスキーを登録できます。また、OTPフォールバックも利用可能です。

**Q: 複数のデバイスでログインできますか？**
A: はい。各デバイスでパスキーを登録すれば、どのデバイスからでもログインできます。

**Q: パスキーが使えないブラウザの場合は？**
A: OTP（SMS/Email）認証にフォールバックできます。

**Q: 本番環境での導入コストは？**
A: Twilio Verify Passkeyは従量課金制です。詳細はTwilioの料金ページを参照してください。

## 📝 ライセンス

MIT

## 🙏 謝辞

- Twilio Verify Passkey (Beta)
- Next.js
- Vercel
- WebAuthn/FIDO2

## 📞 サポート

問題が発生した場合は、GitHubのIssuesで報告してください。
