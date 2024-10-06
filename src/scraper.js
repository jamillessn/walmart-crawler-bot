const playwright = require('playwright');

async function scrapeAmazonProduct(url) {
    const browser =  await playwright.chromium.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const productTitle = await page.textContent('#productTitle');
    const price = await page.textContent('#priceblock_ourprice');

    await browser.close();

    return { productTitle, price};
}

async function scrapeWalmartProduct(url) {
    const browser =  await playwright.chromium.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const productTitle = await page.textContent('h1.prod-ProductTitle');
    const price = await page.textContent('span.price-characteristic ');

    await browser.close();

    return {productTitle, price};
}

module.exports = {scrapeAmazonProduct, scrapeWalmartProduct};