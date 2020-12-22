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
 * Compute the sum of all values left in memory after running
 * the given input instruction.
 *
 * @param {string} file The file path.
 * @param {boolean} useBitManipulation Use bit manipulation to apply mask, set to `false` to use "good old" loop.
 * @returns {Promise<number>} A promise resolved with given sum.
 */
function compute(file, useBitManipulation = true) {
  return readLines(file).then((lines) => {
    const memory = new Map();
    const applyFn = useBitManipulation ? applyMaskUsingBitManipulation : applyMaskUsingLoop;

    let mask = null;

    for (let i = 0; i < lines.length; ++i) {
      const line = lines[i];
      if (line.startsWith('mask')) {
        mask = readMask(line);
      } else {
        const instruction = readMem(lines[i]);
        const value = applyFn(instruction.value, mask);
        memory.set(instruction.position, value);
      }
    }

    // Then compute the sum
    let sum = 0n;
    for (const entry of memory.entries()) {
      sum += entry[1];
    }

    return sum;
  });
}

/**
 * Apply given mask to given number using bit manipulation.
 *
 * @param {number} nb The number to update.
 * @param {string} mask Mask to apply.
 * @returns {BigInt} The number after given mask has been applied.
 */
function applyMaskUsingBitManipulation(nb, mask) {
  nb |= BigInt(parseInt(mask.replace(/X/g, '0'), 2));
  nb &= BigInt(parseInt(mask.replace(/X/g, '1'), 2));
  return nb;
}

/**
 * Apply given mask to given number.
 *
 * @param {number} nb Given input number.
 * @param {string} mask The mask to apply.
 * @returns {number} The number after given mask has been applied.
 */
function applyMaskUsingLoop(nb, mask) {
  const binary = toBinary(nb);

  let j = mask.length - 1;
  let i = binary.length - 1;
  let output = '';

  for (; i >= 0 && j >= 0; --j, --i) {
    if (mask[j] === '1') {
      output = '1' + output;
    } else if (mask[j] === '0') {
      output = '0' + output;
    } else {
      output = binary[i] + output;
    }
  }

  for (; j >= 0; --j) {
    output = (mask[j] === 'X' ? '0' : mask[j]) + output;
  }

  for (; i >= 0; --i) {
    output = binary[i] + output;
  }

  return BigInt(parseInt(output, 2));
}

/**
 * Translate number to a binary string.
 *
 * @param {number} nb Number.
 * @returns {string} Get binary representation of given number.
 */
function toBinary(nb) {
  return nb.toString(2);
}

// '0000000000000000000000000000010000001001'
//      000000000000000000000000000001001001
/**
 * Parse given input describing memory allocation.
 *
 * For example, following line: `mem[8] = 11`
 * Will returns an object, such as:
 *
 * ```
 * {
 *   position: 8,
 *   value: 11
 * }
 * ```
 *
 * @param {string} line The input.
 * @return {Object} The parsed input.
 */
function readMem(line) {
  const regexp = new RegExp('mem\\[(\\d+)\\] = (\\d+)');
  const match = regexp.exec(line.trim());
  if (!match) {
    throw new Error('Cannot read line: ' + line);
  }

  const position = toNumber(match[1]);
  const value = BigInt(toNumber(match[2]));
  return {
    position,
    value,
  };
}

/**
 * Read mask from given input.
 *
 * For example, given input: `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X`
 * This function will return: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X`
 *
 * @param {string} line The line to read.
 * @returns {string} The mask.
 */
function readMask(line) {
  return line.trim().split(' = ')[1];
}

module.exports = {
  compute,
};
