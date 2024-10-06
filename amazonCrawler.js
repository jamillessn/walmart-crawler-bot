const { chromium } = require('playwright');

// Function to crawl and extract product data from Walmart
async function crawlWalmart(url) {
    const browser = await chromium.launch({headless: false});
    const page = await browser.newPage();

    await page.goto(url);

    // Optional: Add a delay to mimic human behavior
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000)); // Random delay

    const divCounts = await page.$$eval('div[data-automation-id="product-price"]', (divs, min) => divs.length >= min, 10);

    const desc = await page.$$eval('div', (divs) => divs.map((div, i) => {
        return {
            index: i,
            description: div.innerText
        };
    }));
    
    console.log(desc);
    console.log(`Number of div elements: ${divCounts}`);
    await browser.close();
}

const walmartUrl = 'https://www.amazon.com/fmc/everyday-essentials-category?_encoding=UTF8&node=16322721&fpw=new&fpl=fresh&ref_=pd_bap_d_eemb_p_d_ba_16322721_static_i'; 
crawlWalmart(walmartUrl);
