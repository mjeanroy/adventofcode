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

function part1(file) {
  return readFile(file).then((data) => {
    const values = data.trim().split(',').map((x) => toNumber(x));

    // Before running the program, replace position 1 with the value 12 and replace position 2 with the value 2
    values[1] = 12;
    values[2] = 2;

    return run(values);
  });
}

function part2(file) {
  return readFile(file).then((data) => {
    const values = data.trim().split(',').map((x) => toNumber(x));

    for (let noun = 0; noun <= 99; ++noun) {
      for (let verb = 0; verb <= 99; ++verb) {
        const inputs = values.slice();

        inputs[1] = noun;
        inputs[2] = verb;

        const result = run(inputs);
        if (result === 19690720) {
          return 100 * noun + verb;
        }
      }
    }

    throw new Error('Cannot find noun & verb matching 19690720');
  });
}

function run(values) {
  let i = 0;
  let opcode = values[i];

  while (opcode !== 99) {
    // Get values at given position
    const x = values[values[i + 1]];
    const y = values[values[i + 2]];

    // Get the position to update
    const position = values[i + 3];

    // Compute and update
    if (opcode === 1) {
      values[position] = x + y;
    } else if (opcode === 2) {
      values[position] = x * y;
    } else {
      throw new Error('Unknown opcode: ' + opcode);
    }

    i += 4;
    opcode = values[i];
  }

  return values[0];
}

module.exports = {
  part1,
  part2,
};
