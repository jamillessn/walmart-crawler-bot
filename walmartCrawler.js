const { chromium } = require('playwright');

// Function to crawl and extract product data from Walmart
async function crawlWalmart(url) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Navigate to the specified URL
    await page.goto(url);


    // Extract product data
    const products = await page.$$eval('span', (items, title) => {
        if (!items) {
            console.log('Product data not found'); 
            return
        } else {
            console.log('Product data found');
            return;
        }
    });

    
    // console.log(products)
        // items.map(item => {
        //     const title = item.querySelector('span[data-automation-id="product-title"]')?.innerText.trim() || 'No title';
        //     const price = item.querySelector('div[data-automation-id="product-price"]')?.innerText.trim() || 'No price';
        //     const link = item.querySelector('a[link-identifier]')?.href || 'No link';
        //     return { title, price, link };
        // }));
    

    // // Output the extracted products
    // console.log(`Found ${products.length} products:`);
    // products.forEach((product, index) => {
    //     console.log(`Product ${index + 1}:`);
    //     console.log(`Title: ${product.title}`);
    //     console.log(`Price: ${product.price}`);
    //     console.log(`Link: https://www.walmart.com${product.link}`);
    //     console.log('---');
    // });

    // Close the browser
    await browser.close();
}

const walmartUrl = 'https://www.walmart.com/cp/groceriesessentials/1735450'; 
crawlWalmart(walmartUrl);
