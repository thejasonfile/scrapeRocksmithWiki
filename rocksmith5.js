// const spanTracker = [
//   { index: 0, text: '', rowspan: 0 },
//   { index: 1, text: '', rowspan: 0 },
//   { index: 2, text: '', rowspan: 0 },
//   { index: 3, text: '', rowspan: 0 },
//   { index: 4, text: '', rowspan: 0 },
//   { index: 5, text: '', rowspan: 0 },
//   { index: 6, text: '', rowspan: 0 },
//   { index: 7, text: '', rowspan: 0 }
// ];

const spanTracker = [
  { index: 0, object: '' },
  { index: 1, object: '' },
  { index: 2, object: '' },
  { index: 3, object: '' },
  { index: 4, object: '' },
  { index: 5, object: '' },
  { index: 6, object: '' },
  { index: 7, object: '' },
];

const convertToArray = arr => Array.prototype.slice.call(arr);

const getRows = selector => convertToArray(document.querySelectorAll(selector));

const buildCellsArr = (newArr, rowsArr) => {
  rowsArr.forEach(rowArr => {
    newArr.push(convertToArray(rowArr.cells));
  });
  return newArr;
};

const getExistingRowspans = arr => arr.filter(obj => obj.object);

const spliceRowspansIntoCellArr = (existingRowspansArr, cellArr) => {
  existingRowspansArr.forEach(rowspanObj => {
    cellArr.splice(rowspanObj.object.cellIndex, 0, rowspanObj.object);
  });
};

const getRowspansFromCurrentRow = arr => {
  const newArr = arr.map(obj => {
    if (obj.getAttribute('rowspan')) {
      return obj;
    }
    return null;
  });
  return newArr;
};

const subtractOneFromRowspanValue = arr => {
  const newArr = arr.map(obj => {
    if (obj) {
      const newObj = obj;
      newObj.rowSpan -= 1;
      return newObj;
    }
    return null;
  });
  return newArr;
};

const addCurrentRowspansToTracker = arr => {
  arr.forEach((cell, index) => {
    if (cell) {
      spanTracker[index].index = index;
      spanTracker[index].object = cell;
    }
  });
};

const getDataFromArr = arr => arr.map(cell => cell.innerText || cell);



const result = [];

const buildRowsArr = getRows('tbody tr:nth-child(-n+20):not(:first-child)');

const cellsArr = buildCellsArr([], buildRowsArr);
