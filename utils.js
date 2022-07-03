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
  if (data.length === 0) {
    return console.log('No new videos.');
  }

  data.forEach(({ title, link, timeAgo }) => {
    console.log(
      `${title} ${'posted'.gray} ${timeAgo.green} ${'->'.gray} ${link.cyan}\n`
    );
  });
}

async function archive(name, data) {
  console.log(data);
  let str = '';
  data.forEach(
    ({ title, link, timeAgo }) =>
      (str += `${title} 'posted' ${timeAgo} -> ${link}\n`)
  );
  console.log(str.red);
  await fs.appendFile(`./archive/${name}.txt`, str);
}

async function getNewVids(videos, name) {
  const oldVideos = await getData(name);
  if (oldVideos.length === 0) {
    await archive(name, videos);
    return videos;
  }

  const newVideos = [];

  for (let i = 0; i < videos.length; i++) {
    if (oldVideos[i].title !== videos[i].title) {
      newVideos.push(videos[i]);
    }
  }
  archive(newVideos);
  return newVideos;
}

module.exports = { sleep, saveData, getData, getNewVids, printData };
