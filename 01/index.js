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
 * Compute the product of the two pair matching `2020`.
 *
 * @param {string} file The file path.
 * @returns {Promise<Number>} A promise resolved with the product of the two pairs.
 */
function computePair(file) {
  return readLines(file).then((lines) => {
    const pair = findPairs(lines, 2020);
    if (!pair) {
      throw new Error('Cannot find pair matching 2020');
    }

    return pair[0] * pair[1];
  });
}

/**
 * Compute the product of the three values where the sum of these values
 * is equal to `2020`.
 *
 * @param {string} file The file path.
 * @returns {Promise<Number>} A promise resolved with the product of these three values.
 */
function computeTriplet(file) {
  return readLines(file).then((lines) => {
    for (let i = 0; i < lines.length; ++i) {
      const value = lines[i].trim();
      const target = 2020 - value;
      const pair = findPairs(lines, target);
      if (pair) {
        return value * pair[0] * pair[1];
      }
    }

    throw new Error('Cannot find result');
  });
}

/**
 * Find pair of number where the sum of these two numbers is equal to a
 * given target value.
 *
 * @param {Array<string>} inputs Given input of numbers.
 * @param {Number} target The target to look for.
 * @return {Array<Number>|null} An array containing pairs, or `null` if no pair can be found.
 */
function findPairs(inputs, target) {
  const set = new Set();

  for (let i = 0; i < inputs.length; ++i) {
    const value = inputs[i].trim();
    const nb = Number(value);
    const lookingFor = target - nb;
    if (set.has(lookingFor)) {
      return [nb, lookingFor];
    }

    set.add(nb);
  }

  return null;
}

module.exports = {
  computePair,
  computeTriplet,
};

