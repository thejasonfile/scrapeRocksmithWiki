const rowspanTracker = [
  { index: 0, text: '', rowspan: 0 },
  { index: 1, text: '', rowspan: 0 },
  { index: 2, text: '', rowspan: 0 },
  { index: 3, text: '', rowspan: 0 },
  { index: 4, text: '', rowspan: 0 },
  { index: 5, text: '', rowspan: 0 },
  { index: 6, text: '', rowspan: 0 },
  { index: 7, text: '', rowspan: 0 },
];

const result = {};

const convertToArray = arr => Array.prototype.slice.call(arr);

const getRows = selector => convertToArray(document.querySelectorAll(selector));

const getCells = rowsArr => rowsArr.map(row => convertToArray(row.cells));

const getCellsWithRowspan = arr => arr.filter(elem => elem.getAttribute('rowspan'));

const getCellsWithColspan = arr => arr.filter(elem => elem.getAttribute('colspan'));

const getIndexNumsFromCells = arr => arr.map(cell => cell.cellIndex);

const rowspanHandler = () => {};

const colspanHandler = () => {};

const insertNewObject = () => {};

const addInfoToSpanTracker = () => {};

const subtractFromSpanTracker = () => {};

//get rows
//convert rows to cells array
//each row
//if colspan exists
//get index and text
//splice new object containing text into row at index + 1
//check spanTracker for rowspan
//if rowspan > 0
//splice new object containing text into row at index
//subtract rowspan amount from spanTracker
//check row for rowspan attribute
//add index and rowspan amount - 1 and text to spanTracker

const rowsArr = getRows('tbody tr:nth-child(-n+12):not(:first-child)');

//this generates result object
for (let i = 0; i < rowsArr.length; i += 1) {
  const rowArr = convertToArray(rowsArr[i].cells);
  rowspanTracker.forEach((cellObj) => {
    if (cellObj.rowspan > 0) {
      rowArr.splice(cellObj.index, 0, {});
    }
  });
  for (let j = 0; j < rowArr.length; j += 1) {
    debugger;
    if (j === 0) {
      result[i] = [];
    }

    if (rowspanTracker[j].rowspan > 0) {
      result[i][j] = rowspanTracker[j].text;
      rowspanTracker[j].rowspan -= 1;
    } else if (rowArr[j].getAttribute('rowspan')) {
      rowspanTracker[j].index = j;
      rowspanTracker[j].text = rowArr[j].innerText;
      rowspanTracker[j].rowspan = rowArr[j].getAttribute('rowspan') - 1;
      result[i].push(rowArr[j].innerText);
    } else {
      result[i].push(rowArr[j].innerText);
    }
  }
}
