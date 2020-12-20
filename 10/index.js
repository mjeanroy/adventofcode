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
 * Compute the number of 1-jolt differences multiplied by the number of 3-jolt differences provided
 * in given input.
 *
 * @param {string} file File path.
 * @returns {Promise<number>} A promise resolved with the number of 1-jolt differences multiplied by the number of 3-jolt differences.
 */
function compute(file) {
  return readLines(file).then((lines) => (
    computeProduct(lines)
  ));
}

/**
 * Compute the total number of distinct ways you can arrange the adapters to connect the charging outlet to your device.
 *
 * @param {string} file File path.
 * @returns {Promise<number>} A promise resolved with the number of 1-jolt differences multiplied by the number of 3-jolt differences.
 */
function computeAllArrangements(file) {
  return readLines(file).then((lines) => (
    computeNumberOfArrangement(toSet(lines))
  ));
}

/**
 * Compute the total number of arrangements in given input.
 *
 * @param {Set<number>} set The input.
 * @param {number} start The starting point, defaults to zero.
 * @param {Map<number, number>} cache The cache of previously computed values, defaults to an empty cache.
 * @returns {number} The total number of arrangement.
 */
function computeNumberOfArrangement(set, start = 0, cache = new Map()) {
  if (cache.has(start)) {
    // Cool, it is already computed!
    return cache.get(start);
  }

  const nextJolts = findNextJolts(set, start);
  const total = countArrangementsAt(nextJolts, start, set, cache);

  // Save it in the cache as we don't need to recompute it again and again.
  cache.set(start, total);

  return total;
}

/**
 * Count the number valid arrangements at this point.
 *
 * @param {Array<number>} nextJolts The valid jump from start.
 * @param {number} start The starting point.
 * @param {Set<number>} set The input set.
 * @param {Map<number, number>} cache The previously computed values.
 * @returns {number} The number of valid arrangements at this point.
 */
function countArrangementsAt(nextJolts, start, set, cache) {
  const nbJumps = nextJolts.length;
  if (nbJumps === 0) {
    return 1;
  }

  return nextJolts.reduce((acc, jump) => acc + computeNumberOfArrangement(set, start + jump, cache), 0);
}

/**
 * Compute the number of jolt counts.
 *
 * @param {Array<string>} lines Inputs.
 * @returns {number} The product of 1-jolt count and 3-jolt count.
 */
function computeProduct(lines) {
  const set = toSet(lines);

  let start = 0;
  let end = false;

  let oneJoltCount = 0;
  let threeJoltCount = 0;

  while (!end) {
    const nextJolt = findNextJolt(set, start);
    if (nextJolt === -1) {
      end = true;
      break;
    }

    start += nextJolt;

    if (nextJolt === 1) {
      oneJoltCount++;
    } else if (nextJolt === 3) {
      threeJoltCount++;
    }
  }

  // Device always 3 higher than the highest adapter
  threeJoltCount++;

  return oneJoltCount * threeJoltCount;
}

/**
 * Find the next jolt jump value according to given inputs and given jolt.
 *
 * @param {Set<number>} set The set of values.
 * @param {number} start The current jolt value.
 * @returns {number} The next jolt jump, i.e `1`, `2` or `3`, or `-1` if no values can be found.
 */
function findNextJolt(set, start) {
  for (let i = 1; i <= 3; ++i) {
    const lookingFor = start + i;
    if (set.has(lookingFor)) {
      return i;
    }
  }

  return -1;
}

/**
 * Find the next valid jolt jumps value according to given inputs and given jolt.
 *
 * @param {Set<number>} set The set of values.
 * @param {number} start The current jolt value.
 * @returns {Array<number>} The next valid jolt jumps, i.e `1`, `2` or `3`.
 */
function findNextJolts(set, start) {
  const results = [];

  for (let i = 1; i <= 3; ++i) {
    const lookingFor = start + i;
    if (set.has(lookingFor)) {
      results.push(i);
    }
  }

  return results;
}

/**
 * Convert each string values to a number and put it to a `Set`.
 *
 * @param {Array<string>} lines Lines.
 * @returns {Set<number>} All the number values.
 */
function toSet(lines) {
  const set = new Set();
  for (let i = 0; i < lines.length; ++i) {
    set.add(toNumber(lines[i]));
  }

  return set;
}

/**
 * Translate given string number to a real number.
 *
 * @param {string} value String value.
 * @returns {number} The corresponding number value.
 */
function toNumber(value) {
  return Number(value.trim());
}

module.exports = {
  compute,
  computeAllArrangements,
};
