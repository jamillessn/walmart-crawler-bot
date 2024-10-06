const { chromium } = require('playwright');


async () => {
    const browser = await chromium.launch({headless: false});
    const context = await browser.newContext();
    const page = await browser.newPage();

    await page.goto('https://www.walmart.com/cp/groceriesessentials/1735450');

    await browser.close();
}
