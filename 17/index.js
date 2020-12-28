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

const ACTIVE = '#';
const INACTIVE = '.';

/**
 * Count how many cubes are left in the active state after the sixth cycle.
 *
 * @param {string} file The input.
 * @returns {Promise<number>} A promise resolved with the number of cubes left in the active state.
 */
function compute(file) {
  return readLines(file).then((lines) => {
    let grid = new Map();
    grid.set(0, lines);

    for (let i = 1; i <= 6; ++i) {
      grid = runCycle(grid, i);
    }

    return countActiveCubes(grid);
  });
}

/**
 * Run cycle on given grid.
 *
 * @param {Array<Array<string>>} grid The grid.
 * @param {number} cycle The cycle.
 * @returns {Array<Array<string>>} The new grid after cycle.
 */
function runCycle(grid, cycle) {
  const newGrid = new Map();

  const zMin = -cycle;
  const zMax = cycle;

  const layer0 = grid.get(0);
  const yMin = -1;
  const yMax = layer0.length;

  const row0 = layer0[0];
  const xMin = -1;
  const xMax = row0.length;

  for (let z = zMin; z <= zMax; ++z) {
    const newLayer = [];

    for (let y = yMin; y <= yMax; ++y) {
      let newRow = '';

      for (let x = xMin; x <= xMax; ++x) {
        // If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active.
        // Otherwise, the cube becomes inactive.
        // If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active.
        // Otherwise, the cube remains inactive.

        const currentCube = isValidPosition(grid, x, y, z) ? grid.get(z)[y][x] : INACTIVE;
        const activeNeighbours = countActiveNeighbours(grid, x, y, z);

        if (currentCube === ACTIVE) {
          newRow += activeNeighbours === 2 || activeNeighbours === 3 ? ACTIVE : INACTIVE;
        } else {
          newRow += activeNeighbours === 3 ? ACTIVE : INACTIVE;
        }
      }

      newLayer.push(newRow);
    }

    newGrid.set(z, newLayer);
  }

  return newGrid;
}

/**
 * Count the number of active neighbours of [x, y, z] in the grid.
 *
 * @param {Array<Array<string>>} grid The grid.
 * @param {number} x The X position.
 * @param {number} y The Y position.
 * @param {number} z The Z position.
 * @returns {number} The number of active neighbours of [x, y, z] in the grid.
 */
function countActiveNeighbours(grid, x, y, z) {
  const neighbours = computeAllValidNeighbours(grid, x, y, z);

  let count = 0;

  for (let i = 0; i < neighbours.length; ++i) {
    const neighbour = neighbours[i];
    const [z1, y1, x1] = neighbour;

    const layer = grid.get(z1);
    const row = layer[y1];
    const cube = row[x1];

    if (cube === ACTIVE) {
      count++;
    }
  }

  return count;
}

/**
 * Compute all neighbours positions relative to position [x, y, z].
 *
 * @param {Array<Array<string>>} grid The grid.
 * @param {number} x The X position.
 * @param {number} y The Y position.
 * @param {number} z The Z position.
 * @returns {boolean} `true` if [x, y, z] is a valid position, `false` otherwise.
 */
function isValidPosition(grid, x, y, z) {
  if (!grid.has(z)) {
    return false;
  }

  const layer = grid.get(z);
  if (y < 0 || y >= layer.length) {
    return false;
  }

  const row = layer[y];
  return x >= 0 && x < row.length;
}

/**
 * Compute all valid neighbours relative to [x, y, z] in the grid.
 *
 * @param {Array<Array<string>>} grid The grid.
 * @param {number} x The X position.
 * @param {number} y The Y position.
 * @param {number} z The Z position.
 * @returns {number} The number of active neighbours of [x, y, z] in the grid.
 */
function computeAllValidNeighbours(grid, x, y, z) {
  const neighbours = [];

  for (let i = -1; i <= 1; ++i) {
    const z1 = z + i;
    if (!grid.has(z1)) {
      continue;
    }

    const layer = grid.get(z1);
    for (let j = -1; j <= 1; ++j) {
      const y1 = y + j;
      if (y1 < 0 || y1 >= layer.length) {
        continue;
      }

      const row = layer[y1];
      for (let k = -1; k <= 1; ++k) {
        // Exclude this cell
        if (i === 0 && j === 0 && k === 0) {
          continue;
        }

        const x1 = x + k;
        if (x1 >= 0 && x1 < row.length) {
          neighbours.push([z1, y1, x1]);
        }
      }
    }
  }

  return neighbours;
}

/**
 * Count the number of active cubes in given grid.
 *
 * @param {Array<Array<string>>} grid The grid.
 * @returns {Number} The number of active cubes.
 */
function countActiveCubes(grid) {
  let count = 0;

  for (const layer of grid.values()) {
    for (let j = 0; j < layer.length; ++j) {
      const row = layer[j];
      for (let k = 0; k < row.length; ++k) {
        const cell = row[k];
        if (cell === ACTIVE) {
          count++;
        }
      }
    }
  }

  return count;
}

module.exports = {
  compute,
};
