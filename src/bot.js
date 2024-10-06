// const { Telegraf } = require('telegraf');
const telegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const cron = require('node-cron');
const {scrapeAmazonProduct, scrapeWalmartProduct} = require('./scraper');
// const fetch = require('node-fetch');

const BOT_TOKEN = process.env.TOKEN;
const bot = new telegramBot(BOT_TOKEN, { polling: true });

const amazonUrl = 'https://www.amazon.com/fmc/everyday-essentialscategory'
const walmartUrl = 'https://www.walmart.com/cp/groceriesessentials/1735450'


//Sends message with product data to user
async function sendProductInfo(chatId, productData){
    const message = `Product: ${productData.productTitle}\nPrice:${productData.price}`;
    await bot.sendMessage(chatId, message);
}

//Command for users to fetch product data manually
bot.on('message', async (message) => {
    const chatId =  message.chat.id;

    try {
        const amazonData = await scrapeAmazonProduct(amazonUrl);
        const walmartData = await scrapeWalmartProduct(walmartUrl);

        await sendProductInfo(chatId, amazonData);
        await sendProductInfo(chatId, walmartData);
    } catch (error) {
        console.error('Error fetching product data:', error);
        await bot.sendMessage('Failed to fetch product data.');
    }
})
  

// Schedule job to run every 2 minutes and send product data
cron.schedule('*/2 * * * *', async () => {
    try {
        const amazonData = await scrapeAmazonProduct(amazonUrl);
        const walmartData = await scrapeWalmartProduct(walmartUrl);

        // Replace with the actual chat ID of the bot's user or group
        const chatId = '7081940945';

        const messageAmazon = `Amazon Product:\n${amazonData.productTitle}\nPrice: ${amazonData.price}`;
        const messageWalmart = `Walmart Product:\n${walmartData.productTitle}\nPrice: ${walmartData.price}`;

        // Send the product info to Telegram
        await bot.sendMessage(chatId, messageAmazon);
        await bot.sendMessage(chatId, messageWalmart);
    } catch (error) {
        console.error('Scheduled task failed:', error);
    }
});

console.log('Bot is running...');

// Graceful shutdown
process.once('SIGINT', () => {
    console.log('Bot shutting down');
    process.exit();
});
process.once('SIGTERM', () => {
    console.log('Bot shutting down');
    process.exit();
});