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

const fs = require('fs');

/**
 * Read file and returns a promise, resolved with file content or rejected
 * with appropriate error.
 *
 * @param {string} file The file to read.
 * @return {Promise<string>} The promise, resolved with file content.
 */
function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });
}

/**
 * Read file and returns a promise, resolved with an array of all the lines
 * in the given file.
 *
 * @param {string} file The file to read.
 * @return {Promise<Array<string>>} The promise, resolved with file content.
 */
function readLines(file) {
  return readFile(file).then((data) => (
    data.trim().split('\n')
  ));
}

/**
 * Read file and returns a promise, resolved with an array of all the paragraphs
 * in the given file.
 *
 * @param {string} file The file to read.
 * @return {Promise<string>} The promise, resolved with all paragraphs.
 */
function readParagraphs(file) {
  return readFile(file).then((data) => (
    data.trim().split('\n\n')
  ));
}

/**
 * Convert given string value to the corresponding number.
 *
 * @param {string} value The value.
 * @returns {number} The corresponding number.
 */
function toNumber(value) {
  return Number(value.trim());
}

/**
 * Compute a sum by accumulating all intermediate values returns by the `compute``
 * function.
 *
 * @param {Array<*>} array The given array.
 * @param {function(*, number): number} compute The compute function.
 * @returns {number} The sum.
 */
function sumOf(array, compute) {
  return array.reduce((acc, x, i) => acc + compute(x, i), 0);
}

/**
 * Compute a product by accumulating all intermediate values returns by the `compute``
 * function.
 *
 * @param {Array<*>} array The given array.
 * @param {function(*): number} compute The compute function.
 * @returns {number} The sum.
 */
function productOf(array, compute) {
  return array.reduce((acc, x) => acc * compute(x), 1);
}

module.exports = {
  readFile,
  readLines,
  readParagraphs,
  toNumber,
  sumOf,
  productOf,
};
