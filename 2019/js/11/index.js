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
const {IntCodeComputer, readMemory} = require('../00/intcode-computer');

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

function serializeCoordinates(x, y) {
  return `${x}::${y}`;
}

function deserializeCoordinates(coordinates) {
  const parts = coordinates.split('::', 2);
  return {
    x: toNumber(parts[0]),
    y: toNumber(parts[1]),
  };
}

class Robot {
  constructor() {
    this._x = 0;
    this._y = 0;
    this._direction = UP;
  }

  panelId() {
    return serializeCoordinates(this._x, this._y);
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

function run(content, initialColor = BLACK) {
  const memory = readMemory(content);
  const inputs = [];
  const computer = new IntCodeComputer({memory, inputs});
  const robot = new Robot();
  const panels = new Map();

  // Initialize the first color.
  panels.set(serializeCoordinates(0, 0), initialColor);

  // Run all cycles until computer is halted.
  while (!computer.halted) {
    const panelId = robot.panelId();
    const currentColor = panels.get(panelId) ?? BLACK;

    // Get first output
    const newColor = computer.runCycle([currentColor], currentColor);
    if (newColor !== BLACK && newColor !== WHITE) {
      throw new Error(`Unknown color: ${newColor}`);
    }

    if (computer.halted) {
      break;
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

  return panels;
}

function part01(fileName) {
  const file = path.join(__dirname, fileName);
  return readFile(file).then((content) => {
    return run(content, BLACK).size;
  });
}

function part02(fileName) {
  const file = path.join(__dirname, fileName);
  return readFile(file).then((content) => {
    const paintedPanels = run(content, WHITE);

    // Build the entire map
    // We need to get the min/max coordinates to know how many axis we need to draw
    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;

    let minY = Number.MAX_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;

    for (const panelId of paintedPanels.keys()) {
      const {x, y} = deserializeCoordinates(panelId);
      minX = Math.min(x, minX);
      minY = Math.min(y, minY);

      maxX = Math.max(x, maxX);
      maxY = Math.max(y, maxY);
    }

    // Now, build the map row per row.
    // Go in reverse order of y because we want to draw something like:
    //
    // (0,3) (1,3) (2,3)
    // (0,2) (1,2) (2,2)
    // (0,1) (1,1) (2,1)
    // (0,0) (1,0) (2,0)
    //
    // => The bottom line is y=0

    const panels = [];
    for (let y = maxY; y >= minY; --y) {
      let row = '';
      for (let x = minX; x <= maxX; ++x) {
        const key = serializeCoordinates(x, y);
        const color = paintedPanels.get(key) ?? BLACK;
        row += color === WHITE ? '#' : ' ';
      }

      panels.push(row);
    }

    return panels;
  });
}

module.exports = {
  part01,
  part02,
};
