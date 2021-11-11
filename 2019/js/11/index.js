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
const {readFile, toNumber} = require('../00/index');
const {IntCodeComputer} = require('../00/intcode-computer');

const UP = 'up';
const DOWN = 'down';
const RIGHT = 'right';
const LEFT = 'left';

const BLACK = 0;
const WHITE = 1;

const TURN_LEFT = 0;
const TURN_RIGHT = 1;

const directions = {
  [UP]: {
    [TURN_RIGHT]: RIGHT,
    [TURN_LEFT]: LEFT,
    move(x, y) {
      return {
        x,
        y: y + 1,
      };
    },
  },

  [RIGHT]: {
    [TURN_RIGHT]: DOWN,
    [TURN_LEFT]: UP,
    move(x, y) {
      return {
        x: x + 1,
        y,
      };
    },
  },

  [DOWN]: {
    [TURN_RIGHT]: LEFT,
    [TURN_LEFT]: RIGHT,
    move(x, y) {
      return {
        x: x,
        y: y - 1,
      };
    },
  },

  [LEFT]: {
    [TURN_RIGHT]: UP,
    [TURN_LEFT]: DOWN,
    move(x, y) {
      return {
        x: x - 1,
        y,
      };
    },
  },
};

class Robot {
  constructor() {
    this._x = 0;
    this._y = 0;
    this._direction = UP;
  }

  panelId() {
    return `${this._x}::${this._y}`;
  }

  turn(turn) {
    this._direction = directions[this._direction][turn];
  }

  move() {
    const {x, y} = directions[this._direction].move(this._x, this._y);
    this._x = x;
    this._y = y;
  }
}

function part01(fileName) {
  const file = path.join(__dirname, fileName);
  return readFile(file).then((content) => {
    const memory = content.split(',').map((value) => toNumber(value));
    const inputs = [];
    const computer = new IntCodeComputer({memory, inputs});
    const robot = new Robot();
    const panels = new Map();

    // Run all cycles until computer is halted.
    while (!computer.halted) {
      const panelId = robot.panelId();
      const currentColor = panels.get(panelId) ?? BLACK;

      // Get first output
      const newColor = computer.runCycle([currentColor]);
      if (newColor !== BLACK && newColor !== WHITE) {
        throw new Error(`Unknown color: ${newColor}`);
      }

      if (computer.halted) {
        return panels.size;
      }

      // Get second output
      const turn = computer.runCycle();
      if (turn !== TURN_RIGHT && turn !== TURN_LEFT) {
        throw new Error(`Unknown turn: ${turn}`);
      }

      panels.set(panelId, newColor);
      robot.turn(turn);
      robot.move();
    }

    return panels.size;
  });
}

module.exports = {
  part01,
};
