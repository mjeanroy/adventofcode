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
const {count, readFile} = require('../00/index');
const {IntCodeComputer, readMemory} = require('../00/intcode-computer');
const {Arcade} = require('./test');

const EMPTY_TILE = 0;
const WALL_TILE = 1;
const BLOCK_TILE = 2;
const HORIZONTAL_PADDLE_TILE = 3;
const BALL_TILE = 4;

const TILES = {
  [EMPTY_TILE]: ' ',
  [WALL_TILE]: '+',
  [BLOCK_TILE]: 'x',
  [HORIZONTAL_PADDLE_TILE]: '-',
  [BALL_TILE]: 'o',
};

const validTiles = new Set([
  EMPTY_TILE,
  WALL_TILE,
  BLOCK_TILE,
  HORIZONTAL_PADDLE_TILE,
  BALL_TILE,
]);

const NEUTRAL_POSITION = 0;
const LEFT_POSITION = -1;
const RIGHT_POSITION = 1;

function isValidTile(tileId) {
  return validTiles.has(tileId);
}

class Coordinates {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `${this.x}::${this.y}`;
  }
}

class Tile {
  constructor(x, y, id) {
    this.coordinates = new Coordinates(x, y);
    this.id = id;
  }

  x() {
    return this.coordinates.x;
  }

  y() {
    return this.coordinates.y;
  }

  serializeCoordinates() {
    return this.coordinates.toString();
  }

  draw() {
    return TILES[this.id];
  }
}

class Joystick {
  constructor() {
    this._position = NEUTRAL_POSITION;
  }

  position() {
    return this._position;
  }

  moveLeft() {
    this._position = LEFT_POSITION;
  }

  moveRight() {
    this._position = RIGHT_POSITION;
  }

  reset() {
    this._position = NEUTRAL_POSITION;
  }
}

class Screen {
  constructor() {
    this._tiles = new Map();
  }

  draw(tile) {
    this._tiles.set(tile.serializeCoordinates(), tile);
  }

  countTiles(id) {
    return count(this._tiles.values(), (tile) => (
      tile.id === id
    ));
  }

  paddle() {
    return [...this._tiles.values()].find((tile) => {
      return tile.id === HORIZONTAL_PADDLE_TILE;
    });
  }

  display() {
    const tiles = [...this._tiles.values()];

    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;

    for (const tile of tiles) {
      minX = Math.min(tile.x(), minX);
      minY = Math.min(tile.y(), minY);

      maxX = Math.max(tile.x(), maxX);
      maxY = Math.max(tile.y(), maxY);
    }

    const outputs = [];

    outputs.push(`Blocks: ${this.countTiles(BLOCK_TILE)}`);
    for (let y = minY; y <= maxY; ++y) {
      let row = '';

      for (let x = minX; x <= maxX; ++x) {
        const tile = this._getTile(x, y);
        const pic = tile?.draw() ?? TILES[EMPTY_TILE];
        row += pic;
      }

      outputs.push(row);
    }

    return outputs.join('\n');
  }

  _getTile(x, y) {
    const coordinates = new Coordinates(x, y);
    const key = coordinates.toString();
    return this._tiles.get(key);
  }
}

class ArcadeCabinet {
  constructor(memory) {
    this._computer = new IntCodeComputer({memory});
    this._joystick = new Joystick();
  }

  run() {
    const screen = new Screen();

    while (!this._computer.halted) {
      const x = this._computer.runCycle();
      if (this._computer.halted) {
        break;
      }

      const y = this._computer.runCycle();
      if (this._computer.halted) {
        break;
      }

      const id = this._computer.runCycle();
      if (!isValidTile(id)) {
        throw new Error(`Unknown tile: ${id}`);
      }

      screen.draw(new Tile(x, y, id));
    }

    return screen;
  }

  play() {
    const screen = new Screen();
    const scores = [];

    while (!this._computer.halted) {
      this._computer.setInputs([
        this._joystick.position(),
      ]);

      // Run three cycles to get the three output values.
      const x = this._computer.runCycle();
      if (this._computer.halted) {
        break;
      }

      const y = this._computer.runCycle();
      if (this._computer.halted) {
        break;
      }

      const tileId = this._computer.runCycle();

      // Change joystick position
      if (tileId === BALL_TILE) {
        const paddle = screen.paddle();
        if (paddle) {
          if (x < paddle.x) {
            this._joystick.moveLeft();
          } else if (x > paddle.x) {
            this._joystick.moveRight();
          }
        }
      }

      if (x === -1 && y === 0) {
        scores.push(tileId);
      } else {
        if (!isValidTile(tileId)) {
          throw new Error(`Unknown tile: ${tileId}`);
        }

        screen.draw(new Tile(x, y, tileId));
      }

      console.log(screen.display());
    }

    return scores[scores.length - 1] || 0;
  }
}

function part01(fileName) {
  const file = path.join(__dirname, fileName);
  return readFile(file).then((content) => {
    const memory = readMemory(content);
    const arcadeCabinet = new ArcadeCabinet(memory);
    const screen = arcadeCabinet.run();
    return screen.countTiles(BLOCK_TILE);
  });
}

function part02(fileName) {
  const file = path.join(__dirname, fileName);
  return readFile(file).then((content) => {
    const memory = readMemory(content);

    // Free play!
    memory[0] = 2;

    const arcadeCabinet = new ArcadeCabinet(memory);
    return arcadeCabinet.play();
  });
}

function _part02(fileName) {
  const file = path.join(__dirname, fileName);
  return readFile(file).then((content) => {
    const memory = readMemory(content);

    // Free play!
    memory[0] = 2;

    const arcade = new Arcade(memory, {
      print_game: true,
      pause_on_output: true,
      // replenish_input: 0,
    });

    return arcade.freePlay().then(() => {
      return 0;
    });
  });
}

module.exports = {
  part01,
  part02,
};
