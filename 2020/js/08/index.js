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
 * Compute the value of the accumulator after last operation before finding the loop in
 * the list of operations is executed.
 *
 * @param {string} file File path.
 * @returns {Promise<number>} The accumulator value.
 */
function compute(file) {
  return readLines(file).then((lines) => {
    const operations = scanOperation(lines);
    const result = computeSteps(operations);
    if (!result.loop) {
      throw new Error('Cannot find loop in given operations');
    }

    const steps = result.steps;
    const lastStep = lastOf(steps);
    return lastStep.acc;
  });
}

/**
 * Compute the index of the last operation before finding the loop in
 * the list of operations.
 *
 * @param {string} file File path.
 * @returns {Promise<number>} The last operation index before the loop.
 */
function fixAndCompute(file) {
  return readLines(file).then((lines) => {
    const operations = scanOperation(lines);
    const result = computeSteps(operations);
    const steps = result.steps;
    if (!result.loop) {
      return lastOf(steps).acc;
    }

    // Now backtrack until we find the fix.
    while (steps.length > 0) {
      const step = steps.pop();
      const idx = step.idx;
      const operation = operations[idx];

      const id = operation.id;
      if (id === 'jmp' || id === 'nop') {
        // Try to change operation id and check if can go to the end without looping again.
        operation.id = id === 'jmp' ? 'nop' : 'jmp';

        const result = computeSteps(operations, steps.slice());
        if (!result.loop) {
          // We found the fix!
          return lastOf(result.steps).acc;
        }

        // Revert change and continue backtracking.
        operation.id = id;
      }
    }

    throw new Error('Cannot find non looping sequence');
  });
}

/**
 * Compute all steps until the end of the set of operations or until a loop has been detected.
 *
 * @param {Array<Object>} operations All the operations described by input.
 * @param {Array<Object>} steps Initial steps already computed.
 * @returns {Array<Object>} All steps, the last one being the last executed step.
 */
function computeSteps(operations, steps = []) {
  const visitedOperations = new Set();
  const nbOperations = operations.length;
  const lastStep = steps.pop() || null;

  let acc = 0;
  let idx = 0;
  if (lastStep) {
    acc = lastStep.acc;
    idx = lastStep.idx;
  }

  for (let i = 0; i < steps.length; ++i) {
    visitedOperations.add(steps[i].idx);
  }

  while (idx >= 0 && idx < nbOperations) {
    steps.push({
      acc,
      idx,
    });

    if (visitedOperations.has(idx)) {
      return {
        loop: true,
        steps,
      };
    }

    visitedOperations.add(idx);

    const op = operations[idx];
    const id = op.id;
    if (id === 'acc') {
      acc += op.value;
      idx++;
    } else if (id === 'jmp') {
      idx += op.value;
    } else if (id === 'nop') {
      idx++;
    }
  }

  // Do not forget to add the last step!
  steps.push({
    acc,
    idx,
  });

  // If we did not resolve, then it is a failure
  return {
    loop: false,
    steps,
  };
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
      value: toNumber(parts[1]),
      counter: 0,
    };
  });
}

/**
 * Get last element in given array, or `null` if array is empty.
 *
 * @param {Array<*>} array Array.
 * @returns {*} Last element in array, `null` if array is empty.
 */
function lastOf(array) {
  if (array.length === 0) {
    return null;
  }

  return array[array.length - 1];
}

module.exports = {
  compute,
  fixAndCompute,
};
