const puppeteer = require('puppeteer');
const colors = require('colors');

const { saveData, sleep, printData, getNewVids } = require('./utils');

const SEARCH_PARAM = 'caruana';
const BASE_URL = `https://www.youtube.com/results?search_query=${SEARCH_PARAM}&sp=CAI%253D`;

function parseData() {
  const titles = Array.from(
    document.querySelectorAll('#video-title > yt-formatted-string')
  ).map((el) => el.textContent);

  const links = Array.from(document.querySelectorAll('#video-title')).map(
    (el) => el.href
  );

  const times = Array.from(
    document.querySelectorAll('#metadata-line > span:nth-child(2)')
  ).map((el) => el.outerText);

  const data = [];
  for (let i = 0; i < titles.length; i++) {
    data.push({ title: titles[i], link: links[i], timeAgo: times[i] });
  }

  return data;
}

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(BASE_URL);

  await page.click(
    '#content > div.body.style-scope.ytd-consent-bump-v2-lightbox > div.eom-buttons.style-scope.ytd-consent-bump-v2-lightbox > div:nth-child(1) > ytd-button-renderer:nth-child(1) > a'
  );

  // wait for client-side JS
  await sleep(750);

  const data = await page.evaluate(parseData);
  const newVids = await getNewVids(data, SEARCH_PARAM);
  await saveData(data, `${SEARCH_PARAM}`);
  printData(newVids);
  await browser.close();
}

main();
