const { chromium } = require('playwright');

async function scrapeAmazonEverydayEssentials() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://www.walmart.com/ip/Fresh-Banana-Fruit-Each/44390948?classType=REGULAR&athbdg=L1200');

    // Wait for the necessary elements to load
    await page.waitForSelector('.s-main-slot .s-result-item');

    // Extract product data
    const products = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.s-main-slot .s-result-item'));
        return items.map(item => {
            const titleElement = item.querySelector('h1');
            const priceElement = item.querySelector('a') || item.querySelector('.a-offscreen');
            const title = titleElement ? titleElement.innerText : null;
            const price = priceElement ? priceElement.innerText : null;
            return { title, price };
        });
    });

    console.log(products);

    await browser.close();
}

scrapeAmazonEverydayEssentials().catch(console.error);
