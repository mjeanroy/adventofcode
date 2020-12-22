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
 * @returns {Promise<BigInt>} A promise resolved with given sum.
 */
function computePart1(file, useBitManipulation = true) {
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

    return doSum(memory);
  });
}

/**
 * Compute the sum of all values left in memory after running
 * the given input instruction.
 *
 * @param {string} file The file path.
 * @returns {Promise<BigInt>} A promise resolved with given sum.
 */
function computePart2(file) {
  return readLines(file).then((lines) => {
    const memory = new Map();

    let mask = null;

    for (let i = 0; i < lines.length; ++i) {
      const line = lines[i];
      if (!line) {
        continue;
      }

      if (line.startsWith('mask')) {
        mask = readMask(line);
      } else {
        const instruction = readMem(line);
        const mem = instruction.position;
        const value = instruction.value;
        const addresses = computeMemoryAddresses(mem, mask);
        for (let i = 0; i < addresses.length; ++i) {
          memory.set(Number(addresses[i]), value);
        }
      }
    }

    return doSum(memory);
  });
}

/**
 * Compute the sum of all values in memory (i.e in map).
 *
 * @param {Map<number, number>} memory The memory.
 * @returns {BigInt} The sum of all values in memory.
 */
function doSum(memory) {
  let sum = 0n;
  for (const entry of memory.entries()) {
    sum += entry[1];
  }

  return sum;
}

/**
 * Apply given mask to given number using bit manipulation.
 *
 * @param {BigInt} nb The number to update.
 * @param {string} mask Mask to apply.
 * @returns {BigInt} The number after given mask has been applied.
 */
function applyMaskUsingBitManipulation(nb, mask) {
  const r1 = nb | BigInt(parseInt(mask.replace(/X/g, '0'), 2));
  return r1 & BigInt(parseInt(mask.replace(/X/g, '1'), 2));
}

/**
 * Apply given mask to given number.
 *
 * @param {number} nb Given input number.
 * @param {string} mask The mask to apply.
 * @returns {BigInt} The number after given mask has been applied.
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
 * Compute all memory adresses after applying given mask.
 *
 * @param {number} mem The initial memory adress.
 * @param {string} mask The mask to apply.
 * @returns {Array<number>} All the memory adresses computed after applying given mask.
 */
function computeMemoryAddresses(mem, mask) {
  const maskCombinatorial = computeAllMask(mask);
  const memoryAddresses = [];
  for (let i = 0; i < maskCombinatorial.length; ++i) {
    memoryAddresses.push(applyMaskUsingBitManipulation(BigInt(mem), maskCombinatorial[i]));
  }

  return memoryAddresses;
}

/**
 * Compute the combinatory of all mask, starting with given mask.
 *
 * @param {string} mask The mask.
 * @param {number} position The current position in given mask.
 * @return {Array<string>} All resulting mask.
 */
function computeAllMask(mask, position = 0) {
  if (mask.length === 1) {
    if (mask === '0') {
      return ['X'];
    }

    if (mask === '1') {
      return ['1'];
    }

    if (mask === 'X') {
      return ['0', '1'];
    }

    throw new Error('Unknow character in mask: ' + mask);
  }

  const suffixes = computeAllMask(mask.slice(position + 1));
  const c = mask[0];
  if (c === '0') {
    return suffixes.map((suffix) => 'X' + suffix);
  }

  if (c === '1') {
    return suffixes.map((suffix) => '1' + suffix);
  }

  if (c === 'X') {
    return [
      ...suffixes.map((suffix) => '0' + suffix),
      ...suffixes.map((suffix) => '1' + suffix),
    ];
  }

  throw new Error('Unknow character in mask: ' + c);
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
  const regexp = new RegExp('mem\\[(\\d+)] = (\\d+)');
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
  computePart1,
  computePart2,
};
