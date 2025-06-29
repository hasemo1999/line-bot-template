# しん専用 LINE Bot

## 🔧 必要な環境変数
`.env` ファイルをプロジェクトのルートに置き、以下を設定：

```
CHANNEL_ACCESS_TOKEN=あなたのアクセストークン
CHANNEL_SECRET=あなたのシークレット
```

## 🚀 デプロイ方法（Render）
1. GitHubにアップロード or ZIP展開してRenderで新規 Nodeサービス作成
2. Webhook URLを `https://xxx.onrender.com/webhook` に設定