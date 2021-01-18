/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Mickael Jeanroy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const {readLines} = require('../00/index');

/**
 * Compute the highest seat ID in given boardings pass.
 *
 * @param {string} file The file path.
 * @returns {Promise<number>} The highest seat ID.
 */
function computeHighestSeat(file) {
  return readLines(file).then((boardingsPass) => {
    let max = -1;

    for (let i = 0; i < boardingsPass.length; ++i) {
      max = Math.max(max, computeSeatId(boardingsPass[i]));
    }

    return max;
  });
}

/**
 * Compute the missing seat ID in given boardings pass.
 *
 * @param {string} file The file path.
 * @returns {Promise<number>} The highest seat ID.
 */
function computeMissingSeat(file) {
  return readLines(file).then((boardingsPass) => {
    const seats = new Set();

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
        return i;
      }
    }

    throw new Error('Cannot find missing seat...');
  });
}

/**
 * Compute seat ID in given boarding pass.
 *
 * @param {string} boardingPass The boarding pass.
 * @returns {number} The seat ID.
 */
function computeSeatId(boardingPass) {
  const row = computeRowNumber(boardingPass.slice(0, 7));
  const column = computeColumnNumber(boardingPass.slice(7, 10));
  return row * 8 + column;
}

/**
 * Compute the row number in given boarding pass.
 *
 * @param {Array<string>} rows The rows in a boarding pass.
 * @returns {number} The row number.
 */
function computeRowNumber(rows) {
  return binaryLookup(rows, 0, 127, 'F', 'B');
}

/**
 * Compute the column number in given boarding pass.
 *
 * @param {Array<string>} columns The columns in a boarding pass.
 * @returns {number} The column number.
 */
function computeColumnNumber(columns) {
  return binaryLookup(columns, 0, 7, 'L', 'R');
}

/**
 * Compute a binary lookup from a given [start, end] values.
 * In given input, each value is char indicating if we should "keep" the left or right
 * in the given [start, end] positions.
 *
 * @param {Array<string>} inputs The inputs.
 * @param {number} start The starting point.
 * @param {number} end The ending point.
 * @param {string} lowerChar The lower char.
 * @param {string} upperChar The upper char.
 * @returns {number} The founded number.
 */
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
