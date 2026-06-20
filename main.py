import os
import discord
from discord import app_commands
from dotenv import load_dotenv
from tweetcapture import TweetCapture
import tempfile
import traceback

load_dotenv()

TOKEN = os.getenv("DISCORD_TOKEN")

intents = discord.Intents.default()
client = discord.Client(intents=intents)
tree = app_commands.CommandTree(client)

# テーマの選択肢
NIGHT_MODE_MAP = {
    "light": 0,   # ライトモード
    "dark": 1,    # ダークモード
    "black": 2,   # ブラックモード (OLED向け)
}


@tree.command(name="print", description="Twitter(X)のURLからツイートの画像を生成します")
@app_commands.describe(
    url="TwitterまたはXのツイートURL",
    theme="画像のテーマ（デフォルト: ダークモード）",
)
@app_commands.choices(theme=[
    app_commands.Choice(name="ライトモード", value="light"),
    app_commands.Choice(name="ダークモード", value="dark"),
    app_commands.Choice(name="ブラックモード (OLED)", value="black"),
])
async def print_tweet(interaction: discord.Interaction, url: str, theme: str = "dark"):
    # URLバリデーション
    if not ("twitter.com/" in url or "x.com/" in url) or "/status/" not in url:
        await interaction.response.send_message(
            "❌ 無効なURLです。`https://twitter.com/xxx/status/123...` または `https://x.com/xxx/status/123...` の形式で入力してください。",
            ephemeral=True,
        )
        return

    # スクリーンショット生成には時間がかかるので先に応答を保留
    await interaction.response.defer()

    night_mode = NIGHT_MODE_MAP.get(theme, 1)

    try:
        # TweetCaptureのインスタンスを作成
        # mode=3: すべて表示, night_mode: テーマ
        tweet = TweetCapture(mode=3, night_mode=night_mode)

        # 一時ファイルに保存
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
            tmp_path = tmp.name

        # スクリーンショットを撮影
        filename = await tweet.screenshot(url, tmp_path, overwrite=True)

        # Discordに画像を送信
        file = discord.File(filename, filename="tweet.png")
        await interaction.followup.send(file=file)

    except Exception as e:
        traceback.print_exc()
        await interaction.followup.send(
            f"❌ ツイートの取得に失敗しました。URLが正しいか、ツイートが公開されているか確認してください。\n```\n{str(e)}\n```"
        )
    finally:
        # 一時ファイルを削除
        try:
            os.unlink(tmp_path)
        except Exception:
            pass


@client.event
async def on_ready():
    await tree.sync()
    print(f"ログイン完了: {client.user}")
    print("スラッシュコマンドの登録が完了しました！")


client.run(TOKEN)
