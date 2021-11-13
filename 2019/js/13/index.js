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

const EMPTY_TILE = 0;
const WALL_TILE = 1;
const BLOCK_TILE = 2;
const HORIZONTAL_PADDLE_TILE = 3;
const BALL_TILE = 4;

const validTiles = new Set([
  EMPTY_TILE,
  WALL_TILE,
  BLOCK_TILE,
  HORIZONTAL_PADDLE_TILE,
  BALL_TILE,
]);

function isValidTile(tileId) {
  return validTiles.has(tileId);
}

class Tile {
  constructor(x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;
  }
}

class ArcadeCabinet {
  constructor(memory) {
    this._computer = new IntCodeComputer({memory});
  }

  run() {
    const tiles = [];

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

      tiles.push(new Tile(x, y, id));
    }

    return tiles;
  }
}

function part01(fileName) {
  const file = path.join(__dirname, fileName);
  return readFile(file).then((content) => {
    const memory = readMemory(content);
    const arcadeCabinet = new ArcadeCabinet(memory);
    const tiles = arcadeCabinet.run();
    return count(tiles, (tile) => {
      return tile.id === BLOCK_TILE;
    });
  });
}

module.exports = {
  part01,
};
