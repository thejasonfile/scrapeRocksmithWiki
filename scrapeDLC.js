const puppeteer = require('puppeteer');

const scrape = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://en.wikipedia.org/wiki/List_of_downloadable_songs_for_Rocksmith');
  await page.waitFor(1000);

  const result = await page.evaluate(() => {
    const spanTracker = [{}, {}, {}, {}, {}, {}, {}, {}];
    const convertToArray = arr => Array.prototype.slice.call(arr);
    const data = {};

    const buildRowsArray = selector => {
      const rows = document.querySelectorAll(selector);
      return convertToArray(rows);
    };

    const rowsArray = buildRowsArray('tbody tr');

    rowsArray.forEach((row, index) => {
      const resultArray = [];
      const { cells } = row;
      const cellsArray = convertToArray(cells);

      const expandCellsArray = (span, addNum) => {
        spanTracker.forEach(obj => {
          if (obj[span] > 0) {
            const newObj = obj;
            const objIndex = spanTracker.indexOf(newObj);
            const objText = spanTracker[objIndex].text;
            cellsArray.splice(objIndex + 0, 0, objText);
            newObj[span] -= 1;
          }
        });
      };

      const pushToResult = arr => {
        arr.forEach(cell => {
          if (typeof cell === 'string') {
            resultArray.push(cell);
          } else {
            resultArray.push(cell.innerText);
          }
        });
      };

      const fixSongString = arr => {
        const fixedArr = arr;
        fixedArr[0] = fixedArr[0].match(/[^"]/g).join('');
        return fixedArr;
      };

      const getCellsWithSpan = span => cellsArray.filter(cell => cell[span] > 1);

      //rowspan
      const cellsWithRowspan = getCellsWithSpan('rowSpan');

      expandCellsArray('rowspan', 0);

      cellsWithRowspan.forEach(cell => {
        const cellIndex = cellsArray.indexOf(cell);
        spanTracker[cellIndex].rowspan = cell.rowSpan - 1;
        spanTracker[cellIndex].text = cell.innerText;
      });

      //colspan
      const cellsWithColspan = getCellsWithSpan('colSpan');

      expandCellsArray('colspan', 1);

      cellsWithColspan.forEach(cell => {
        const cellIndex = cellsArray.indexOf(cell);
        spanTracker[cellIndex].colspan = cell.rowSpan - 1;
        spanTracker[cellIndex].text = cell.innerText;
        cellsArray.splice(cellIndex + 1, 0, cell.innerText);
      });

      pushToResult(cellsArray);

      fixSongString(resultArray);

      data[index] = resultArray;
    });

    return data;
  });

  browser.close();
  return result;
};

scrape().then(value => {
  console.log(value);
});
