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

const {readFile, toNumber} = require('../00/index');
const {intcode, readMemory} = require('../00/intcode-computer');

function part1(file) {
  return readFile(file).then((data) => {
    const memory = readMemory(data);

    // Before running the program, replace position 1 with the value 12 and replace position 2 with the value 2
    memory[1] = 12;
    memory[2] = 2;

    return intcode(memory).memory[0];
  });
}

function part2(file) {
  return readFile(file).then((data) => {
    const values = readMemory(data);

    for (let noun = 0; noun <= 99; ++noun) {
      for (let verb = 0; verb <= 99; ++verb) {
        const memory = values.slice();

        memory[1] = noun;
        memory[2] = verb;

        const result = intcode(memory).memory[0];
        if (result === 19690720) {
          return 100 * noun + verb;
        }
      }
    }

    throw new Error('Cannot find noun & verb matching 19690720');
  });
}

module.exports = {
  part1,
  part2,
};
