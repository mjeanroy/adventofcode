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
 * Compute the index of the last operation before finding the loop in
 * the list of operations.
 *
 * @param {string} file File path.
 * @returns {Promise<number>} The last operation index before the loop.
 */
function compute(file) {
  return readLines(file).then((lines) => {
    const operations = scanOperation(lines);
    const nbOperations = operations.length;

    let acc = 0;
    let idx = 0;

    while (idx >= 0 && idx < nbOperations) {
      const op = operations[idx];
      if (op.counter > 0) {
        return acc;
      }

      const id = op.id;
      if (id === 'acc') {
        acc += op.value;
        idx++;
      } else if (id === 'jmp') {
        idx += op.value;
      } else if (id === 'nop') {
        idx++;
      }

      op.counter++;
    }

    // If we did not resolve, then it is a failure
    throw new Error('Cannot find acc...');
  });
}

/**
 * Scan all operations described by given input.
 *
 * @param {Array<string>} lines All the lines describing operations.
 * @returns {Array<Object>} All operations.
 */
function scanOperation(lines) {
  return lines.map((line) => {
    const parts = line.split(' ');
    return {
      id: parts[0].trim(),
      value: toInt(parts[1].trim()),
      counter: 0,
    };
  });
}

/**
 * Parse given input to a number.
 *
 * @param {string} value The input.
 * @returns {number} The number.
 */
function toInt(value) {
  const sign = value.charAt(0);
  const nb = Number(value.slice(1));
  return sign === '-' ? nb * -1 : nb;
}

module.exports = {
  compute,
};
