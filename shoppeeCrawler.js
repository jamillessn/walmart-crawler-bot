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

            // await page.goto('https://shopee.ph/Groceries-cat.11021197');

        await page.waitForURL('https://shopee.ph/Groceries-cat.11021197');
        // Alternatively, you can wait until the page reaches a state where all cookies are set.
    // =================================================================

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
    console.log(`Number of div elements: ${desc.index}`);
    await browser.close();
}

const shoppeeUrl = 'https://shopee.ph/Groceries-cat.11021197'; 
crawlShoppee(shoppeeUrl);
