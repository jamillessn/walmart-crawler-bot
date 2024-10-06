const { chromium } = require('playwright');

// Function to crawl and extract product data from Walmart
async function crawlShoppee(url) {
    const browser = await chromium.launch({headless: false});
    const page = await browser.newPage();

    // Login authentication =================================================================

    // Perform authentication steps. Replace these actions with your own.
    await page.goto(url);
        
    await page.getByPlaceholder('Phone number / Username / Email').fill('09165439795');
        await page.getByPlaceholder('Password').fill('Pas$w0rd!');
        await page.getByRole('button', { name: 'Log In' }).click();
        console.log('Successfully logged in');

    await page.waitForURL(shoppeeUrl);


    // Optional: Add a delay to mimic human behavior
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000)); // Random delay

    const products = await page.$$eval('ul[class="a11y-image-carousel__item-list"] li', (items) =>
        items.map((item) => {
            const title = item.querySelector('.mXocXb')?.innerText || ''; 
            const price = item.querySelector('span[aria-label="promotion price"]')?.innerText || ''; 
            const link = item.querySelector('a')?.href || ''; 
            return { title, price, link};
        })
    );
    
    console.log(products);
    await browser.close();
}

const shoppeeUrl = 'https://shopee.ph/'; 
crawlShoppee(shoppeeUrl);
