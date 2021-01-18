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

const {readParagraphs, productOf} = require('../00/index');
const {parseTiles} = require('./parse-tiles');

/**
 * Find all the corner in given tiles and compute the product of their ids.
 *
 * @param {string} file File path.
 * @returns {Promise<number>} The product of the four corner id.
 */
function part1(file) {
  return readParagraphs(file).then((paragraphs) => {
    const tiles = parseTiles(paragraphs);
    const corners = [];

    for (let i = 0; i < tiles.length; ++i) {
      const currentTile = tiles[i];
      const edges = new Set(currentTile.edges());

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

    return productOf(corners, (corner) => corner);
  });
}

module.exports = {
  part1,
};
