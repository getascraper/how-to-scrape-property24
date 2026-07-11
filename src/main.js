import 'dotenv/config';
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function run() {
  if (!process.env.APIFY_TOKEN) {
    throw new Error('APIFY_TOKEN is not set. Copy .env.example to .env and add your token.');
  }

  const input = {
    searchLocations: ['Cape Town', 'Sandton'],
    country: 'south_africa',
    listingType: 'sale',
    maxItems: 100,
    minBedrooms: 2,
    deepScrape: true,
    proxyConfiguration: {
      useApifyProxy: true,
    },
  };

  const { defaultDatasetId } = await client.actor('getascraper/property24-scraper').call(input);

  const { items } = await client.dataset(defaultDatasetId).listItems({ limit: 10 });

  console.table(items);
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
