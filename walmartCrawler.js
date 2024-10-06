const { chromium } = require('playwright');
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
require('dotenv').config();

// Telegram bot token
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true, autoStop: true });

// Global variable for storing chatId from user
let chatIdFromUser = null;

// Function to crawl and extract product data from Walmart
async function crawlWalmart(url) {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url);

    // Delay to mimic human behavior
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
    return products; 
}

// Function to send product data to the Telegram bot
async function sendProductUpdates() {
    const walmartUrl = 'https://www.walmart.com/cp/groceriesessentials/1735450';

    try {
        console.log('Running script every 2 minutes...');
        bot.sendMessage(chatIdFromUser, 'Getting product information.');
        const productData = await crawlWalmart(walmartUrl);

        // Send each product as a separate message in the desired format
        productData.forEach(product => {
            const message = `[ITEM DESCRIPTION] ${product.title}\n[ITEM PRICE] ${product.price}\n[ITEM LINK] ${product.link}`;
            bot.sendMessage(chatIdFromUser, message);
        });

        // Notify completion of fetching products with a delay
        setTimeout(() => {
            bot.sendMessage(chatIdFromUser, "Fetching products complete. Updated products will be sent after 2 minutes.");
        }, 10000); 

    } catch (error) {
        bot.sendMessage(chatIdFromUser, 'Failed to retrieve products. Please try again later.');
        console.error(error);
    }
}

// Listen for /start command
bot.onText(/\/start/, async (msg) => {
    chatIdFromUser = msg.chat.id; 
    const walmartUrl = 'https://www.walmart.com/cp/groceriesessentials/1735450';

    try {
        bot.sendMessage(chatIdFromUser, 'Getting product information.');
        const productData = await crawlWalmart(walmartUrl);

        if (productData.length === 0) {
            bot.sendMessage(chatIdFromUser, 'No products found.');
            return;
        }

        // Send each product as a separate message in the desired format
        productData.forEach(product => {
            const message = `[ITEM DESCRIPTION] ${product.title}\n[ITEM PRICE] ${product.price}\n[ITEM LINK] ${product.link}`;
            bot.sendMessage(chatIdFromUser, message);
        });


    } catch (error) {
        bot.sendMessage(chatIdFromUser, 'Failed to retrieve products. Please try again later.');
        console.error(error);
    }
});

// Listen for /stop command
bot.onText(/\/stop/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Bot shutting down.');

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

// Schedule the script to run every 2 minutes
cron.schedule('*/2 * * * *', () => {
    if (chatIdFromUser) {  
        sendProductUpdates();


    } else {
        console.log('No user has started the bot. Skipping update...');
    }
});
