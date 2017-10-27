const puppeteer = require('puppeteer');

const scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://en.wikipedia.org/wiki/List_of_downloadable_songs_for_Rocksmith');
  await page.waitFor(1000);

  const result = await page.evaluate(() => {

    const cellStatus = [];
    const cellObject = [];

    const convertToArray = arr => Array.prototype.slice.call(arr);

    const getRowsArray = selector => {
      let HTMLrows = document.querySelectorAll(selector);
      let rowsArr = convertToArray(HTMLrows);
      return rowsArr
    }

    const buildCellObject = rowArr => rowArr.forEach(row => cellObject.push(convertToArray(row.cells)));

    const getCellsArray = row => {
      let HTMLcells = row.cells;
      let arr = convertToArray(HTMLcells);
      return arr;
    }

    const addElementsToCellsArray = arr => {
      let newArr = arr;
      arr.forEach((cell, index) => {
        if (cellStatus[index] && cellStatus[index].rowspan > 0) {
          newArr.splice(index, 0, newArr[index].text);
        } else if (cellStatus[index] && cellStatus[index].colspan > 0) {
          newArr.splice(index + 1, 0, newArr[index].text);
        }
      });
      return newArr;
    };

    const buildCellStatus = cellsArr => {
      cellsArr = addElementsToCellsArray(cellsArr);
      cellsArr.forEach((cell, index) => {
        if (cellStatus[index] && cellStatus[index].rowspan > 0) {
          cellStatus[index].rowspan -= 1
        } else if (cellStatus[index] && cellStatus[index].colspan > 0) {
            cellStatus[index].colspan -= 1
        } else {
          cellInfoObj = {
            //index: cell.cellIndex,
            text: cell.innerText,
            rowspan: cell.getAttribute('rowspan') - 1,
            colsapn: cell.getAttribute('colspan') - 1
          };
          cellStatus[index] = cellInfoObj;
        };
      });
    };

    const rowsArr = getRowsArray('tbody tr:nth-child(-n+11)');
    buildCellObject(rowsArr);
    cellObject.forEach(cellArr => {
      buildCellStatus(cellArr);
      debugger;
    })

  });

    //
    //
    // const getCellsTextArray = arr => arr.map(item => item.innerText)
    //
    // const getCellText = index => cellStatus[index].text;
    //
    // const getCellRowspan = index => cellStatus[index].rowspan;
    //
    // const getCellColspan = index => cellStatus[index].colspan;
    //
    // const setCellText = (index, content) => cellStatus[index].text = content;
    //
    // const setCellRowspan = (index, num) => cellStatus[index].rowspan = num;
    //
    // const setCellColspan = (index, num) => cellStatus[index].colspan = num;
    //
    // const removeUnwantedText = (arr, startIndex = 0, index1 = 5, index2 = 7) => {
    //   return arr.slice(startIndex, index1).concat(arr.slice(index1 + 1, index2));
    // };
    //
    // const getSpanIndexes = arr => {
    //   const rowSpans = arr.filter(elem => elem.rowspan);
    //   const colSpans = arr.filter(elem => elem.colspan);
    //   return [rowSpans, colSpans];
    // };

    // const rowspanGreaterThanZero = () => {
    //
    // }
    //
    // const colspanGreaterThanZero = () => {
    //
    // }
    //
    // const cellHasRowspanAttribute = () => {
    //
    // }
    //
    // const cellHasColspanAttribute = () => {
    //
    // }

    //const allData = {};


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
