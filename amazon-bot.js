const { chromium } = require('playwright'); // Playwright for parsing
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Your Telegram bot token
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true, autoStop: true });


// Function to extract product information
async function extractProductData() {
    console.log('/getproducts is prompted...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const url = 'https://www.walmart.com/cp/groceriesessentials/1735450';

    await page.goto(url);

    // Check if the element with the test ID "carousel-container" exists
    const carouselContainer = await page.$('[data-testid="carousel-container"]');

    if (carouselContainer) {
        bot.sendMessage('The element with data-testid "carousel-container" exists on the page.');
        console.log('The element with data-testid "carousel-container" exists on the page.');
    } else {
        console.log('The element with data-testid "carousel-container" does not exist on the page.');
        bot.sendMessage('The element with data-testid "carousel-container" does not exist on the page.');
    }

    // Wait for the product container to load (wait for ul with data-testid="carousel-container")
    // console.log('Looking for any element with data test id "carousel-container"...');
    // await page.getByTestId('carousel-container');

    // // Extract product data
    // console.log('Looking for any element with data test id "carousel-container"...');
    
    // const products = await page.$$eval('ul li', items => {
    //     return items.map(item => {
    //         const title = item.querySelector('span[data-automation-id="product-title"]')?.innerText || 'No title';
    //         const price = item.querySelector('div[data-automation-id="product-price"]')?.innerText || 'No price';
    //         const link = item.querySelector('a[link-identifier]')?.getAttribute('href') || 'No link';

    //         return {
    //             title: title.trim(),
    //             price: price.trim(),
    //             link: link ? `https://www.walmart.com${link.trim()}` : 'No link'
    //         };
    //     });
    // });

    // // Log the results
    // products.forEach((product, index) => {
    //     console.log(`Product ${index + 1}:`);
    //     console.log(`Title: ${product.title}`);
    //     console.log(`Price: ${product.price}`);
    //     console.log(`Link: ${product.link}`);
    //     console.log('---');
    // });

    // Close the browser
    await browser.close();
}

// Command to trigger data extraction from Walmart
bot.onText(/\/getproducts/, async (msg) => {
    const chatId = msg.chat.id;
    console.log("Chat id: " + chatId);
    const productData = await extractProductData(walmartUrl);

    // if (typeof productData === 'string') {
    //     bot.sendMessage(chatId, productData); // Send error message to Telegram
    // } else {
    //     productData.forEach((product) => {
    //         bot.sendMessage(chatId, `Product: ${product.title}\nPrice: ${product.price}\nLink: ${product.link}`);
    //     });
    // }
});

const walmartUrl = 'https://www.walmart.com/cp/groceriesessentials/1735450';

// Start bot
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome! Starting extraction from Walmart');
    extractProductData();
   

});


//Stop bot
bot.onText(/\/stop/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Bot is stopping.');
    // Graceful shutdown
        process.once('SIGINT', () => {
            console.log('Bot shutting down');
            process.exit();
        });
        process.once('SIGTERM', () => {
            console.log('Bot shutting down');
            process.exit();
        });

});


