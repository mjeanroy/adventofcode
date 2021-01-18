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

/* eslint-disable brace-style */

const {Square} = require('./square');

/**
 * A context for given puzzle solver.
 *
 * @class
 */
class Puzzle {
  /**
   * Create context.
   *
   * @constructor
   */
  constructor() {
    this._tiles = new Map();
    this._byNbAdjacentEdges = new Map();
    this._connections = new Map();
  }

  /**
   * Add new tile.
   *
   * @param {Tile} tile New tile.
   * @param {Array<Tile>} connections Connected tiles.
   * @param {number} nbAdjacentEdges The number of adjacent edges.
   * @returns {void}
   */
  addTile(tile, connections, nbAdjacentEdges) {
    if (!this._byNbAdjacentEdges.has(nbAdjacentEdges)) {
      this._byNbAdjacentEdges.set(nbAdjacentEdges, []);
    }

    this._tiles.set(tile.id, tile);
    this._connections.set(tile.id, connections);
    this._byNbAdjacentEdges.get(nbAdjacentEdges).push(tile);
  }

  /**
   * Get tiles that have expected number of adjacent edges.
   *
   * @param {number} nbAdjacentEdges Number of required adjacent edges.
   * @returns {Array<Tile>} The tiles.
   */
  _candidates(nbAdjacentEdges) {
    return this._byNbAdjacentEdges.get(nbAdjacentEdges);
  }

  /**
   * Get tile that share a connection with given tile.
   *
   * @param {Tile} tile The tile.
   * @returns {Array<Tile>} Connected tiles.
   */
  _connectionsOf(tile) {
    return this._connections.get(tile.id) || [];
  }

  /**
   * Solve puzzle by building given square.
   *
   * @returns {Square} The final square.
   */
  solve() {
    this._arrange();
    return this._buildSquare();
  }

  /**
   * Arrange all the tiles to find the good connections in the good
   * orientation.
   *
   * @returns {void}
   */
  _arrange() {
    const queue = [];
    const visited = new Set();

    // Start with a corner.
    queue.push(this._candidates(2)[0]);

    // Just iterate over the graph.
    while (queue.length > 0) {
      const current = queue.shift();
      const id = current.id;
      if (visited.has(id)) {
        continue;
      }

      const connections = this._connectionsOf(current);

      if (visited.size === 0) {
        visited.add(id);

        this._initializeFirstConnection(current, connections[0]);
        this._connectTiles(current, connections[1]);

        queue.push(connections[0]);
        queue.push(connections[1]);
      }

      else {
        for (const connection of connections) {
          this._connectTiles(current, connection);
          queue.push(connection);
          visited.add(id);
        }
      }
    }
  }

  /**
   * Build final square.
   *
   * @returns {Square} The final square.
   */
  _buildSquare() {
    const size = Math.sqrt(this._tiles.size);
    const square = new Square(Math.sqrt(this._tiles.size));

    let left;
    for (let y = 0; y < size; ++y) {
      left = left ? left.bottom() : this._findTopLeftCorner();

      let current = left;
      for (let x = 0; x < size; ++x) {
        square.put(x, y, current);
        current = current.right();
      }
    }

    return square;
  }

  /**
   * Find the TOP/LEFT corner of the final square.
   *
   * @returns {Tile} The TOP/LEFT tile.
   */
  _findTopLeftCorner() {
    for (const tile of this._tiles.values()) {
      const connections = tile.connections();
      if (connections[0] === null && connections[1] !== null && connections[2] !== null && connections[3] === null) {
        return tile;
      }
    }

    throw new Error('Cannot find top/left corner of square');
  }

  /**
   * Make the connection between these two tiles.
   *
   * @param {Tile} t1 First tile.
   * @param {Tile} t2 Second tile.
   * @returns {boolean} `true` if a connection has been initialized between those tile, `false` otherwise.
   */
  _connectTiles(t1, t2) {
    for (let i = 0; i < 8; ++i) {
      if (t1.tryConnection(t2)) {
        return true;
      }

      // Next iteration will check rotated variation.
      t2.rotate();

      // If we checked the fourth rotated variations, flip tile to check for the flipped variations.
      if (i === 3) {
        t2.flip();
      }
    }

    // Go back to its initial state.
    t2.flip();

    return false;
  }

  /**
   * Make the very first connection in the square between these two tiles.
   *
   * @param {Tile} t1 First tile.
   * @param {Tile} t2 Second tile.
   * @returns {boolean} `true` if we applied the connection between tiles, `false` otherwise.
   */
  _initializeFirstConnection(t1, t2) {
    for (let i = 0; i < 8; ++i) {
      if (this._connectTiles(t1, t2)) {
        return true;
      }

      // Next iteration will check rotated variation.
      t1.rotate();

      // If we checked the fourth rotated variations, flip tile to check for the flipped variations.
      if (i === 3) {
        t1.flip();
      }
    }

    // Go back to its initial state.
    t1.flip();

    return false;
  }
}

/**
 * Iterate over all the tiles and index them in a map, the key being the number
 * of adjacent edges this tile has with others tiles in the puzzle.
 *
 * This will help us to look for candidates tiles when searching for the appropriate
 * tile at a given position.
 *
 * @param {Array<Tile>} tiles All the tiles.
 * @returns {Puzzle} The puzzle.
 */
function initialize(tiles) {
  const result = new Puzzle();

  for (let i = 0; i < tiles.length; ++i) {
    const currentTile = tiles[i];
    const connections = [];

    let count = 0;

    for (let j = 0; j < tiles.length; ++j) {
      if (i === j) {
        continue;
      }

      const otherTile = tiles[j];
      const nbConnections = currentTile.countAdjacentEdges(otherTile);
      if (nbConnections > 0) {
        connections.push(otherTile);
        count += nbConnections;
      }
    }

    result.addTile(
        currentTile,
        connections,
        count,
    );
  }

  return result;
}

module.exports = {
  initialize,
};
