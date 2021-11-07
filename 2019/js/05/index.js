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
const {readFile, toNumber} = require('../00');

class Instruction {
  constructor(instruction) {
    this.instruction = instruction.toString();
    this.opcode = `00${this.instruction}`.slice(-2);
  }

  parameterMode(index) {
    const idx = this.instruction.length - this.opcode.length - 1 - index;
    return idx >= 0 ? this.instruction[idx] : '0';
  }
}

class Computer {
  constructor({memory, input}) {
    this.memory = memory;
    this.input = input;
    this.position = 0;
    this.output = '';
  }

  nextInstruction() {
    const value = this._readNext(this.position);
    return new Instruction(value);
  }

  nextParameter(mode) {
    const value = this._readNext(this.position);
    return mode === '0' ? this._at(value) : value;
  }

  write(value) {
    const position = this._readNext(this.position);
    this._write(position, value);
  }

  out(value) {
    this.output = value.toString();
  }

  writeInput() {
    this.write(this.input);
  }

  moveAt(position) {
    this.position = position;
  }

  _at(position) {
    return this.memory[position];
  }

  _readNext(position) {
    const value = this._at(position);
    this._move();
    return value;
  }

  _write(position, value) {
    this.memory[position] = value;
  }

  _move() {
    ++this.position;
  }
}

const opcodes = {
  '01': {
    execute({computer, instruction}) {
      const x = computer.nextParameter(instruction.parameterMode(0));
      const y = computer.nextParameter(instruction.parameterMode(1));
      computer.write(x + y);
    },
  },

  '02': {
    execute({computer, instruction}) {
      const x = computer.nextParameter(instruction.parameterMode(0));
      const y = computer.nextParameter(instruction.parameterMode(1));
      computer.write(x * y);
    },
  },

  '03': {
    execute({computer}) {
      computer.writeInput();
    },
  },

  '04': {
    execute({computer, instruction}) {
      const parameterMode = instruction.parameterMode(0);
      const value = computer.nextParameter(parameterMode);
      computer.out(value);
    },
  },

  '05': {
    execute({computer, instruction}) {
      const x = computer.nextParameter(instruction.parameterMode(0));
      const y = computer.nextParameter(instruction.parameterMode(1));
      if (x) {
        computer.moveAt(y);
      }
    },
  },

  '06': {
    execute({computer, instruction}) {
      const x = computer.nextParameter(instruction.parameterMode(0));
      const y = computer.nextParameter(instruction.parameterMode(1));
      if (!x) {
        computer.moveAt(y);
      }
    },
  },

  '07': {
    execute({computer, instruction}) {
      const x = computer.nextParameter(instruction.parameterMode(0));
      const y = computer.nextParameter(instruction.parameterMode(1));
      computer.write(x < y ? 1 : 0);
    },
  },

  '08': {
    execute({computer, instruction}) {
      const x = computer.nextParameter(instruction.parameterMode(0));
      const y = computer.nextParameter(instruction.parameterMode(1));
      computer.write(x === y ? 1 : 0);
    },
  },
};

function part01(fileName) {
  return run(fileName, 1);
}

function part02(fileName, input = 5) {
  return run(fileName, input);
}

function run(fileName, input) {
  return readFile(path.join(__dirname, fileName)).then((rawFile) => {
    const computer = new Computer({
      memory: rawFile.split(',').map((value) => toNumber(value)),
      input,
    });

    let instruction = computer.nextInstruction();

    while (instruction.opcode !== '99') {
      const opcodeHandler = opcodes[instruction.opcode];
      if (!opcodeHandler) {
        throw new Error(`Unknown opcode: ${instruction.opcode}`);
      }

      opcodeHandler.execute({
        computer,
        instruction,
      });

      instruction = computer.nextInstruction();
    }

    return computer.output;
  });
}

module.exports = {
  part01,
  part02,
};
