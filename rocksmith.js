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

    const getRowSpanIndexes = arr => {
      const data = arr.filter(elem => elem.rowspan);
      return data.map(item => item.index);
    };

    const rowspanCells = arr => arr.filter(elem => elem.rowspan);

    const allData = {};
    const rows = getRowsArray('tbody tr:nth-child(-n+15)');

    const cellStatus = [
      {index: 0, text: '', rowspan: 0},
      {index: 1, text: '', rowspan: 0},
      {index: 2, text: '', rowspan: 0},
      {index: 3, text: '', rowspan: 0},
      {index: 4, text: '', rowspan: 0},
      {index: 5, text: '', rowspan: 0},
      {index: 6, text: '', rowspan: 0},
      {index: 7, text: '', rowspan: 0}
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
      rows.forEach((row, rowIndex) => {
        debugger;
        let rowData = [];
        let rowCells = convertToArray(getCellsArray(row));
        if (rowCells.length < 8) {
          let indexes = getRowSpanIndexes(cellStatus);
          indexes.forEach(rowIndex => rowCells.splice(rowIndex, 0, {innerText: getCellStatus(rowIndex).text}))
        }
        let rowCellsText = getCellsTextArray(rowCells);

        rowCells.forEach((cell, cellIndex) => {
          if (getCellStatus(cellIndex).rowspan) { //cellStatus has rowspan > 0
            rowData.push(rowCellsText[cellIndex]);
            setCellRowspan(cellIndex, getCellStatus(cellIndex).rowspan - 1)
          }
          else if (cell.getAttribute('rowspan')) { //td has rowspan attribute
            setCellRowspan(cellIndex, cell.getAttribute('rowspan') - 1);
            setCellContent(cellIndex, cell.innerText);
            rowData.push(rowCellsText[cellIndex])
          }
          else { //cellStatus has rowspan = 0 and td does not have rowspan attribute
            rowData.push(rowCellsText[cellIndex])
          }
        });
        allData[rowIndex] = removeUnwantedText(rowData);
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
