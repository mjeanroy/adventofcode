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
 * Count how many trees are encountered while running on the
 * given grid.
 *
 * @param {string} file File path describing the grid.
 * @param {number} slopRight The slop right value at each move, defaults to `3`.
 * @param {number} slopDown The slop down value at each move, defaults to `1`.
 * @returns {Promise<number>} The number of trees found while parsing the grid.
 */
function compute(file, slopRight = 3, slopDown = 1) {
  return readLines(file).then((rows) => {
    return computeWithSlops(rows, slopRight, slopDown);
  });
}

/**
 * Count how many trees are encountered while running on the
 * given grid for each slops, then compute a product of these values.
 *
 * @param {string} file File path describing the grid.
 * @param {Array<number>} slops The slops configuration.
 * @returns {Promise<number>} The final product.
 */
function computeProduct(file, slops) {
  return readLines(file).then((rows) => {
    let result = 1;

    for (let i = 0; i < slops.length; ++i) {
      const slop = slops[i];
      const slopRight = slop[0];
      const slopDown = slop[1];
      result *= computeWithSlops(rows, slopRight, slopDown);
    }

    return result;
  });
}

/**
 * Count the number of trees met while parsing the grid with given slop values.
 *
 * @param {Array<Array<string>>} rows The grid.
 * @param {number} slopRight The slop right value.
 * @param {number} slopDown The slop down value.
 * @returns {number} The number of trees met while parsing the grid.
 */
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
