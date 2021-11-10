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
const {readLines} = require('../00/index');

const ASTEROID = '#';

// https://stackoverflow.com/questions/17445231/js-how-to-find-the-greatest-common-divisor
/**
 * Compute the greatest common divisor between two values.
 *
 * @param {number} x First number.
 * @param {number} y Second number.
 * @returns {number} The greatest common divisor.
 */
function gcd(x, y) {
  if (!y) {
    return Math.abs(x);
  }

  return gcd(y, x % y);
}

/**
 * Serialize coordinates as a raw string.
 *
 * @param {{x: number, y: number}} coordinates Coordinates object.
 * @returns {string} The string value.
 */
function serializeCoordinates(coordinates) {
  return `${coordinates.x}::${coordinates.y}`;
}

/**
 * Reduce coordinates to get the less coordinates position on the same
 * line of sight (i.e the same angle).
 *
 * For example:
 * - Coordinates (3, 9) can be reduced to (1, 3)
 * - Coordinates (3, 0) can be reduced to (1, 0)
 *
 * @param {number} x X Coordinate.
 * @param {number} y Y Coordinate.
 * @returns {{x: number, y: number}} Reduced coordinates.
 */
function reduceCoordinates(x, y) {
  const divisor = gcd(x, y);
  return {
    x: x / divisor,
    y: y / divisor,
  };
}

/**
 * Create the list of asteroids from the given map.
 *
 * @param {Array<string>} map The map.
 * @returns {Array<{x: number, y: number}>} An array containing coordinates of all asteroids on the map.
 */
function detectAsteroids(map) {
  const asteroids = [];

  for (let y = 0; y < map.length; ++y) {
    const row = map[y];
    for (let x = 0; x < row.length; ++x) {
      if (row[x] === ASTEROID) {
        asteroids.push({x, y});
      }
    }
  }

  return asteroids;
}

/**
 * Compute coordinates of a point relatively to a first point.
 * Return coordinates will be the coordinates of the point as if the base (i.e coordinates (0, 0))
 * was the first point.
 *
 * @param {{x: number, y: number}} a1 First coordinates.
 * @param {{x: number, y: number}} a2 Second coordinates.
 * @returns {{x: number, y: number}} The relative coordinates of `o2` relatively to `o1`.
 */
function computeRelativeCoordinates(a1, a2) {
  return {
    x: a2.x - a1.x,
    y: a2.y - a1.y,
  };
}

/**
 * Compute the number of visible asteroids from given asteroid.
 *
 * @param {{x: number, y: number}} asteroid First asteroid.
 * @param {Array<{x: number, y: number}>} asteroids All asteroids (including `asteroid`).
 * @returns {number} Number of visible asteroids.
 */
function computeNumberOfVisibleAsteroids(asteroid, asteroids) {
  const visibleAsteroids = new Set();

  for (const otherAsteroid of asteroids) {
    if (otherAsteroid === asteroid) {
      // An asteroid is not visible to itself.
      continue;
    }

    const relativeCoordinates = computeRelativeCoordinates(asteroid, otherAsteroid);
    const reducedCoordinates = reduceCoordinates(relativeCoordinates.x, relativeCoordinates.y);
    const key = serializeCoordinates(reducedCoordinates);
    visibleAsteroids.add(key);
  }

  return visibleAsteroids.size;
}

function part01(fileName) {
  const file = path.join(__dirname, fileName);
  return readLines(file).then((map) => {
    const asteroids = detectAsteroids(map);

    let maxVisible = Number.MIN_SAFE_INTEGER;
    for (const asteroid of asteroids) {
      const nbVisible = computeNumberOfVisibleAsteroids(asteroid, asteroids);
      if (nbVisible > maxVisible) {
        maxVisible = nbVisible;
      }
    }

    return maxVisible;
  });
}

module.exports = {
  part01,
};
