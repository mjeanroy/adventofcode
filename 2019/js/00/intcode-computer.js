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

const {leftPad, toNumber} = require('./index');

const POSITION_MODE = '0';
const IMMEDIATE_MODE = '1';
const RELATIVE_MODE = '2';

const OP_CODE_ADDS = '01';
const OP_CODE_MULTIPLIES = '02';
const OP_CODE_INPUT = '03';
const OP_CODE_OUTPUT = '04';
const OP_CODE_JUMP_IF_TRUE = '05';
const OP_CODE_JUMP_IF_FALSE = '06';
const OP_CODE_LESS_THAN = '07';
const OP_CODE_EQUALS = '08';
const OP_CODE_RELATIVE_BASE = '09';
const OP_CODE_STOP = '99';

const OP_CODE_SIZE = 2;

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
    this.memory = memory.slice();
    this.output = null;
    this.halted = false;

    this._position = 0;
    this._inputs = inputs.slice();
    this._relativeBase = 0;
  }

  /**
   * Run cycles until opcode 99 is executed (meaning that the run is completed).
   *
   * @returns {number | null} The last output.
   */
  run() {
    while (!this.halted) {
      this.runCycle();
    }

    return this.output;
  }

  /**
   * Run cycle: execute instructions until an output value is emitted or opcode 99
   * is executed.
   *
   * @param {Array<number>} inputs Add new inputs.
   * @returns {number | null} Last emitted output.
   */
  runCycle(inputs = []) {
    if (this.halted) {
      throw new Error('Cannot run cycle, current computer is halted');
    }

    this._addInputs(inputs);
    this._run();
    return this.output;
  }

  /**
   * Read next parameter and move instruction pointer to the next position.
   *
   * @param {string} mode Parameter mode (0 for position mode, 1 for immediate mode).
   * @returns {number} The parameter value.
   */
  nextParameter(mode) {
    const value = this._readNext();
    if (mode === IMMEDIATE_MODE) {
      return value;
    }

    if (mode === POSITION_MODE) {
      return this._at(value);
    }

    if (mode === RELATIVE_MODE) {
      return this._at(value + this._relativeBase);
    }

    throw new Error(`Unknown parameter mode: ${mode}`);
  }

  /**
   * Write given value at the position indicated by the instruction pointer and
   * move the pointer to the next position.
   *
   * @param {number} value Value to write.
   * @param {string} parameterMode The parameter mode.
   * @returns {void}
   */
  write(value, parameterMode = POSITION_MODE) {
    let writePosition = this._readNext();
    if (parameterMode === RELATIVE_MODE) {
      writePosition = writePosition + this._relativeBase;
    }

    this._writeAt(writePosition, value);
  }

  /**
   * Increase relative base position by given value.
   * Value can be positive or negative (with a negative value, relative base will, in fact, decrease).
   *
   * @param {number} value Value to add.
   * @returns {void}
   */
  increaseRelativeBase(value) {
    this._relativeBase += value;
  }

  /**
   * Emit output value.
   *
   * @param {number} value Output value.
   * @returns {void}
   */
  out(value) {
    this.output = value;
  }

  /**
   * Write next input at the position indicated by the instruction pointer and:
   *
   * - Move the instruction pointer to the next position.
   * - Remove the input value that has been used.
   *
   * @param {string} mode The parameter mode.
   * @returns {void}
   */
  writeInput(mode = POSITION_MODE) {
    if (this._inputs.length === 0) {
      throw new Error('Cannot read empty input');
    }

    this.write(this._inputs.shift(), mode);
  }

  /**
   * Move instruction pointer at given position.
   *
   * @param {number} position New position.
   * @returns {void}
   */
  moveAt(position) {
    this._position = position;
  }

  /**
   * Add new input values.
   *
   * @param {Array<number>} inputs Input values.
   * @returns {void}
   * @private
   */
  _addInputs(inputs) {
    this._inputs.push(...inputs);
  }

  /**
   * Run until the opcode 99 is found or an output value
   * is emitted.
   *
   * @returns {void}
   * @private
   */
  _run() {
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

      if (instruction.opcode === '04') {
        // Send output to next
        break;
      }

      instruction = this._nextInstruction();
    }

    if (instruction.opcode === OP_CODE_STOP) {
      this.halted = true;
    }
  }

  /**
   * Read instruction at the current position and move instruction pointer to the
   * next position.
   *
   * @returns {IntCodeInstruction} The instruction.
   * @private
   */
  _nextInstruction() {
    const value = this._readNext();
    return new IntCodeInstruction(value);
  }

  /**
   * Read memory value at given position.
   *
   * @param {number} position The position to read.
   * @returns {number} Value stored in memory at given position.
   * @private
   */
  _at(position) {
    if (position < 0) {
      throw new Error(`Cannot read position: ${position}`);
    }

    // Returns zero if out of bounds
    if (position >= this.memory.length) {
      return 0;
    }

    // Default is zero
    return this.memory[position] ?? 0;
  }

  /**
   * Read memory value and move instruction pointer to the next position.
   *
   * @returns {number} Value stored in memory at current position.
   * @private
   */
  _readNext() {
    // Read current memory entry, and move on to the next position.
    return this._at(this._position++);
  }

  _writeAt(position, value) {
    this.memory[position] = value;
  }
}

const opcodes = {
  [OP_CODE_ADDS]: {
    execute({computer, instruction}) {
      const x = computer.nextParameter(instruction.parameterMode(0));
      const y = computer.nextParameter(instruction.parameterMode(1));
      const value = x + y;
      const mode = instruction.parameterMode(2);
      computer.write(value, mode);
    },
  },

  [OP_CODE_MULTIPLIES]: {
    execute({computer, instruction}) {
      const x = computer.nextParameter(instruction.parameterMode(0));
      const y = computer.nextParameter(instruction.parameterMode(1));
      const value = x * y;
      const mode = instruction.parameterMode(2);
      computer.write(value, mode);
    },
  },

  [OP_CODE_INPUT]: {
    execute({computer, instruction}) {
      const mode = instruction.parameterMode(0);
      computer.writeInput(mode);
    },
  },

  [OP_CODE_OUTPUT]: {
    execute({computer, instruction}) {
      const value = computer.nextParameter(instruction.parameterMode(0));
      computer.out(value);
    },
  },

  [OP_CODE_JUMP_IF_TRUE]: {
    execute({computer, instruction}) {
      const x = computer.nextParameter(instruction.parameterMode(0));
      const y = computer.nextParameter(instruction.parameterMode(1));
      if (x) {
        computer.moveAt(y);
      }
    },
  },

  [OP_CODE_JUMP_IF_FALSE]: {
    execute({computer, instruction}) {
      const x = computer.nextParameter(instruction.parameterMode(0));
      const y = computer.nextParameter(instruction.parameterMode(1));
      if (!x) {
        computer.moveAt(y);
      }
    },
  },

  [OP_CODE_LESS_THAN]: {
    execute({computer, instruction}) {
      const x = computer.nextParameter(instruction.parameterMode(0));
      const y = computer.nextParameter(instruction.parameterMode(1));
      const value = x < y ? 1 : 0;
      const mode = instruction.parameterMode(2);
      computer.write(value, mode);
    },
  },

  [OP_CODE_EQUALS]: {
    execute({computer, instruction}) {
      const x = computer.nextParameter(instruction.parameterMode(0));
      const y = computer.nextParameter(instruction.parameterMode(1));
      const value = x === y ? 1 : 0;
      const mode = instruction.parameterMode(2);
      computer.write(value, mode);
    },
  },

  [OP_CODE_RELATIVE_BASE]: {
    execute({computer, instruction}) {
      const value = computer.nextParameter(instruction.parameterMode(0));
      computer.increaseRelativeBase(value);
    },
  },
};

function intcode(initialMemory, initialInputs = []) {
  const computer = new IntCodeComputer({
    memory: initialMemory,
    inputs: initialInputs,
  });

  const output = computer.run();
  const memory = computer.memory.slice();

  return {
    memory,
    output,
  };
}

/**
 * Read and create memory from given raw input.
 *
 * @param {string} inputs Raw inputs.
 * @returns {number[]} The memory.
 */
function readMemory(inputs) {
  return inputs.trim().split(',').map((value) => toNumber(value.trim()));
}

module.exports = {
  intcode,
  IntCodeComputer,
  readMemory,
};
