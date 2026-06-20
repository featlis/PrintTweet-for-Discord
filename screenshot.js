const puppeteer = require('puppeteer');

async function getTweetScreenshot(tweetUrl, theme = 'dark') {
    // ツイートIDを正規表現で抽出
    const match = tweetUrl.match(/(?:twitter\.com|x\.com)\/.*\/status\/([0-9]+)/);
    if (!match) {
        throw new Error('無効なTwitter(X)のURLです。');
    }
    const tweetId = match[1];

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // Twitterの公式埋め込み用URLを構築
        const embedUrl = `https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&theme=${theme}`;
        
        await page.goto(embedUrl, { waitUntil: 'networkidle0', timeout: 30000 });

        // ツイートのルート要素（#app または article）が読み込まれるまで待機
        await page.waitForSelector('#app, article', { timeout: 10000 }).catch(() => {});
        
        // 追加で少し待機して画像などが完全に読み込まれるようにする
        await new Promise(resolve => setTimeout(resolve, 2000));

        // ページ全体（ツイートのサイズに合わせた部分）をスクリーンショット
        const appElement = await page.$('#app') || await page.$('body');
        const screenshotBuffer = await appElement.screenshot();
        
        return screenshotBuffer;
    } finally {
        await browser.close();
    }
}

module.exports = { getTweetScreenshot };
