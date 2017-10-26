const puppeteer = require('puppeteer');

const scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://en.wikipedia.org/wiki/List_of_downloadable_songs_for_Rocksmith');
  await page.waitFor(1000);

  const result = await page.evaluate(() => {
    const getRowsArray = selector => document.querySelectorAll(selector);

    const getCellsArray = row => row.cells;

    const convertToArray = arr => Array.prototype.slice.call(arr);

    const getCellsTextArray = arr => arr.map(item => item.innerText)

    const getCellStatus = index => cellStatus[index];

    const setCellContent = (index, content) => cellStatus[index].text = content;

    const setCellRowspan = (index, num) => cellStatus[index].rowspan = num;

    const removeUnwantedText = (arr, startIndex = 0, index1 = 5, index2 = 7) => {
      return arr.slice(startIndex, index1).concat(arr.slice(index1 + 1, index2));
    };

    const rowspanCells = arr => arr.filter(elem => elem.rowspan);

    const allData = {};
    const rows = getRowsArray('tbody tr:nth-child(-n+5)');

    const cellStatus = [
      {text: '', rowspan: 0},
      {text: '', rowspan: 0},
      {text: '', rowspan: 0},
      {text: '', rowspan: 0},
      {text: '', rowspan: 0},
      {text: '', rowspan: 0},
      {text: '', rowspan: 0},
      {text: '', rowspan: 0}
    ];

    // var row0Cells = convertToArray(getCellsArray(rows[0]));
    // var row1Cells = convertToArray(getCellsArray(rows[1]));
    // var row2Cells = convertToArray(getCellsArray(rows[2]));
    // var row3Cells = convertToArray(getCellsArray(rows[3]));
    // var row4Cells = convertToArray(getCellsArray(rows[4]));
    // var row0CellsText = getCellsTextArray(row0Cells);
    // var row1CellsText = getCellsTextArray(row1Cells);
    // var row2CellsText = getCellsTextArray(row2Cells);
    // var row3CellsText = getCellsTextArray(row3Cells);
    // var row4CellsText = getCellsTextArray(row4Cells);

    const populateDataObj = () => {
      rows.forEach((row, index) => {
        let rowData = [];
        let rowCells = convertToArray(getCellsArray(row));
        let rowCellsText = getCellsTextArray(rowCells);

        rowCells.forEach((cell, index) => {
          if (getCellStatus(index).rowspan) { //cellStatus has rowspan > 0
            rowData.push(getCellStatus(index).text);
            setCellRowspan(index, getCellStatus(index).rowspan - 1)
          }
          else if (cell.getAttribute('rowspan')) { //td has rowspan attribute
            setCellRowspan(index, cell.getAttribute('rowspan'));
            setCellContent(index, cell.innerText);
            rowData.push(rowCellsText[index])
          }
          else { //cellStatus has rowspan = 0 and td does not have rowspan attribute
            rowData.push(rowCellsText[index])
          }
        });
        allData[index] = removeUnwantedText(rowData);
      });
    }

    populateDataObj();
    //iterate over each row's cells
    //get each cells innerText and create a new array
    //if cell status has any rowspan > 0
      //splice insert the content into the new array at the index
      //rowspan - 1
    //if cell has attriubte 'rowspan' set cellStatus conent and rowspan number
    //cell.innerText.match(/[^"]/g).join(''));
    return allData;
  });

  browser.close();
  return result;
};

scrape().then(value => {
  console.log(value);
});
