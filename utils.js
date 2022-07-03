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

function printData(data) {
  data.forEach(({ title, link, timeAgo }) => {
    console.log(
      `${title} ${'posted'.gray} ${timeAgo.green} ${'->'.gray} ${link.cyan}\n`
    );
  });
}

async function archive(name, data) {
  let str = '';
  data.forEach(
    ({ title, link, timeAgo }) =>
      (str += `${title} 'posted' ${timeAgo} -> ${link}\n`)
  );
  await fs.appendFile(`./archive/${name}.txt`, str);
}

// doesn't follow the single resposibility principle
async function getNewVids(videos, name) {
  const oldVideos = await getData(name);
  if (oldVideos.length === 0) {
    await archive(name, videos);
    return videos;
  }

  // HACK/REFACTOR
  const newVideos = [];
  const titles = oldVideos.map((vid) => vid.title);

  for (let i = 0; i < videos.length; i++) {
    if (!titles.includes(videos[i].title)) {
      newVideos.push(videos[i]);
    }
  }

  archive(name, newVideos);
  return newVideos;
}

module.exports = { sleep, saveData, getData, getNewVids, printData };
