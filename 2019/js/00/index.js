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

function intersect(set1, set2) {
  const set = new Set();

  for (const x of set1) {
    if (set2.has(x)) {
      set.add(x);
    }
  }

  return set;
}

module.exports = {
  readFile,
  readLines,
  toNumber,
  sumOf,
  minOf,
  intersect,
};
