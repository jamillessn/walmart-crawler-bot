# Walmart Crawler Telegram Bot

This Telegram bot automatically crawls product data from Walmart using Playwright and sends real-time product updates to users on Telegram. It allows users to trigger product fetching with the `/start` command and stop the bot with `/stop`. The bot periodically scrapes Walmart product listings and sends updates at regular intervals (every 2 minutes) using Node.js and node-cron.

  ## Table of Contents
  - [Features](#features)
  - [Technologies Used](#technologies)
  - Usage
  - Environment Variables
  - Commands

  ## Features
  - 🛒 Automated Web Scraping: Fetches live product information from Walmart using Playwright, including product title, price, and link.
  - 💬 Telegram Bot Integration: Users can start and stop the bot, receive product updates, and interact with it via Telegram.
  - ⏲ Scheduled Updates: Uses `node-cron` to send regular product updates every 2 minutes.
  - ⚙️ Real-time Interactions: Users can receive updates in real-time by simply typing `/start` on Telegram.
  - 📜 Headless Browser Automation: Playwright provides a headless browser environment to mimic user interactions and extract product data.

  ## Technologies
  - **Node.js:** Backend runtime used for building the Telegram bot.
  - **Playwright:** Web scraping and browser automation tool to extract data from Walmart.
  - **node-telegram-bot-api:** API wrapper for interacting with Telegram.
  - **node-cron:** Cron jobs for scheduling recurring tasks, such as scraping data every 2 minutes.
  - **dotenv:** Loads environment variables from a .env file to securely manage credentials.

  ## Usage
  1. Run the bot
     > `npm run start`
  2. Open your Telegram app and search for t.me/ecommerce-aw-bot. Type `/start` in the chat.
  3. You will start receiving product information fetched from Walmart, with updates sent every 2 minutes.
  4. To stop the bot, type `/stop` in the chat.

  ## Commands
  1. /start - Starts the bot and begins sending product updates.
  2. /stop - 	Stops the bot and ends the current process.
