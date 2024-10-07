const { chromium } = require('playwright');
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
require('dotenv').config();

// Telegram bot token
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true, autoStop: true });

//amazonurl
const amazonUrl = 'https://www.amazon.com/fmc/everyday-essentials-category?_encoding=UTF8&node=16322721&fpw=new&fpl=fresh&ref_=pd_bap_d_eemb_p_d_ba_16322721_static_i';

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
