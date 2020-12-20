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

const OCCUPIED = '#';
const EMPTY = 'L';
const FLOOR = '.';

/**
 * Compute how many seats end up occupied after all rounds of updates.
 *
 * @param {string} file File path.
 * @returns {Promise<number>} A promise resolved with the number of occupied seats at the end of the process.
 */
function compute1(file) {
  return run(file, countNeighboursOccupiedSets, 4);
}

/**
 * Compute how many seats end up occupied after all rounds of updates.
 *
 * @param {string} file File path.
 * @returns {Promise<number>} A promise resolved with the number of occupied seats at the end of the process.
 */
function compute2(file) {
  return run(file, countExtendedNeighboursOccupiedSets, 5);
}

/**
 * Run process.
 *
 * @param {string} file File path.
 * @param {*} occupationComputed THe function that compute number of occupied neighboors around given position.
 * @param {number} occupiedThreshold The minimum number of occupied neighboord for a seat to become empty.
 * @returns {Promise<number>} A promise resolved with the number of occupied seats at the end of the process.
 */
function run(file, occupationComputed, occupiedThreshold) {
  return readLines(file).then((lines) => {
    let end = false;
    let grid = lines;

    while (!end) {
      const result = runProcess(grid, occupationComputed, occupiedThreshold);
      end = !result.updated;
      grid = result.grid;
    }

    return countOccupiedSeats(grid);
  });
}

/**
 * Update the grid, so that:
 * - If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
 * - If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
 * - Otherwise, the seat's state does not change.
 *
 * @param {Array<string>} grid The grid.
 * @param {*} occupationComputed THe function that compute number of occupied neighboors around given position.
 * @param {number} occupiedThreshold The minimum number of occupied neighboord for a seat to become empty.
 * @returns {boolean} If the initial grid has been updated.
 */
function runProcess(grid, occupationComputed, occupiedThreshold) {
  const newGrid = [];
  let updated = false;

  for (let i = 0; i < grid.length; ++i) {
    let newRow = '';

    for (let j = 0; j < grid[i].length; ++j) {
      const cell = grid[i][j];

      if (cell === EMPTY && occupationComputed(grid, i, j) === 0) {
        newRow += OCCUPIED;
        updated = true;
      } else if (cell === OCCUPIED && occupationComputed(grid, i, j) >= occupiedThreshold) {
        newRow += EMPTY;
        updated = true;
      } else {
        newRow += cell;
      }
    }

    newGrid.push(newRow);
  }

  return {
    grid: newGrid,
    updated,
  };
}

/**
 * Check that a given position is valid for given grid.
 *
 * @param {Array<Array<string>>} grid The grid.
 * @param {number} x The X position.
 * @param {number} y The Y position.
 * @returns {boolean} `true` if position [x, y] is valid for given grid, `false` otherwise.
 */
function isValidPosition(grid, x, y) {
  return x >= 0 && x < grid.length && y >= 0 && y < grid[x].length;
}

/**
 * Count number of occupied seat around given position.
 *
 * @param {Array<string>} grid The grid.
 * @param {number} x The X position.
 * @param {number} y The Y position.
 * @returns {number} The number of occupied seats.
 */
function countNeighboursOccupiedSets(grid, x, y) {
  return countOccupiedNeihbours(grid, [
    [x, y - 1], // Top
    [x, y + 1], // Bottom
    [x - 1, y], // Left
    [x + 1, y], // Right

    [x - 1, y - 1], // Top Left
    [x - 1, y + 1], // Top Right
    [x + 1, y - 1], // Bottom Left
    [x + 1, y + 1], // Bottom Right
  ]);
}

/**
 * Count number of occupied seat around given position.
 *
 * Note that a neighbour here is the first non `FLOOR` position in the
 * direction.
 *
 * @param {Array<string>} grid The grid.
 * @param {number} x The X position.
 * @param {number} y The Y position.
 * @returns {number} The number of occupied seats.
 */
function countExtendedNeighboursOccupiedSets(grid, x, y) {
  return countOccupiedNeihbours(grid, [
    findNeighbour(grid, x, y, (x, y) => [x, y - 1]), // Top
    findNeighbour(grid, x, y, (x, y) => [x, y + 1]), // Bottom
    findNeighbour(grid, x, y, (x, y) => [x - 1, y]), // Left
    findNeighbour(grid, x, y, (x, y) => [x + 1, y]), // Right

    findNeighbour(grid, x, y, (x, y) => [x - 1, y - 1]), // Top Left
    findNeighbour(grid, x, y, (x, y) => [x + 1, y - 1]), // Top Right
    findNeighbour(grid, x, y, (x, y) => [x - 1, y + 1]), // Bottom Left
    findNeighbour(grid, x, y, (x, y) => [x + 1, y + 1]), // Bottom Right
  ]);
}

/**
 * Count the number of occupied seats in given neighbours.
 *
 * @param {Array<string>} grid The original grid.
 * @param {Array<Array<number>>} neighbours The neighbours.
 * @returns {number} Number of occupied seats in given neighbours.
 */
function countOccupiedNeihbours(grid, neighbours) {
  let count = 0;

  for (let i = 0; i < neighbours.length; ++i) {
    const [x, y] = neighbours[i];
    if (isValidPosition(grid, x, y) && grid[x][y] === OCCUPIED) {
      count++;
    }
  }

  return count;
}

/**
 * Compute the position of the nearest neighboor.
 *
 * @param {Array<string>} grid The grid.
 * @param {number} x The starting X position.
 * @param {number} y The starting Y position.
 * @param {function} processFn The function calculating the next position to consider.
 * @returns {Array<number>} The final position, may not be a valid position.
 */
function findNeighbour(grid, x, y, processFn) {
  [x, y] = processFn(x, y);

  while (isValidPosition(grid, x, y)) {
    if (grid[x][y] !== FLOOR) {
      break;
    }

    [x, y] = processFn(x, y);
  }

  return [x, y];
}

/**
 * Count the total number of occupied seats in the grid.
 *
 * @param {Array<Array<string>>} grid The grid.
 * @returns {number} Number of occupied seat in the grid.
 */
function countOccupiedSeats(grid) {
  return grid.reduce((acc, row) => acc + computeOccupiedSeatsInRow(row), 0);
}

/**
 * Count number of occupied seats in a row.
 * @param {string} row The row.
 * @returns {number} Number of occupied seats in the row.
 */
function computeOccupiedSeatsInRow(row) {
  let count = 0;

  for (let j = 0; j < row.length; ++j) {
    if (row[j] === OCCUPIED) {
      count++;
    }
  }

  return count;
}

module.exports = {
  compute1,
  compute2,
};
