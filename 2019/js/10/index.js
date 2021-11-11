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

function findMonitoringStation(asteroids) {
  let maxVisible = Number.MIN_SAFE_INTEGER;
  let monitoringStation = asteroids[0];

  for (const asteroid of asteroids) {
    const nbVisible = computeNumberOfVisibleAsteroids(asteroid, asteroids);
    if (nbVisible > maxVisible) {
      monitoringStation = asteroid;
      maxVisible = nbVisible;
    }
  }

  return {
    monitoringStation,
    maxVisible,
  };
}

/**
 * Compute angle of asteroid with monitoring station in degree, from 0° to 360°.
 *
 * @param {{x: number, y: number}} monitoringStation The monitoring station.
 * @param {{x: number, y: number}} asteroid The asteroid.
 * @returns {number} The angle.
 */
function computeAngle(monitoringStation, asteroid) {
  const relativePosition = computeRelativeCoordinates(monitoringStation, asteroid);
  const angle = Math.atan2(relativePosition.y, relativePosition.x);
  const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;
  return normalizedAngle * 180 / Math.PI;
}

/**
 * Compute angle between each asteroids in the map with the monitoring station and index
 * them in a map where:
 * - The key is the angle value.
 * - The value is the asteroids, sorted by the distance between the asteroid and the monitoring station (closer first).
 *
 * @param {{x: number, y: number}} monitoringStation The monitoring station.
 * @param {Array<{x: number, y: number}>} asteroids All asteroids.
 * @returns {Map<number, Array<{x: number, y: number}>>} The asteroids indexed by the angle value with the monitoring station.
 */
function mapAsteroidsClockwise(monitoringStation, asteroids) {
  const mapOfAsteroids = new Map();

  for (const asteroid of asteroids) {
    if (asteroid === monitoringStation) {
      continue;
    }

    const angle = computeAngle(monitoringStation, asteroid);
    if (!mapOfAsteroids.has(angle)) {
      mapOfAsteroids.set(angle, []);
    }

    mapOfAsteroids.get(angle).push(asteroid);
  }

  // Sort each entries in the map, so we have the asteroid first
  for (const [, asteroidsInAngle] of mapOfAsteroids.entries()) {
    asteroidsInAngle.sort((a1, a2) => {
      const dx = a1.x - a2.x;
      return dx === 0 ? (a1.y - a2.y) : dx;
    });
  }

  return mapOfAsteroids;
}

/**
 * Rotate the angle value by 90°.
 *
 * @param {number} angle The angle.
 * @returns {number} The rotated value.
 */
function rotateAngle(angle) {
  return (angle + 90) % 360;
}

/**
 * Vaporize all asteroids and returns list of vaporized asteroids in the order each asteroid
 * has been vaporized.
 *
 * @param {Map<number, Array<{x: number, y: number}>>} mapOfAsteroids The asteroids indexed by the angle value with the monitoring station.
 * @returns {Array<{x: number, y: number}>} Vaporized asteroids.
 */
function vaporizeAsteroids(mapOfAsteroids) {
  const vaporizedAsteroids = [];
  const angles = [...mapOfAsteroids.keys()].sort((a1, a2) => {
    return rotateAngle(a1) - rotateAngle(a2);
  });

  while (mapOfAsteroids.size > 0) {
    // Run clockwise
    for (const angle of angles) {
      const asteroids = mapOfAsteroids.get(angle);
      if (asteroids) {
        vaporizedAsteroids.push(asteroids.shift());
        if (asteroids.length === 0) {
          mapOfAsteroids.delete(angle);
        }
      }
    }
  }

  return vaporizedAsteroids;
}

function part01(fileName) {
  const file = path.join(__dirname, fileName);
  return readLines(file).then((map) => {
    const asteroids = detectAsteroids(map);
    const {maxVisible} = findMonitoringStation(asteroids);
    return maxVisible;
  });
}

function part02(fileName, winnerIdx) {
  const file = path.join(__dirname, fileName);
  return readLines(file).then((map) => {
    const asteroids = detectAsteroids(map);
    const {monitoringStation} = findMonitoringStation(asteroids);

    // For each asteroid, compute the angle between the asteroid and the monitoring station
    // Then, we will just loop other each entries, sorted by angle
    const mapOfAsteroids = mapAsteroidsClockwise(monitoringStation, asteroids);
    const vaporizedAsteroids = vaporizeAsteroids(mapOfAsteroids);
    const winner = vaporizedAsteroids[winnerIdx - 1];
    return winner.x * 100 + winner.y;
  });
}

module.exports = {
  part01,
  part02,
};
