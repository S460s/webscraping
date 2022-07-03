const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const colors = require('colors');

const SEARCH_PARAM = 'caruana';
const BASE_URL = `https://www.youtube.com/results?search_query=${SEARCH_PARAM}&sp=CAI%253D`;

const sleep = async (ms) => new Promise((res) => setTimeout(res, ms));

async function saveData(data) {
  await fs.writeFile('./data/data.json', JSON.stringify(data));
}

async function getData(path = './data/data.json') {
  const data = await fs.readFile(path);
  return JSON.parse(data);
}

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

  const old_data = await getData();
  const data = [];
  for (let i = 0; i < titles.length; i++) {
    if(old_data[i].title !== titles[i])
      data.push({ title: titles[i], link: links[i], timeAgo: times[i] });
  }

  return data;
}


function printData(data) {
  if(data.length === 0){
    console.log('No new videos.');
  }

  data.forEach(({ title, link, timeAgo }) => {
    console.log(
      `${title} ${'posted'.gray} ${timeAgo.green} ${'->'.gray} ${link.cyan}\n`
    );
  });
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
  await saveData(data);
  printData(data);
  await browser.close();
}

main();
