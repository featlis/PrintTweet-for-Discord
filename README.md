# PrintTweet-for-Discord

Twitter(X)のURLをスラッシュコマンドで渡すと、ツイートのスクリーンショット画像を返すDiscord Botです。
[tweetcapture](https://github.com/xacnio/tweetcapture) を使用して、余白のない綺麗な画像を生成します。

## 機能
- ツイートURLから高品質なスクリーンショットを自動生成
- **ライトモード / ダークモード / ブラックモード(OLED)** に対応
- RT・いいね数・タイムスタンプ等、すべての情報を表示

## 動作環境
- Python 3.9 以上
- Google Chrome がインストールされていること

## セットアップ

### 1. パッケージのインストール
```bash
pip install -r requirements.txt
```

### 2. 環境変数の設定
`.env.example` を `.env` にコピーして、Discord BotのトークンとTwitterのauth_tokenを記載してください。
```bash
copy .env.example .env
```
```env
DISCORD_TOKEN=ここにBotのトークンを貼り付けてください
AUTH_TOKEN=ここにTwitterのauth_tokenクッキーの値を貼り付けてください
```

> **注意:** 最近のTwitterの仕様変更により、ログインしていないとツイートが取得できません。
> ブラウザでX(Twitter)にログインし、開発者ツール(F12)の「Application」タブ -> 「Cookies」から `auth_token` という名前のクッキーの値をコピーして `.env` の `AUTH_TOKEN` に設定してください。

### 3. Discord Botの準備
1. [Discord Developer Portal](https://discord.com/developers/applications) で新しいアプリケーションを作成
2. **Bot** セクションでトークンを取得
3. **OAuth2 > URL Generator** で `bot` + `applications.commands` を選択
4. Bot Permissions で `Send Messages` と `Attach Files` を選択
5. 生成されたURLでBotをサーバーに招待

## 起動方法
```bash
python main.py
```

## 使い方
```
/print url:https://x.com/xxx/status/123456789 theme:ダークモード
```

| 引数 | 必須 | 説明 |
|------|------|------|
| `url` | ✅ | ツイートのURL（twitter.com / x.com） |
| `theme` | ❌ | ライトモード / ダークモード / ブラックモード (デフォルト: ダーク) |