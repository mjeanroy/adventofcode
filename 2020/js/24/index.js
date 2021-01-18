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

const {readLines, toNumber} = require('../00/index');

/**
 * Compute the number of black tiles according to the geographic
 * moves described by given input.
 *
 * @param {string} file The input path.
 * @returns {Promise<number>} A promise resolved with the number of black tiles.
 */
function part1(file) {
  return readLines(file).then((lines) => {
    return initialBlackTiles(lines).size;
  });
}

/**
 * Compute the number of black tiles according to the initial geographic
 * moves described by given input after given number of days.
 *
 * @param {string} file The input path.
 * @param {number} days The number of days, defaults to 100.
 * @returns {Promise<number>} A promise resolved with the number of black tiles.
 */
function part2(file, days = 100) {
  return readLines(file).then((lines) => {
    let blackTiles = initialBlackTiles(lines);
    for (let i = 1; i <= days; ++i) {
      blackTiles = flipBlackTiles(blackTiles);
    }

    return blackTiles.size;
  });
}

/**
 * Flip black tiles:
 *
 * - Any black tile with zero or more than 2 black tiles immediately adjacent to it is flipped to white.
 * - Any white tile with exactly 2 black tiles immediately adjacent to it is flipped to black.
 *
 * @param {Set<string>} blackTiles The current black tiles.
 * @returns {Set<string>} New black tiles.
 */
function flipBlackTiles(blackTiles) {
  const newBlackTiles = new Set();

  for (const blackTile of blackTiles) {
    const position = deserializeCoordinates(blackTile);
    const neighbours = [
      [position[0] + 2, position[1]], // East
      [position[0] - 2, position[1]], // West

      [position[0] + 1, position[1] + 2], // North East
      [position[0] + 1, position[1] - 2], // South East

      [position[0] - 1, position[1] + 2], // North West
      [position[0] - 1, position[1] - 2], // South West
    ];

    for (const neighbour of neighbours) {
      // Any white tile with exactly 2 black tiles immediately adjacent to it is flipped to black.
      const coordinates = serializeCoordinates(neighbour);
      if (!blackTiles.has(coordinates)) {
        const nbAdjacentBlackTiles = countAdjacentBlackTiles(blackTiles, neighbour);
        if (nbAdjacentBlackTiles === 2) {
          newBlackTiles.add(coordinates);
        }
      }
    }

    // Any black tile with zero or more than 2 black tiles immediately adjacent to it is flipped to white.
    // So black tile with 1 or 2 black tiles immediately adjacent to it remains black.
    const nb = countAdjacentBlackTiles(blackTiles, position);
    if (nb === 1 || nb === 2) {
      newBlackTiles.add(blackTile);
    }
  }

  return newBlackTiles;
}

/**
 * Count the number of adjacent black tiles.
 *
 * @param {Set<string>} blackTiles The current black tiles.
 * @param {Array<number>} position The position to check.
 * @returns {number} The number of adjacent black tile.
 */
function countAdjacentBlackTiles(blackTiles, position) {
  const neighbours = [
    serializeCoordinates([position[0] + 2, position[1]]), // East
    serializeCoordinates([position[0] - 2, position[1]]), // West

    serializeCoordinates([position[0] + 1, position[1] + 2]), // North East
    serializeCoordinates([position[0] + 1, position[1] - 2]), // South East

    serializeCoordinates([position[0] - 1, position[1] + 2]), // North West
    serializeCoordinates([position[0] - 1, position[1] - 2]), // South West
  ];

  let nbAdjacentBlackTile = 0;
  for (const neighbour of neighbours) {
    if (blackTiles.has(neighbour)) {
      nbAdjacentBlackTile++;
    }
  }

  return nbAdjacentBlackTile;
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
 * @returns {Set<string>} The black tiles.
 */
function initialBlackTiles(lines) {
  const blackTiles = new Set();

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    const position = computePosition(line);
    const coordinates = serializeCoordinates(position);

    if (blackTiles.has(coordinates)) {
      blackTiles.delete(coordinates);
    } else {
      blackTiles.add(coordinates);
    }
  }

  return blackTiles;
}

/**
 * Serialize given coordinates.
 *
 * @param {Array<number>} coordinates The coordinates.
 * @returns {string} The serialized coordinates.
 */
function serializeCoordinates(coordinates) {
  return `${coordinates[0]},${coordinates[1]}`;
}

/**
 * Serialize given coordinates.
 *
 * @param {string} coordinates The serialized coordinates.
 * @returns {Array<number>} The coordinates.
 */
function deserializeCoordinates(coordinates) {
  const parts = coordinates.split(',');
  return [toNumber(parts[0]), toNumber(parts[1])];
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
  part2,
  computePosition,
};
