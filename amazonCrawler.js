const { chromium } = require('playwright');
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
require('dotenv').config();

// Telegram bot token
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true, autoStop: true });

//amazonurl
const amazonUrl = 'https://www.amazon.com/s?i=specialty-aps&bbn=16225013011&rh=n%3A%2116225013011%2Cn%3A2975312011&ref=nav_em__nav_desktop_sa_intl_dogs_0_2_21_2';

// Function to crawl and extract product data from Walmart
async function crawlAmazon(url) {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    

    await page.goto(url);
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000)); // Random delay


    const products = await page.$$eval('span[data-component-type="s-search-results"]', (items) =>
        items.map((item) => {
            const title = item.querySelector('[data-component-type="s-search-result"')?.innerText || ''; 
            return { title };
        })
    );

    console.log(products);
    await browser.close();
    
}


crawlAmazon(amazonUrl);
