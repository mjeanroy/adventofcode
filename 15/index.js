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

const {readLines, toNumber} = require('../00/index');

/**
 * Compute the 2020th spoken number, using the input as starting sequence.
 *
 * @param {string} file File path.
 * @returns {Promise<number>} A promise resolved with the 2020th spoken number.
 */
function compute(file) {
  return readLines(file).then((lines) => {
    const map = new Map();

    let i = 1;
    let lastSpokenNumber = null;

    const values = lines[0].split(',');
    for (; i <= values.length; ++i) {
      lastSpokenNumber = toNumber(values[i - 1]);
      addToMap(lastSpokenNumber, i, map);
    }

    for (; i <= 2020; ++i) {
      const occurences = getOrDefault(map, lastSpokenNumber, []);
      if (occurences.length <= 1) {
        lastSpokenNumber = 0;
      } else {
        lastSpokenNumber = occurences[occurences.length - 1] - occurences[occurences.length - 2];
      }

      addToMap(lastSpokenNumber, i, map);
    }

    return lastSpokenNumber;
  });
}

/**
 * Get the value associated to given `key` or switch to `defaults` if `key` is not in map.
 *
 * @param {Map<number, number>} map The map.
 * @param {number} key The value.
 * @param {number} defaults The defaults value that is returned if `key` is not in `map`.
 * @returns {number} The value associated to `key`, or `defaults`.
 */
function getOrDefault(map, key, defaults = 0) {
  if (!map.has(key)) {
    return defaults;
  }

  return map.get(key);
}

/**
 * Add value to map.
 *
 * @param {number} key The key in the map.
 * @param {number} value The value to add.
 * @param {Map<number, Array<number, number>>} map The map.
 * @returns {void}
 */
function addToMap(key, value, map) {
  const occurrences = map.has(key) ? map.get(key) : [];
  occurrences.push(value);
  map.set(key, occurrences);
}

module.exports = {
  compute,
};
