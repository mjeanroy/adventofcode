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

const {readLines} = require('../00/index');

/**
 * Compute the number of black tiles according to the geographic
 * moves described by given input.
 *
 * @param {string} file The input path.
 * @returns {Promise<number>} A promise resolved with the number of black tiles.
 */
function part1(file) {
  return readLines(file).then((lines) => {
    return countBlackTiles(lines);
  });
}

// Hexagons have a weird coordinates rules...
// Positions are represented as: [x, y]
// Try to make a graph of geographical positions of hexagons, and you see thes moves will make sense
const DIRECTIONS = {
  e: (coordinates) => [coordinates[0] + 2, coordinates[1]],
  w: (coordinates) => [coordinates[0] - 2, coordinates[1]],

  ne: (coordinates) => [coordinates[0] + 1, coordinates[1] + 2],
  nw: (coordinates) => [coordinates[0] - 1, coordinates[1] + 2],

  se: (coordinates) => [coordinates[0] + 1, coordinates[1] - 2],
  sw: (coordinates) => [coordinates[0] - 1, coordinates[1] - 2],
};

/**
 * Count the number of black tiles according to given
 * moves.
 *
 * @param {Array<string>} lines The moves.
 * @returns {number} The number of black tiles.
 */
function countBlackTiles(lines) {
  const blackTiles = new Set();

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    const position = computePosition(line);
    const coordinates = `${position[0]},${position[1]}`;

    if (blackTiles.has(coordinates)) {
      blackTiles.delete(coordinates);
    } else {
      blackTiles.add(coordinates);
    }
  }

  return blackTiles.size;
}

/**
 * Compute position described by given line.
 * Note that hexagons have a weird geographic system...
 *
 * @param {string} line The line.
 * @returns {Array<number>} The position.
 */
function computePosition(line) {
  // Coordinates of the reference tile, we start here.
  let position = [0, 0];

  for (let j = 0; j < line.length; ++j) {
    const c1 = line[j];

    let direction = DIRECTIONS[c1];
    if (!direction) {
      const c2 = line[j + 1];
      const key = c1 + c2;
      direction = DIRECTIONS[key];
      j++;
    }

    position = direction(position);
  }

  return position;
}

module.exports = {
  part1,
  computePosition,
};
