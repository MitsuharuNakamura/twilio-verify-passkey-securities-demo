# デプロイ手順書

## 📋 事前準備チェックリスト

- [ ] Twilioアカウントの作成
- [ ] Vercelアカウントの作成
- [ ] 本番用ドメインの準備（任意）
- [ ] SSL証明書の準備（Vercelが自動提供）

## 🔧 Twilioセットアップ

### Step 1: Twilioアカウントの設定

1. [Twilio Console](https://console.twilio.com) にログイン
2. Account SIDとAuth Tokenをメモ
3. クレジットを追加（SMS送信用）

### Step 2: Verify OTPサービスの作成

1. **Verify** > **Services** に移動
2. **Create new Service** をクリック
3. 設定内容:
   - **Service Name**: `Passkey Demo OTP`
   - **Code Length**: 6
   - **Code Expiration**: 5 minutes
4. **Custom Code** セクションで文面をカスタマイズ:
   ```
   [デモ] 認証コード: {####}
   ※これはデモ用途の認証コードです
   ```
5. サービスSIDをコピー → `TWILIO_VERIFY_SERVICE_SID`

### Step 3: Verify Passkeyサービスの作成（ベータ）

> **注意**: Verify Passkeyは現在ベータ版です。アクセスにはTwilioサポートへの申請が必要な場合があります。

1. **Verify** > **Passkeys** に移動（ベータアクセス後）
2. **Create new Passkey Service** をクリック
3. 設定内容:
   - **Service Name**: `Booth Passkey Demo`
   - **RP (Relying Party) ID**: 
     - 開発環境: `localhost`
     - 本番環境: `your-app.vercel.app`
   - **RP Name**: `Booth Passkey Demo`
   - **Allowed Origins**:
     - 開発環境: `http://localhost:3000`
     - 本番環境: `https://your-app.vercel.app`
   - **Attestation**: `none` (デモ用途)
   - **User Verification**: `required`
4. サービスSIDをコピー → `TWILIO_VERIFY_PASSKEY_SERVICE_SID`

## 🚀 Vercelデプロイ

### Step 1: GitHubリポジトリの準備

```bash
# リポジトリをGitHubにプッシュ
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/twilio-passkey-demo.git
git push -u origin main
```

### Step 2: Vercelプロジェクトの作成

#### 方法A: Vercel CLI

```bash
# Vercel CLIのインストール
npm install -g vercel

# ログイン
vercel login

# プロジェクトの初期化
vercel

# プロンプトに従って設定:
# - Set up and deploy? Yes
# - Which scope? (あなたのアカウント)
# - Link to existing project? No
# - What's your project's name? twilio-passkey-demo
# - In which directory is your code located? ./
# - Auto-detected Project Settings, OK? Yes
```

#### 方法B: Vercelダッシュボード

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. **New Project** をクリック
3. GitHubリポジトリを選択
4. **Import** をクリック

### Step 3: 環境変数の設定

Vercelダッシュボードで **Settings** > **Environment Variables** に移動し、以下を追加：

#### Production環境

| 変数名 | 値 | 環境 |
|--------|-----|------|
| `TWILIO_ACCOUNT_SID` | ACxxxxxxxx... | Production |
| `TWILIO_AUTH_TOKEN` | your_auth_token | Production |
| `TWILIO_VERIFY_SERVICE_SID` | VAxxxxxxxx... | Production |
| `TWILIO_VERIFY_PASSKEY_SERVICE_SID` | VAxxxxxxxx... | Production |
| `NEXT_PUBLIC_APP_BASE_URL` | https://your-app.vercel.app | Production |
| `NEXT_PUBLIC_RP_ID` | your-app.vercel.app | Production |
| `NEXT_PUBLIC_RP_NAME` | Booth Passkey Demo | Production |
| `SESSION_SECRET` | (32文字以上のランダム文字列) | Production |

#### Preview環境（任意）

同じ環境変数を **Preview** 環境にも設定できます。

### Step 4: デプロイ実行

```bash
# 本番デプロイ
vercel --prod
```

デプロイが完了すると、URLが表示されます（例: `https://twilio-passkey-demo.vercel.app`）

### Step 5: Passkey RP設定の更新

デプロイ後、Twilio Console でPasskeyサービスの設定を更新：

1. **Verify** > **Passkeys** > サービスを選択
2. **RP Settings** を編集:
   - **RP ID**: `your-app.vercel.app`
   - **Allowed Origins**: `https://your-app.vercel.app` を追加
3. **Save** をクリック

## ✅ デプロイ検証

### 1. 基本動作確認

1. デプロイされたURLにアクセス
2. HTTPSで正しくロードされることを確認
3. コンソールにエラーがないか確認

### 2. パスキー認証テスト

1. **ログイン** ボタンをクリック
2. 生体認証プロンプトが表示されることを確認
3. 認証完了後、ダッシュボードに遷移することを確認
4. 所要時間が表示されることを確認

### 3. OTPフォールバックテスト

パスキー非対応のブラウザ/デバイスで：

1. OTP認証フローに切り替わることを確認
2. SMS/Emailが正しく送信されることを確認
3. 認証コード入力後、ログインできることを確認

### 4. リセット機能テスト

1. ダッシュボードの **リセット** ボタンをクリック
2. ホーム画面に戻ることを確認
3. セッションがクリアされていることを確認

## 🔍 トラブルシューティング

### パスキーが動作しない

**原因**: RP設定のミスマッチ

**解決策**:
1. Twilio ConsoleのRP IDとOriginを確認
2. `NEXT_PUBLIC_RP_ID`と実際のドメインが一致しているか確認
3. HTTPSでアクセスしているか確認

### API呼び出しが失敗する

**原因**: 環境変数が正しく設定されていない

**解決策**:
1. Vercel Dashboardで環境変数を確認
2. 再デプロイを実行: `vercel --prod`
3. ログを確認: `vercel logs`

### ビルドエラー

**原因**: 依存関係の問題

**解決策**:
```bash
# 依存関係のクリーンインストール
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📊 監視とログ

### Vercel Analytics

1. Vercel Dashboardで **Analytics** タブを確認
2. トラフィック、パフォーマンス、エラー率を監視

### ログの確認

```bash
# リアルタイムログ
vercel logs --follow

# 特定のデプロイメントのログ
vercel logs [deployment-url]
```

### メトリクスの確認

アプリケーション内で収集されたメトリクスは、サーバーログに記録されます：

```bash
vercel logs --follow | grep "\[METRIC\]"
```

## 🔄 継続的デプロイメント

### GitHubとの連携

Vercelは自動的にGitHubと連携され、以下のように動作します：

- **mainブランチへのpush** → 本番デプロイ
- **他のブランチへのpush** → プレビューデプロイ
- **Pull Request** → プレビューURLが自動生成

### カスタムドメインの設定（任意）

1. Vercel Dashboard > **Settings** > **Domains**
2. カスタムドメインを追加
3. DNSレコードを設定（Vercelが指示を提供）
4. SSL証明書が自動的にプロビジョニングされます

## 🎯 本番運用チェックリスト

- [ ] HTTPS接続の確認
- [ ] パスキー認証の動作確認（複数デバイス）
- [ ] OTPフォールバックの動作確認
- [ ] セッション管理の動作確認
- [ ] メトリクス収集の確認
- [ ] エラーログの監視設定
- [ ] バックアップ用のモバイルホットスポット準備（会場用）
- [ ] デモ台本とトラブルシューティングガイドの印刷

## 📞 サポート

問題が解決しない場合：

- **Vercelサポート**: https://vercel.com/support
- **Twilioサポート**: https://support.twilio.com
- **プロジェクトIssues**: GitHubリポジトリのIssuesセクション
