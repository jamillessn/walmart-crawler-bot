const telegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const TOKEN = process.env.TOKEN

const bot = new telegramBot(TOKEN, { polling: true});

bot.on('message', (message) => {
   let chat_id = message.from.id
   console.log(chat_id);
   bot.sendMessage(chat_id, 'Hello from Ecommerce Bot!');
});