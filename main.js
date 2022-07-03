const puppeteer = require('puppeteer');
const colors = require('colors');

const { saveData, sleep, printData, getNewVids } = require('./utils');

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
  // in case youtube loads more than 20 videos. (the min part)
  for (let i = 0; i < Math.min(titles.length, 20); i++) {
    data.push({ title: titles[i], link: links[i], timeAgo: times[i] });
  }

  return data;
}

async function main() {
  const SEARCH_PARAM = 'caruana';
  const BASE_URL = `https://www.youtube.com/results?search_query=${SEARCH_PARAM}&sp=CAI%253D`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(BASE_URL);

  try {
    await page.click(
      '#content > div.body.style-scope.ytd-consent-bump-v2-lightbox > div.eom-buttons.style-scope.ytd-consent-bump-v2-lightbox > div:nth-child(1) > ytd-button-renderer:nth-child(1) > a'
    );
  } catch (err) {
    console.log('No accept cookies buton');
  }

  // wait for client-side JS
  await sleep(750);

  const data = await page.evaluate(parseData);
  console.log(data.length);

  const newVids = await getNewVids(data, SEARCH_PARAM);
  if (newVids.length === 0) {
    console.log('No new videos.'.red);
  } else {
    await saveData(data, SEARCH_PARAM);
    printData(newVids);
  }

  await browser.close();
}

async function start(seconds) {
  console.log('Starting...'.bgRed);
  await main();
  console.log(`Done, waiting ${seconds}.`.bgRed);

  setInterval(async () => {
    console.log('Starting...'.bgRed);
    await main();
    console.log(`Done, waiting ${seconds}.`.bgRed);
  }, seconds * 1000);
}

start(20);
