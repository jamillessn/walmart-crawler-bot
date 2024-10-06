const { chromium } = require('playwright');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Telegram bot token
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true, autoStop: true });

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

    await browser.close();
    return products; // Return the product data
}

// Listen for /getproducts command
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const walmartUrl = 'https://www.walmart.com/cp/groceriesessentials/1735450';

    try {
        bot.sendMessage(chatId, 'Crawling Walmart for products...');
        const productData = await crawlWalmart(walmartUrl);

        if (productData.length === 0) {
            bot.sendMessage(chatId, 'No products found.');
            return;
        }

         // Send each product as a separate message in the desired format
         productData.forEach(product => {
            const message = `[ITEM DESCRIPTION] ${product.title}\n[ITEM PRICE] ${product.price}\n[ITEM LINK] ${product.link}`;
            bot.sendMessage(chatId, message);
        });

    } catch (error) {
        bot.sendMessage(chatId, 'Failed to retrieve products. Please try again later.');
        console.error(error);
    }
});

// Listen for /stop command
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

// Optional: Crawl Walmart on startup if needed
// const walmartUrl = 'https://www.walmart.com/cp/groceriesessentials/1735450';
// crawlWalmart(walmartUrl);