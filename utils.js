const fs = require('fs/promises');

const sleep = async (ms) => new Promise((res) => setTimeout(res, ms));

async function saveData(data) {
  await fs.writeFile('./data/data.json', JSON.stringify(data));
}

async function getData(path = './data/data.json') {
  const data = await fs.readFile(path);
  return JSON.parse(data);
}

module.exports = { sleep, saveData, getData };
