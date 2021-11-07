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

const path = require('path');
const {maxOf, readFile, toNumber} = require('../00/index');
const {intcode} = require('../00/intcode-computer');

function generateCombinations(array) {
  if (!array || !array.length) {
    return [];
  }

  if (array.length === 1) {
    return [
      [array[0]],
    ];
  }

  const permutations = [];

  for (let i = 0; i < array.length; ++i) {
    const input = array.slice();
    const value = input.splice(i, 1)[0];
    const subsequentCombinations = generateCombinations(input);
    for (const subsequentCombination of subsequentCombinations) {
      permutations.push([value, ...subsequentCombination]);
    }
  }

  return permutations;
}

function execute(phaseSettings, memory) {
  const initialOutput = 0;
  const reducer = (previousOutput, phaseSetting) => {
    const computer = intcode(memory, [phaseSetting, previousOutput]);
    const output = computer.output;
    return Number(output);
  };

  return phaseSettings.reduce(reducer, initialOutput);
}

function part01(fileName) {
  const file = path.join(__dirname, fileName);
  return readFile(file).then((content) => {
    const memory = content.split(',').map((value) => toNumber(value));
    const combinations = generateCombinations([0, 1, 2, 3, 4]);
    return maxOf(combinations, (phaseSetting) => (
      execute(phaseSetting, memory)
    ));
  });
}

module.exports = {
  part01,
};
