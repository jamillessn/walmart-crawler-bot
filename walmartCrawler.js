const { chromium } = require('playwright');

// Function to crawl and extract product data from Walmart
async function crawlWalmart(url) {
    const browser = await chromium.launch({headless: false});
    const page = await browser.newPage();

    await page.goto(url);

    // Optional: Add a delay to mimic human behavior
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000)); // Random delay

     // Extract product details using $$eval and mapping
    const products = await page.$$eval('ul[data-testid="carousel-container"] li', (items) =>
        items.map((item) => {
        const title = item.querySelector('h3')?.innerText || ''; // Get product title
        const price = item.querySelector('[data-automation-id="product-price"] .b')?.innerText || ''; // Get product price
        const link = item.querySelector('a')?.href || ''; // Get product link
        
        return { title, price, link };
        })
    );

    // Log the extracted products
    console.log(products);
   
    await browser.close();
}

const walmartUrl = 'https://www.walmart.com/cp/groceriesessentials/1735450'; 
crawlWalmart(walmartUrl);
