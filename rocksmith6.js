const spanTracker = [{}, {}, {}, {}, {}, {}, {}, {}];

const convertToArray = arr => Array.prototype.slice.call(arr);

const buildRowsArray = selector => {
  const rows = document.querySelectorAll(selector);
  return convertToArray(rows);
};

const getResult = () => {
  const result = {};
  //const rowsArray = buildRowsArray('tbody tr:nth-child(-n+20):not(:first-child');
  const rowsArray = buildRowsArray('tbody tr:nth-child(n+950)');
  //const rowsArray = buildRowsArray('tbody tr:not(:first-child');

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

    //check cells for any rowspan values
    const cellsWithRowspan = cellsArray.filter(cell => cell.rowSpan > 1);

    //if there are any cells with rowspan add them to spanTracker
    cellsWithRowspan.forEach(cell => {
      const cellIndex = cellsArray.indexOf(cell);
      spanTracker[cellIndex].rowspan = cell.rowSpan - 1;
      spanTracker[cellIndex].text = cell.innerText;
    });

    //check for exising colspan values to add to cellsArray
    spanTracker.forEach(obj => {
      if (obj.colspan > 0) {
        const newObj = obj;
        const objIndex = spanTracker.indexOf(newObj);
        const objText = spanTracker[objIndex].text;
        cellsArray.splice(objIndex + 1, 0, objText);
        newObj.colspan -= 1;
      }
    });

    //check cells for any colspan values
    const cellsWithColspan = cellsArray.filter(cell => cell.colSpan > 1);

    //if there are any cells with colspan expand cellsArr and add them to spanTracker
    cellsWithColspan.forEach(cell => {
      const cellIndex = cellsArray.indexOf(cell);
      cellsArray.splice(cellIndex + 1, 0, cell.innerText);
      spanTracker[cellIndex].colspan = cell.colSpan;
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
    console.log(resultArray);
    result[index] = resultArray;
  });
  return result;
};

getResult();
