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

const {readFile} = require('../00/index');

/**
 * Find all the corner in given tiles and compute the product of their ids.
 *
 * @param {string} file File path.
 * @returns {Promise<number>} The product of the four corner id.
 */
function part1(file) {
  return readFile(file).then((data) => {
    const tiles = parseTiles(data);
    const corners = [];

    for (let i = 0; i < tiles.length; ++i) {
      const currentTile = tiles[i];
      const edges = new Set(currentTile.edges);

      for (let j = 0; j < tiles.length; ++j) {
        if (i === j) {
          continue;
        }

        for (const edge of edges.values()) {
          if (tiles[j].containsEdge(edge)) {
            edges.delete(edge);
          }
        }

        // Check if we are sure that this is not a corner.
        if (edges.size < 2) {
          break;
        }
      }

      // Check if we found the corner
      if (edges.size === 2) {
        corners.push(tiles[i].id);
      }
    }

    if (corners.length !== 4) {
      throw new Error('Cannot find four valid corners');
    }

    return corners.reduce((acc, corner) => acc * corner, 1);
  });
}

/**
 * Parse the given input to extract all tiles.
 *
 * @param {string} data All the input.
 * @returns {Array<Tile>} The tiles.
 */
function parseTiles(data) {
  const blocks = data.split('\n\n');
  const tiles = [];

  for (let i = 0; i < blocks.length; ++i) {
    const block = blocks[i].split('\n');

    const head = block[0];
    const rg = new RegExp('Tile (\\d+):');
    const matchings = rg.exec(head);
    if (!matchings) {
      throw new Error('Cannot parse tile head: ' + head);
    }

    const id = Number(matchings[1]);
    const rows = block.slice(1);
    tiles.push(new Tile(id, rows));
  }

  return tiles;
}

/**
 * A simple tile.
 *
 * @class
 */
class Tile {
  /**
   * Create the tile and compute the eight edges.
   *
   * @param {number} id Tile id.
   * @param {Array<string>} rows The tile rows.
   * @constructor
   */
  constructor(id, rows) {
    const edges = [
      // First row
      rows[0],

      // Row on the left
      rows.map((row) => row[0]).join(''),

      // Row on the right
      rows.map((row) => row[row.length -1]).join(''),

      // Last row
      rows[rows.length - 1],
    ];

    this.id = id;
    this.edges = new Set(edges);
    this.flippedEges = new Set(edges.map((edge) => reverse(edge)));
  }

  /**
   * Check if given edge is inside one of the possible edges (rotated and/ or flipped edges).
   *
   * @param {string} edge The edge.
   * @returns {boolean} `true` if given edge is inside one the eight possible edges, `false` otherwise.
   */
  containsEdge(edge) {
    return this.edges.has(edge) || this.flippedEges.has(edge);
  }
}

/**
 * Reverse string.
 *
 * @param {string} str The string.
 * @returns {string} The reversed string.
 */
function reverse(str) {
  let out = '';
  for (let i = str.length - 1; i >= 0; --i) {
    out += str[i];
  }

  return out;
}

module.exports = {
  part1,
};
