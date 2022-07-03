const fs = require('fs/promises');

const sleep = async (ms) => new Promise((res) => setTimeout(res, ms));

async function saveData(data, filename = 'data') {
  await fs.writeFile(`./data/${filename}.json`, JSON.stringify(data));
}

async function getData(filename = 'data') {
  try {
    const data = await fs.readFile(`./data/${filename}.json`);
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

module.exports = { sleep, saveData, getData };
