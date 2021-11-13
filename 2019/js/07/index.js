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
const {maxOf, permutations, readFile} = require('../00/index');
const {IntCodeComputer, readMemory} = require('../00/intcode-computer');

function part01(fileName) {
  const file = path.join(__dirname, fileName);
  return readFile(file).then((content) => {
    const memory = readMemory(content);
    const combinations = permutations([0, 1, 2, 3, 4]);
    return maxOf(combinations, (phaseSettings) => {
      let output = 0;

      for (const phase of phaseSettings) {
        const inputs = [phase, output];
        const computer = new IntCodeComputer({memory, inputs});
        output = computer.run();
      }

      return output;
    });
  });
}

class Circuit {
  constructor(memory, phaseSettings) {
    this._index = 0;
    this._amplifiers = phaseSettings.map((phase) => {
      return new IntCodeComputer({memory, inputs: [phase]});
    });
  }

  run() {
    let output = 0;

    while (!this._lastAmplifier().halted) {
      output = this._nextAmplifier().runCycle([output]);
    }

    return this._lastAmplifier().output;
  }

  _nextAmplifier() {
    const amplifier = this._amplifiers[this._index];
    this._move();
    return amplifier;
  }

  _move() {
    this._index++;
    this._index = this._index % this._nbAmplifiers();
  }

  _nbAmplifiers() {
    return this._amplifiers.length;
  }

  _lastAmplifier() {
    return this._amplifiers[
        this._nbAmplifiers() - 1
    ];
  }
}

function part02(fileName) {
  const file = path.join(__dirname, fileName);
  return readFile(file).then((content) => {
    const memory = readMemory(content);
    const combinations = permutations([5, 6, 7, 8, 9]);
    return maxOf(combinations, (phaseSettings) => {
      return new Circuit(memory, phaseSettings).run();
    });
  });
}

module.exports = {
  part01,
  part02,
};
