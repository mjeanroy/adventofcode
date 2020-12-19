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

const {readFile} = require('../00/index');

/**
 * Compute the sum of all positive answers of all groups of given input.
 *
 * @param {string} file File path.
 * @returns {Promise<number>} A promise resolved with the sum of all positive answers of all groups of given input.
 */
function computeSumOfAllPositiveAnswers(file) {
  return compute(file, computeAllPositiveAnswers);
}

/**
 * Compute the sum of positive answers of all groups of given input.
 *
 * @param {string} file File path.
 * @returns {Promise<number>} A promise resolved with the sum of all positive answers of all groups of given input.
 */
function computeSumPositiveAnswers(file) {
  return compute(file, computePositiveAnswers);
}

/**
 * Compute the number of positive answers according given compute function.
 *
 * @param {file} file The file path.
 * @param {*} computeFn The computation function.
 * @returns {Promise<number>} A promise resolved with the sum of all the results of `computeFn`.
 */
function compute(file, computeFn) {
  return readFile(file).then((data) => (
    data.split('\n\n').reduce((acc, group) => acc + computeFn(group.trim()), 0)
  ));
}

/**
 * Compute the number of positive answers in given group.
 *
 * @param {string} group The group.
 * @returns {number} The number of positive answers.
 */
function computeAllPositiveAnswers(group) {
  const positiveAnswers = toSet(group);
  return positiveAnswers.size;
}

/**
 * Count the number of answers to which everyone answered "YES".
 *
 * @param {string} group The group of answers.
 * @returns {number} The number of answers to which everyone answered "YES".
 */
function computePositiveAnswers(group) {
  const peoples = group.split('\n');

  let positiveAnswers = null;

  for (let i = 0; i < peoples.length; ++i) {
    const currentPositiveAnswers = toSet(peoples[i]);

    if (positiveAnswers === null) {
      // Start with the first group as a base.
      positiveAnswers = currentPositiveAnswers;
    } else {
      // Keep only answers appearing in previous set current set.
      retainAll(positiveAnswers, currentPositiveAnswers);
    }
  }

  return positiveAnswers === null ? 0 : positiveAnswers.size;
}

/**
 * Split given string and put each non blank characters in a set.
 *
 * @param {string} group Given input.
 * @returns {Set<string>} The set of each elements.
 */
function toSet(group) {
  const answers = group.split('');
  const positiveAnswers = new Set();

  for (let i = 0; i < answers.length; ++i) {
    const answer = answers[i].trim();
    if (answer) {
      positiveAnswers.add(answer);
    }
  }

  return positiveAnswers;
}

/**
 * Remove in first set all values that are not also
 * in second set: at the end, `set1` is an intersection of `set1` and `set2`.
 *
 * @param {Set<string>} set1 First set.
 * @param {Set<string>} set2 Second set.
 * @returns {void}
 */
function retainAll(set1, set2) {
  for (const v of set1.values()) {
    if (!set2.has(v)) {
      set1.delete(v);
    }
  }
}

module.exports = {
  computeSumOfAllPositiveAnswers,
  computeSumPositiveAnswers,
};
