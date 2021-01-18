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

const {readParagraphs} = require('../00/index');
const {parseTiles} = require('./parse-tiles');
const {initialize} = require('./puzzle');

/**
 * Find all the corner in given tiles and compute the product of their ids.
 *
 * @param {string} file File path.
 * @returns {Promise<number>} The product of the four corner id.
 */
function part2(file) {
  return readParagraphs(file).then((paragraphs) => {
    const tiles = parseTiles(paragraphs);

    // First, we need to solve the entire puzzle.
    const puzzle = initialize(tiles);
    const square = puzzle.solve();

    // Then, we build the inner tile.
    const mainTile = square.innerTile();

    // Then, we count the number of monsters.
    const nbMonsters = countAllMonsters(mainTile);
    if (nbMonsters === 0) {
      throw new Error('Cannot find any monster!');
    }

    // Now, we can compute the final result
    const nbHash = countHashes(mainTile);
    const nbHashMonster = 15 * nbMonsters;
    return nbHash - nbHashMonster;
  });
}

/**
 * Count number of monsters in all variation.
 *
 * @param {Tile} tile The tile.
 * @returns {number} The number of monsters.
 */
function countAllMonsters(tile) {
  let count = 0;

  for (let i = 0; i < 8; ++i) {
    count += countMonsters(tile);

    // Next iteration will check rotated variation.
    tile.rotate();

    // If we checked the fourth rotated variations, flip tile to check for the flipped variations.
    if (i === 3) {
      tile.flip();
    }
  }

  return count;
}

/**
 * Count the number of monsters in this tile variation.
 *
 * @param {Tile} tile The tile.
 * @returns {number} The number of monster.
 */
function countMonsters(tile) {
  const rg1 = new RegExp('..................#.');
  const rg2 = new RegExp('#....##....##....###');
  const rg3 = new RegExp('.#..#..#..#..#..#...');

  const rows = tile.rows;
  const yMax = rows.length - 3;

  let counter = 0;

  for (let y = 0; y < yMax; ++y) {
    const row1 = rows[y];
    const row2 = rows[y + 1];
    const row3 = rows[y + 2];
    const xMax = row1.length - 20;

    for (let x = 0; x < xMax; ++x) {
      const l1 = row1.slice(x, x + 20);
      const l2 = row2.slice(x, x + 20);
      const l3 = row3.slice(x, x + 20);
      if (rg1.exec(l1) && rg2.exec(l2) && rg3.exec(l3)) {
        counter++;
      }
    }
  }

  return counter;
}

/**
 * Count number of `#` in the tile.
 * @param {Tile} tile The tile.
 * @returns {number} Number of `#`.
 */
function countHashes(tile) {
  let count = 0;

  const rows = tile.rows;
  for (let i = 0; i < rows.length; ++i) {
    const row = rows[i];
    for (let j = 0; j < rows.length; ++j) {
      if (row[j] === '#') {
        count++;
      }
    }
  }

  return count;
}

module.exports = {
  part2,
};
