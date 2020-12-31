/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Mickael Jeanroy
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

const {Tile} = require('./tile');

/**
 * The final square.
 *
 * @class
 */
class Square {
  /**
   * Create the square.
   *
   * @param {number} size Square size.
   * @constructor
   */
  constructor(size) {
    this.size = size;
    this.rows = [];
  }

  /**
   * Put new tile at given position.
   *
   * @param {number} x The X position.
   * @param {number} y The Y position.
   * @param {Tile} tile The tile.
   * @returns {void}
   */
  put(x, y, tile) {
    if (!this._isValidPosition(x, y)) {
      throw new Error('Cannot put tile out of square');
    }

    if (!this.rows[y]) {
      this.rows[y] = [];
    }

    this.rows[y][x] = tile;
  }

  /**
   * Get tile at given position.
   *
   * @param {number} x The X position.
   * @param {number} y The Y position.
   * @returns {Tile} The tile at given position.
   */
  get(x, y) {
    if (!this._isValidPosition(x, y)) {
      throw new Error('Cannot put tile out of square');
    }

    const row = this.rows[y];
    if (!row) {
      return null;
    }

    return row[x] || null;
  }

  /**
   * Build the inner tile of the square.
   *
   * @returns {Tile} The tile.
   */
  innerTile() {
    const innerRows = [];

    let innerY = 0;

    for (let y = 0; y < this.size; ++y) {
      for (let x = 0; x < this.size; ++x) {
        const tileRows = this.rows[y][x].rows;
        const size = tileRows.length - 1;

        for (let i = 1; i < size; ++i) {
          const tileRow = tileRows[i];
          const innerRow = tileRow.slice(1, tileRow.length - 1);
          const pos = innerY + i - 1;
          innerRows[pos] = (innerRows[pos] || '') + innerRow;
        }
      }

      innerY += this.rows[y][0].rows.length - 2;
    }

    return new Tile(1, innerRows);
  }

  /**
   * Check that a given position is valid.
   *
   * @param {number} x The X position.
   * @param {*} y The Y position.
   * @returns {boolean} `true` if given position is valid, `false` otherwise.
   */
  _isValidPosition(x, y) {
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }
}

module.exports = {
  Square,
};
