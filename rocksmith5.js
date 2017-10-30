const convertToArray = arr => Array.prototype.slice.call(arr);

const spanTracker = [
  { index: 0, text: '', rowspan: 0 },
  { index: 1, text: '', rowspan: 0 },
  { index: 2, text: '', rowspan: 0 },
  { index: 3, text: '', rowspan: 0 },
  { index: 4, text: '', rowspan: 0 },
  { index: 5, text: '', rowspan: 0 },
  { index: 6, text: '', rowspan: 0 },
  { index: 7, text: '', rowspan: 0 }
];

const result = [];

const getRows = selector => convertToArray(document.querySelectorAll(selector));

const buildRowsArr = getRows('tbody tr:nth-child(-n+20):not(:first-child)');

const buildCellsArr = (newArr, rowsArr) => {
  rowsArr.forEach(rowArr => {
    newArr.push(convertToArray(rowArr.cells));
  });
  return newArr;
};

const getExistingRowspans = (arr, query) => arr.filter(obj => obj[query]);

const addCurrentRowspansToTracker = arr => {
  arr.forEach(cell => {
    debugger;
    const index = cell.cellIndex;
    const text = cell.innerText;
    const rowspan = cell.getAttribute('rowspan');
    spanTracker[index] = { index, text, rowspan: rowspan - 1 };
  });
};

const getRowspansFromCurrentRow = arr => arr.filter(cell => typeof cell !== 'string' && cell.getAttribute('rowspan'));

const spliceRowspansIntoCellArr = (existingRowspansArr, cellArr) => {
  existingRowspansArr.forEach(obj => {
    cellArr.splice(obj.index, 0, obj.text);
    spanTracker[obj.index].rowspan -= 1;
  });
};

const getDataFromArr = arr => {
  return arr.map(cell => cell.innerText || cell);
};

const cellsArr = buildCellsArr([], buildRowsArr);

cellsArr.forEach(cellArr => {
  //check for existing rowspan values > 0
  const existingRowspans = getExistingRowspans(spanTracker, 'rowspan');
  //if any exist, splice them into current cellArr
  if (existingRowspans.length > 0) {
    spliceRowspansIntoCellArr(existingRowspans, cellArr);
  }
  //check for existing colspan values in current cellArr
  const currentRowspans = getRowspansFromCurrentRow(cellArr);
  //if any exist, add them to spanTracker
  if (currentRowspans.length > 0) {
    debugger;
    addCurrentRowspansToTracker(currentRowspans);
  }
  result.push(getDataFromArr(cellArr));
});

result;
