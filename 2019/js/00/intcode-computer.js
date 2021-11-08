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

const POSITION_MODE = '0';
const OP_CODE_STOP = '99';
const OP_CODE_SIZE = 2;

function leftPad(value, length, placeholder) {
  let out = value;
  while (out.length < length) {
    out = placeholder + out;
  }

  return out;
}

class IntCodeInstruction {
  constructor(instruction) {
    this.instruction = leftPad(instruction.toString(), 5, POSITION_MODE);
    this.opcode = leftPad(instruction.toString(), OP_CODE_SIZE, POSITION_MODE).slice(-OP_CODE_SIZE);
  }

  parameterMode(index) {
    const idx = this.instruction.length - this.opcode.length - 1 - index;
    return idx >= 0 ? this.instruction[idx] : '0';
  }
}

class IntCodeComputer {
  constructor({memory, inputs}) {
    this.memory = memory;
    this.output = null;

    this._position = 0;
    this._inputs = inputs.slice();
  }

  run(inputs = []) {
    this._inputs.push(...inputs);

    let instruction = this._nextInstruction();
    while (instruction.opcode !== OP_CODE_STOP) {
      const opcodeHandler = opcodes[instruction.opcode];
      if (!opcodeHandler) {
        throw new Error(`Unknown opcode: ${instruction.opcode}`);
      }

      opcodeHandler.execute({
        computer: this,
        instruction,
      });

      instruction = this._nextInstruction();
    }

    return this.output;
  }

  nextParameter(mode) {
    const value = this._readNext();
    return mode === POSITION_MODE ? this._at(value) : value;
  }

  write(value) {
    this._writeAt(this._readNext(), value);
  }

  out(value) {
    this.output = value;
  }

  writeInput() {
    if (this._inputs.length === 0) {
      throw new Error('Cannot read empty input');
    }

    this.write(this._inputs.shift());
  }

  moveAt(position) {
    this._position = position;
  }

  _nextInstruction() {
    const value = this._readNext();
    return new IntCodeInstruction(value);
  }

  _at(position) {
    if (position < 0 || position >= this.memory.length) {
      throw new Error(
          `Cannot read position: ${position}`,
      );
    }

    return this.memory[position];
  }

  _readNext() {
    // Read current memory entry, and move on to the next position.
    return this._at(this._position++);
  }

  _writeAt(position, value) {
    this.memory[position] = value;
  }
}


const opcodes = {
  '01': {
    execute({computer, instruction}) {
      const x = computer.nextParameter(
          instruction.parameterMode(0),
      );

      const y = computer.nextParameter(
          instruction.parameterMode(1),
      );

      computer.write(x + y);
    },
  },

  '02': {
    execute({computer, instruction}) {
      const x = computer.nextParameter(
          instruction.parameterMode(0),
      );

      const y = computer.nextParameter(
          instruction.parameterMode(1),
      );

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
      const value = computer.nextParameter(
          instruction.parameterMode(0),
      );

      computer.out(value);
    },
  },

  '05': {
    execute({computer, instruction}) {
      const x = computer.nextParameter(
          instruction.parameterMode(0),
      );

      const y = computer.nextParameter(
          instruction.parameterMode(1),
      );

      if (x) {
        computer.moveAt(y);
      }
    },
  },

  '06': {
    execute({computer, instruction}) {
      const x = computer.nextParameter(
          instruction.parameterMode(0),
      );

      const y = computer.nextParameter(
          instruction.parameterMode(1),
      );

      if (!x) {
        computer.moveAt(y);
      }
    },
  },

  '07': {
    execute({computer, instruction}) {
      const x = computer.nextParameter(
          instruction.parameterMode(0),
      );

      const y = computer.nextParameter(
          instruction.parameterMode(1),
      );

      computer.write(x < y ? 1 : 0);
    },
  },

  '08': {
    execute({computer, instruction}) {
      const x = computer.nextParameter(
          instruction.parameterMode(0),
      );

      const y = computer.nextParameter(
          instruction.parameterMode(1),
      );

      computer.write(x === y ? 1 : 0);
    },
  },
};

function intcode(initialMemory, inputs = []) {
  const computer = new IntCodeComputer({
    memory: initialMemory.slice(),
    inputs,
  });

  const output = computer.run();
  const memory = computer.memory;

  return {
    memory,
    output,
  };
}

module.exports = {
  intcode,
  IntCodeComputer,
};
