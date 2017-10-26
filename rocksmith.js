const puppeteer = require('puppeteer');

const scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://en.wikipedia.org/wiki/List_of_downloadable_songs_for_Rocksmith');
  await page.waitFor(1000);

  const result = await page.evaluate(() => {
    const getRows = () => {
      return document.querySelectorAll('tbody tr');
    };

    const getCells = (row) => {
      return row.cells
    };

    const getCellStatus = (num) => {
      return cellStatus[num];
    }

    const setCellData = (index, data) => {
      cellStatus[index].data = data;
    }

    const setCellRowspan = (index, num) => {
      cellStatus[index].rowspan = num;
    }

    const data = [];
    const rows = getRows();

    const cellStatus = {
      0: {data: '', rowspan: 0},
      1: {data: '', rowspan: 0},
      2: {data: '', rowspan: 0},
      3: {data: '', rowspan: 0},
      4: {data: '', rowspan: 0},
      7: {data: '', rowspan: 0}
    };

    rows.forEach(row => {
      let cells = getCells(row);
      cells = Array.prototype.slice.call( cells )

      const cellResult = cells.forEach((cell, index) => {
        debugger;
        if (cell.innerText === 'N/A' || cell.innerText === "") {
          return null;
        } else if (getCellStatus(index).rowspan > 0) {
          setCellRowspan(index, getCellStatus(index).rowspan - 1);
          return getCellStatus(index).data
        } else if (cell.getAttribute('rowspan')) {
          setCellData(index, cell.innerText.match(/[^"]/g).join(''));
          setCellRowspan(index, cell.getAttribute('rowspan') - 1)
          return getCellStatus(index).data;
        } else {
          return cell.innerText.match(/[^"]/g).join('')
        }
      });
      data.push(cellResult);
    });
  });

  browser.close();
  return result;
};

scrape().then(value => {
  console.log(value);
});
