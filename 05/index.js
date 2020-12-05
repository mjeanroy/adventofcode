const fs = require('fs');

function computeHighestSeat(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const boardingsPass = data.split('\n');

      let max = -1;

      for (let i = 0; i < boardingsPass.length; ++i) {
        max = Math.max(max, computeSeatId(boardingsPass[i]));
      }

      resolve(max);
    });
  });
}

function computeMissingSeat(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const boardingsPass = data.split('\n');

      let seats = new Set();
      let min = Number.MAX_SAFE_INTEGER;
      let max = -1;

      for (let i = 0; i < boardingsPass.length; ++i) {
        const seatId = computeSeatId(boardingsPass[i]);
        seats.add(seatId);
        min = Math.min(min, seatId);
        max = Math.max(max, seatId);
      }

      // Then go through all and look for the missing one
      for (let i = min; i <= max; ++i) {
        if (!seats.has(i)) {
          resolve(i);
          return;
        }
      }

      reject('Cannot find missing seat...');
    });
  });
}

function computeSeatId(boardingPass) {
  const row = computeRowNumber(boardingPass.slice(0, 7));
  const column = computeColumnNumber(boardingPass.slice(7, 10));
  return row * 8 + column;
}

function computeRowNumber(rows) {
  return binaryLookup(rows, 0, 127, 'F', 'B');
}

function computeColumnNumber(columns) {
  return binaryLookup(columns, 0, 7, 'L', 'R');
}

function binaryLookup(inputs, start, end, lowerChar, upperChar) {
  for (let i = 0; i < (inputs.length - 1); ++i) {
    const c = inputs[i];
    const mid = Math.floor((end - start) / 2);

    if (c === lowerChar) {
      end = start + mid;
    } else if (c === upperChar) {
      start = end - mid;
    }
  }

  return inputs[inputs.length - 1] === lowerChar ? Math.min(start, end) : Math.max(start, end);
}

module.exports = {
  computeHighestSeat,
  computeMissingSeat,
};
