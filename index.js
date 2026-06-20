require('dotenv').config();
const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const { getTweetScreenshot } = require('./screenshot');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
    console.log(`ログイン完了: ${client.user.tag}`);

    // スラッシュコマンドを登録
    const commands = [{
        name: 'print',
        description: 'Twitter(X)のURLからツイートの画像を生成します',
        options: [
            {
                name: 'url',
                description: 'TwitterまたはXのツイートURL',
                type: 3, // STRING
                required: true,
            },
            {
                name: 'theme',
                description: '画像のテーマ（ダーク/ライト）',
                type: 3, // STRING
                required: false,
                choices: [
                    { name: 'ダークモード', value: 'dark' },
                    { name: 'ライトモード', value: 'light' }
                ]
            }
        ]
    }];

    try {
        await client.application.commands.set(commands);
        console.log('スラッシュコマンドの登録が完了しました！');
    } catch (error) {
        console.error('コマンド登録エラー:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'print') {
        const url = interaction.options.getString('url');
        const theme = interaction.options.getString('theme') || 'dark';

        // スクリーンショットの生成には時間がかかる場合があるため、一旦応答を保留します
        await interaction.deferReply(); 

        try {
            const imageBuffer = await getTweetScreenshot(url, theme);
            const attachment = new AttachmentBuilder(imageBuffer, { name: 'tweet.png' });

            await interaction.editReply({ files: [attachment] });
        } catch (error) {
            console.error('スクリーンショット取得エラー:', error);
            await interaction.editReply('ツイートの取得に失敗しました。URLが正しいか、またはツイートが公開されているか確認してください。');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
