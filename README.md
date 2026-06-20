# PrintTweet-for-Discord

Twitter(X)のURLをスラッシュコマンドで渡すと、ツイートのスクリーンショット画像を返すDiscord Botです。
Puppeteerを使用して公式の埋め込みページをレンダリングするため、APIの利用制限を気にせず完全無料で動作します。ダークモードとライトモードにも対応しています。

## 動作環境
- Node.js (v16.9.0以上推奨)
- Puppeteerが動作する環境（Chrome/Chromium）

## セットアップ
1. パッケージのインストール
   ```bash
   npm install
   ```

2. `.env.example` を `.env` にリネームし、あなたのDiscord Botのトークンを記載してください。
   ```env
   DISCORD_TOKEN=ここにBotのトークンを貼り付けてください
   ```

## 起動方法
```bash
npm start
```

## 使い方
Discordのチャット欄で以下のコマンドを入力します。
`/print url:<TwitterのURL> theme:<ダークモード / ライトモード>`

- 例: `/print url:https://twitter.com/elonmusk/status/1744173335555416245 theme:ライトモード`