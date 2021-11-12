/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2021 Mickael Jeanroy
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

      resolve(data.trim());
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
 * Compute a given value for each element of given iterable, and returns the min computed
 * value.
 *
 * @param {Iterable<*>} iterable Given iterable.
 * @param {function} compute The computation function.
 * @returns {number} The maximum computed value.
 */
function minOf(iterable, compute) {
  let min = Number.MAX_SAFE_INTEGER;
  for (const x of iterable) {
    const value = compute(x);
    if (value < min) {
      min = value;
    }
  }

  return min;
}

/**
 * Compute a given value for each element of given iterable, and returns the max computed
 * value.
 *
 * @param {Iterable<*>} iterable Given iterable.
 * @param {function} compute The computation function.
 * @returns {number} The maximum computed value.
 */
function maxOf(iterable, compute) {
  let max = Number.MIN_SAFE_INTEGER;

  for (const x of iterable) {
    const value = compute(x);
    if (value > max) {
      max = value;
    }
  }

  return max;
}

/**
 * Compute intersection of given sets.
 *
 * @param {Set<*>} set1 First set.
 * @param {Set<*>} set2 Second set.
 * @returns {Set<*>} Intersection of both set.
 */
function intersect(set1, set2) {
  const set = new Set();

  for (const x of set1) {
    if (set2.has(x)) {
      set.add(x);
    }
  }

  return set;
}


/**
 * Generate all permutations of given array.
 * For example:
 *
 * ```
 * const permutations = generateCombinations([1, 2, 3]);
 * //
 * // permutations === [
 * //   [1, 2, 3],
 * //   [1, 3, 2],
 * //   [2, 1, 3],
 * //   [2, 3, 1],
 * //   [3, 1, 2],
 * //   [3, 2, 1],
 * // ]
 * //
 * ```
 *
 * @param {Array<*>} array Given array.
 * @returns {Array<Array<*>>} All permutations.
 */
function permutations(array) {
  if (!array || !array.length) {
    return [];
  }

  if (array.length === 1) {
    return [
      [array[0]],
    ];
  }

  const outputs = [];

  for (let i = 0; i < array.length; ++i) {
    const input = array.slice();
    const value = input.splice(i, 1)[0];
    const subsequentCombinations = permutations(input);
    for (const subsequentCombination of subsequentCombinations) {
      outputs.push([value, ...subsequentCombination]);
    }
  }

  return outputs;
}

/**
 * Find the greatest common divisor between two numbers.
 * @param {number} a First number.
 * @param {number} b Second number.
 * @returns {number} The Greatest Common Divisor.
 * @see https://stackoverflow.com/questions/17445231/js-how-to-find-the-greatest-common-divisor
 */
function gcd(a, b) {
  if (b === 0) {
    return Math.abs(a);
  }

  return gcd(b, a % b);
}

/**
 * Prepend given input with given placeholder until output has given length.
 *
 * @param {string} value Given input.
 * @param {number} length Required length.
 * @param {string} placeholder Placeholder to use.
 * @returns {string} Output.
 */
function leftPad(value, length, placeholder) {
  let out = value;

  while (out.length < length) {
    out = placeholder + out;
  }

  return out;
}


module.exports = {
  gcd,
  intersect,
  leftPad,
  maxOf,
  minOf,
  permutations,
  readFile,
  readLines,
  sumOf,
  toNumber,
};
