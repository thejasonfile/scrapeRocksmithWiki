const puppeteer = require('puppeteer');

const scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://en.wikipedia.org/wiki/List_of_downloadable_songs_for_Rocksmith');
  await page.waitFor(1000);

  const result = await page.evaluate(() => {

    const cellObject = [];

    const convertToArray = arr => Array.prototype.slice.call(arr);

    const getRowsArray = selector => {
      let HTMLrows = document.querySelectorAll(selector);
      let rowsArr = convertToArray(HTMLrows);
      return rowsArr
    }

    const buildCellObject = rowArr => rowArr.forEach(row => cellObject.push(convertToArray(row.cells)));

    const doesCellHaveRowspan = cell => cell.getAttribute('rowspan')
    const doesCellHaveColspan = cell => cell.getAttribute('colspan')

    const cellWithRowspan = (cell, rowIndex, cellIndex, text) => {
      let num = cell.getAttribute('rowspan') - 1;

      while (num > 0) {
        rowIndex += 1;
        cellObject[rowIndex].splice(cellIndex, 0, text);
        num -= 1;
      };
    }

    const replaceCellObjectWithText = (cell, rowIndex, cellIndex) => {
      cellObject[rowIndex][cellIndex] = cell.innerText;
    }

    const replaceStringWithString = cell => cellObject

    const rowsArr = getRowsArray('tbody tr:nth-child(-n+11)');
    buildCellObject(rowsArr);

    cellObject.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        debugger;
        if (typeof cell === 'string') {
          //null
        } else if (doesCellHaveRowspan(cell)) {
          cellWithRowspan(cell, rowIndex, cellIndex, cell.innerText);
          replaceCellObjectWithText(cell, rowIndex, cellIndex)
        } else {
          replaceCellObjectWithText(cell, rowIndex, cellIndex)
        }
      })
    })

  });

  browser.close();
  return result;
};

scrape().then(value => {
  console.log(value);
});
