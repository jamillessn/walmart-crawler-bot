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
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000)); // Random delay

    const products = await page.$$eval('ul[data-testid="carousel-container"] li', (items) =>
        items.map((item) => {
            const title = item.querySelector('span')?.innerText || ''; 
            const price = item.querySelector('[data-automation-id="product-price"] .b')?.innerText || ''; 
            const link = item.querySelector('a')?.href || ''; 
            return { title, price, link };
        })
    );

    await browser.close();
    return products;
}

// Function to crawl and extract product data from Amazon
async function crawlAmazon(url) {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url);
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000)); // Random delay

    const products = await page.$$eval('div[data-component-type="s-search-result"]', (items) =>
        items.map((item) => {
            const title = item.querySelector('h2')?.innerText || ''; 
            const price = item.querySelector('.a-price-whole')?.innerText || ''; 
            const link = item.querySelector('a')?.href || ''; 
            return { title, price, link};
        })
    );

    await browser.close();
    return products;
}

async function crawlShoppee(url) {
    const browser = await chromium.launch({headless: false});
    const page = await browser.newPage();

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

// Function to send product data to the Telegram bot
async function sendProductUpdates() {
    const walmartUrl = 'https://www.walmart.com/cp/groceriesessentials/1735450';
    const amazonUrl = 'https://www.amazon.com/fmc/everyday-essentials-category?_encoding=UTF8&node=16322721&fpw=new&fpl=fresh&ref_=pd_bap_d_eemb_p_d_ba_16322721_static_i';

    try {
        bot.sendMessage(chatIdFromUser, 'Crawling Walmart and Amazon for products...');

        // Run both Walmart and Amazon crawling in parallel
        const [walmartData, amazonData] = await Promise.all([crawlWalmart(walmartUrl), crawlAmazon(amazonUrl)]);

        if (walmartData.length === 0 && amazonData.length === 0) {
            bot.sendMessage(chatIdFromUser, 'No products found on Walmart or Amazon.');
            return;
        }

        // Send Walmart products
        bot.sendMessage(chatIdFromUser, 'Walmart Products:');
        walmartData.forEach((product, i) => {
            const message = `#${i + 1}\n[ITEM DESCRIPTION] ${product.title}\n[ITEM PRICE] ${product.price}\n[ITEM LINK] ${product.link}`;
            bot.sendMessage(chatIdFromUser, message);
        });

        // Send Amazon products
        bot.sendMessage(chatIdFromUser, 'Amazon Products:');
        amazonData.forEach((product, i) => {
            const message = `#${i + 1}\n[ITEM DESCRIPTION] ${product.title}\n[ITEM PRICE] ${product.price}\n[ITEM LINK] ${product.link}`;
            bot.sendMessage(chatIdFromUser, message);
        });

    } catch (error) {
        bot.sendMessage(chatIdFromUser, 'Failed to retrieve products. Please try again later.');
        console.error(error);
    }
}

// Listen for /start command
bot.onText(/\/start/, async (msg) => {
    chatIdFromUser = msg.chat.id;

    try {
        bot.sendMessage(chatIdFromUser, 'Starting to fetch products...');
        await sendProductUpdates();
        bot.sendMessage(chatIdFromUser, `Finished fetching all products. Sending updated products in 2 minutes.`);

    } catch (error) {
        bot.sendMessage(chatIdFromUser, 'Failed to retrieve products. Please try again later.');
        console.error(error);
    }
});

// Listen for /stop command
bot.onText(/\/stop/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Bot is stopping.');
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
        console.log('Running script every 2 minutes...');
        bot.sendMessage(chatIdFromUser, 'Sending updated product information...');
        sendProductUpdates();
    } else {
        console.log('No user has started the bot. Skipping update...');
    }
});
