const { chromium } = require('playwright');
const cheerio = require('cheerio');

// Selected code
async function scrapeAmazonProducts(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Get the HTML content of the page
  const content = await page.content();

  // Load the content into Cheerio for easier parsing
  const $ = cheerio.load(content);

  // Example: Extract all product details from the page (modify selectors as needed)
  let products = [];

  $('.s-main-slot .s-result-item').each((index, element) => {
    const title = $(element).find('h2 .a-link-normal').text().trim();
    const price = $(element).find('.a-price-whole').text().trim();
    const rating = $(element).find('.a-icon-alt').text().trim();
    const productUrl = 'https://www.amazon.com' + $(element).find('h2 a').attr('href');

    products.push({
      title,
      price,
      rating,
      url: productUrl,
    });
  });

  await browser.close();

  return products;
}

// Unit test
describe('scrapeAmazonProducts', () => {
  it('should return an empty array when no products are found', async () => {
    const url = 'https://www.amazon.com/invalid-url';
    const products = await scrapeAmazonProducts(url);

    expect(products.length).toBe(0);
  });
});

const { chromium } = require('playwright');
const cheerio = require('cheerio');

// Selected code from the open file
async function scrapeAmazonProducts(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Get the HTML content of the page
  const content = await page.content();

  // Load the content into Cheerio for easier parsing
  const $ = cheerio.load(content);

  // Example: Extract all product details from the page (modify selectors as needed)
  let products = [];

  $('.s-main-slot .s-result-item').each((index, element) => {
    const title = $(element).find('h2 .a-link-normal').text().trim();
    const price = $(element).find('.a-price-whole').text().trim();
    const rating = $(element).find('.a-icon-alt').text().trim();
    const productUrl = 'https://www.amazon.com' + $(element).find('h2 a').attr('href');

    products.push({
      title,
      price,
      rating,
      url: productUrl,
    });
  });

  await browser.close();

  return products;
}

// Unit test for the scrapeAmazonProducts function
describe('scrapeAmazonProducts', () => {
  it('should handle cases where the product details are not in the expected format', async () => {
    // Mock the content to include incorrectly formatted product details
    const mockContent = `
      <div class="s-main-slot">
        <div class="s-result-item">
          <h2><a class="a-link-normal">Incorrect Product Title</a></h2>
          <span class="a-price-whole">$123</span>
          <span class="a-icon-alt">4.5 stars</span>
          <a href="https://www.amazon.com/product-url">Product URL</a>
        </div>
      </div>
    `;

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(mockContent);

    const products = await scrapeAmazonProducts('https://www.amazon.com');

    expect(products).toEqual([
      {
        title: 'Incorrect Product Title',
        price: '$123',
        rating: '4.5 stars',
        url: 'https://www.amazon.com/product-url',
      },
    ]);

    await browser.close();
  });
});