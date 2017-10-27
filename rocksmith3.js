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

    const cellWithRowspan = (cell, rowIndex, text) => {
      debugger;
      let num = cell.getAttribute('rowspan') - 1;
      let cellIndex = cell.cellIndex;

      while (num > 0) {
        rowIndex += 1;
        cellObject[rowIndex].splice(cellIndex, 0, text);
        num -= 1;
      };
    }

    const replaceTextInCellWithCurrentText = (cell, rowIndex) => {
      cellObject[rowIndex][cell.cellIndex] = cell.innerText;
    }

    const rowsArr = getRowsArray('tbody tr:nth-child(-n+11)');
    buildCellObject(rowsArr);

    cellObject.forEach((row, rowIndex) => {
      row.forEach(cell => {
        debugger;
        if(doesCellHaveRowspan(cell)) {
          cellWithRowspan(cell, rowIndex, cell.innerText);
          replaceTextInCellWithCurrentText(cell, rowIndex)
        } else {
          replaceTextInCellWithCurrentText(cell, rowIndex)
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
