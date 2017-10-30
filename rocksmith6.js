const spanTracker = [{}, {}, {}, {}, {}, {}, {}, {}];

const convertToArray = arr => Array.prototype.slice.call(arr);

const buildRowsArray = selector => {
  const rows = document.querySelectorAll(selector);
  return convertToArray(rows);
};

const getResult = () => {
  const result = {};
  const rowsArray = buildRowsArray('tbody tr:nth-child(-n+20):not(:first-child');

  rowsArray.forEach((row, index) => {
    const resultArray = [];
    const { cells } = row;
    const cellsArray = convertToArray(cells);

    //check for existing rowspan values to expand cellsArray
    spanTracker.forEach(obj => {
      if (obj.rowspan > 0) {
        const newObj = obj;
        const objIndex = spanTracker.indexOf(newObj);
        const objText = spanTracker[objIndex].text;
        cellsArray.splice(objIndex, 0, objText);
        newObj.rowspan -= 1;
      }
    });

    //check cells for any rowspan values and add them to spanTracker
    const cellsWithRowspan = cellsArray.filter(cell => cell.rowSpan > 1);

    //if there are any cells with rowspan add them to spanTracker
    cellsWithRowspan.forEach(cell => {
      const cellIndex = cellsArray.indexOf(cell);
      spanTracker[cellIndex].rowspan = cell.rowSpan - 1;
      spanTracker[cellIndex].text = cell.innerText;
    });

    //push text from cellsArray to result Array
    cellsArray.forEach(cell => {
      if (typeof cell === 'string') {
        resultArray.push(cell);
      } else {
        resultArray.push(cell.innerText);
      }
    });

    result[index] = resultArray;
    console.log(result);
    debugger;

  });
  //debugger;
  return result;
};

getResult();
