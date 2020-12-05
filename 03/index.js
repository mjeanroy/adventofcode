const fs = require('fs');

function compute(file, slopRight = 3, slopDown = 1) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const rows = data.split(/\r?\n/);
      const counter = computeWithSlops(rows, slopRight, slopDown);
      resolve(counter);
    });
  });
}

function computeProduct(file, slops) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
  
      const rows = data.split(/\r?\n/);

      let result = 1;

      for (let i = 0; i < slops.length; ++i) {
        const slop = slops[i];
        const slopRight = slop[0];
        const slopDown = slop[1];
        result *= computeWithSlops(rows, slopRight, slopDown);
      }

      resolve(result);
    });
  });
}

function computeWithSlops(rows, slopRight, slopDown) {
  let counter = 0;
  let x = 0;

  const nbRows = rows.length;
  const upperBound = nbRows - slopDown;
  for (let i = 0; i < upperBound; i += slopDown) {
    const nextRow = rows[i + slopDown];
    const columns = nextRow.split('');

    // Compute next right position, take care of repeating if out of bounds.
    x = (x + slopRight) % columns.length;

    // Check if we are on a tree.
    if (nextRow[x] === '#') {
      counter++;
    }
  }

  return counter;
}

module.exports = {
  compute,
  computeProduct,
};
