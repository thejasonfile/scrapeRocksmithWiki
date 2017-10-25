const puppeteer = require('puppeteer');

const scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://en.wikipedia.org/wiki/List_of_downloadable_songs_for_Rocksmith');
  await page.waitFor(1000);

  const result = await page.evaluate(() => {
    const data = [];
    const rows = document.querySelectorAll('tbody tr');
    const lastSong = {data: '', rowspan: 0};
    const lastArtist = {data: '', rowspan: 0};
    const lastReleaseYear = {data: '', rowspan: 0};
    const lastTuning = {data: '', rowspan: 0};
    const lastPack = {data: '', rowspan: 0};
    const lastDate = {data: '', rowspan: 0};

    const currentElemHasRowspan = (elem) => {
      return elem.getAttribute('rowspan');
    }

    const testColumn = (elem, i, columnNumber) => {
      if (elem.rowspan > 0) {
        elem.rowspan -= 1;
        return elem.data;
      } else if (currentElemHasRowspan) {
        elem.data = rows[i].querySelector(`td:nth-of-type(${columnNumber})`).innerText.match(/[^"]/g).join('');
        elem.rowspan = parseInt(rows[i].querySelector(`td:nth-of-type(${columnNumber})`).getAttribute('rowspan')) - 1;
        return elem.data
      } else {
        return rows[i].querySelector(`td:nth-of-type(${columnNumber})`).innerText.match(/[^"]/g).join('');
      }
    }

    for(var i = 0; i <= rows.length - 1; i++) {
      const song = testColumn(lastSong, i, 1);
      const artist = testColumn(lastArtist, i, 2);
      const year = testColumn(lastReleaseYear, i, 3);
      // currentRowInfo.releaseYear = row.querySelector('td:nth-of-type(3)').innerText;
      // currentRowInfo.tuning = '',
      // currentRowInfo.pack = '',
      // currentRowInfo.date = ''

      data.push({song, artist});
    }

    return data;
  });

  browser.close();
  return result;
};

scrape().then(value => {
  console.log(value);
});
