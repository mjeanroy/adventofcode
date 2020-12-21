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
 * Find the first number in given input that is not the sum of two numbers in the last `preamble` visited inputs.
 *
 * @param {string} file File path.
 * @param {number} preamble The preamble size.
 * @returns {Promise<number>} The first number that do not match criteria.
 */
function computeFirstInvalid(file, preamble = 25) {
  return readLines(file).then((lines) => (
    findInvalid(lines, preamble)
  ));
}

/**
 * Find the sum of min and max value in given input found when a mismatch is detected.
 *
 * @param {string} file File path.
 * @param {number} preamble The preamble size.
 * @returns {Promise<number>} The sum of min and max values.
 */
function computeMinMax(file, preamble = 25) {
  return readLines(file).then((lines) => {
    const result = findInvalid(lines, preamble);
    return findMinMax(lines, result);
  });
}

/**
 * Compute the first number in given array of numbers that is not the sum of two numbers in the last `preamble` visited inputs.
 *
 * @param {Array<string>} lines All the inputs, as strings.
 * @param {number} preamble The preamble size.
 * @returns {Object} The first number that do not match criteria with min and max value in the set of numbers.
 */
function findInvalid(lines, preamble) {
  const size = lines.length;
  if (preamble >= size) {
    throw new Error('It looks like preamble value is not valid');
  }

  const queue = [];
  const map = new Map();

  // First, populate first inputs.
  let i = 0;

  for (; i < preamble; ++i) {
    const value = toNumber(lines[i]);
    enqueue(value, queue);
    addToMap(value, map);
  }

  // Now iterate until we found the invalid number.
  for (; i < size; ++i) {
    const value = toNumber(lines[i]);
    const oldestValue = pick(queue);

    // Should not happen, but take care of this case.
    if (!map.has(oldestValue)) {
      throw new Error('It looks like we remove a value not indexed in map');
    }

    if (!matchPair(value, map)) {
      return value;
    }

    removeToMap(oldestValue, map);
    addToMap(value, map);
    dequeue(queue);
    enqueue(value, queue);
  }

  throw new Error('Cannot find invalid value');
}

/**
 * Find a contiguous set of at least two numbers matching given target and compute the sum of the
 * minimum and maximum value in this set.
 *
 * @param {Array<string>} lines Inputs.
 * @param {number} target The target value.
 * @returns {number} The sum of the minimum and maximum value in the contiguous set matching target.
 */
function findMinMax(lines, target) {
  const queue = [];

  let sum = 0;

  for (let i = 0; i < lines.length; ++i) {
    const value = toNumber(lines[i]);

    // Keep track of the sum.
    sum += value;

    // And add the values to current sequence.
    enqueue(value, queue);

    if (sum > target) {
      // Remove oldest values until we are below the target.
      while (sum > target && queue.length > 0) {
        sum -= dequeue(queue);
      }
    }

    // If we have a sequence of, at least, two values matching the target, then we found it!
    if (queue.length >= 2 && sum === target) {
      return computeMinMaxSum(queue, sum);
    }
  }

  throw new Error('Cannot find a contiguous sequence matchin: ' + target);
}

/**
 * Find the sum of the min and max value from given sequence of numbers.
 *
 * @param {Array<number>} sequence The sequence of number.
 * @returns {number} An object with `min` and `max` values from input.
 */
function computeMinMaxSum(sequence) {
  let min = Number.MAX_SAFE_INTEGER;
  let max = -1;

  for (let i = 0; i < sequence.length; ++i) {
    const value = sequence[i];
    min = Math.min(min, value);
    max = Math.max(max, value);
  }

  return min + max;
}

/**
 * Add value to the given queue.
 *
 * @param {number} value The value to add.
 * @param {Array<number>} queue The queue.
 * @returns {void}
 */
function enqueue(value, queue) {
  queue.push(value);
}

/**
 * Pick first value in the given queue but does not remove it.
 *
 * @param {Array<number>} queue The queue.
 * @returns {void}
 */
function pick(queue) {
  return queue[0];
}

/**
 * Remove first value of the given queue.
 *
 * @param {Array<number>} queue The queue.
 * @returns {number} The removed value.
 */
function dequeue(queue) {
  return queue.shift();
}

/**
 * Add given value to the map, take care of duplicated values by incrementing
 * a counter equal to the number of times this value has already been seen.
 *
 * @param {number} value The value to add.
 * @param {Map<number, number>} map The map of values.
 * @returns {void}
 */
function addToMap(value, map) {
  const count = map.has(value) ? map.get(value) : 0;
  map.set(value, count + 1);
}

/**
 * Remove the given value from the map:
 * - Decrement counter value if current counter is strictly greater than 1.
 * - Remove from the value from the map otherwise.
 *
 * @param {number} value The value to remove.
 * @param {Map<number, number>} map The map.
 * @returns {void}
 */
function removeToMap(value, map) {
  const count = map.get(value);
  const newCount = count - 1;
  if (newCount === 0) {
    map.delete(value);
  } else {
    map.set(value, newCount);
  }
}

/**
 * Check if we can find values `x` and `y` in the map where `x + y === value`.
 *
 * @param {number} value The value.
 * @param {Map<string, number>} map The map of previous numbers.
 * @returns {boolean} `true` if we found values `x` and `y` in the map where `x + y === value`.
 */
function matchPair(value, map) {
  // Find if we have a pair
  for (const entry of map.entries()) {
    const current = entry[0];
    const lookingFor = value - current;
    if (map.has(lookingFor)) {
      // We found it!
      return true;
    }
  }

  return false;
}

module.exports = {
  computeFirstInvalid,
  computeMinMax,
};
