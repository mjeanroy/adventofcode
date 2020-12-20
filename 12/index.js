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

const NORTH = 'N';
const SOUTH = 'S';
const EAST = 'E';
const WEST = 'W';

const RIGHT = 'R';
const LEFT = 'L';
const FORWARD = 'F';

// The next position when moving to the right for each initial position.
const MOVE_RIGHT = {
  [NORTH]: EAST,
  [EAST]: SOUTH,
  [SOUTH]: WEST,
  [WEST]: NORTH,
};

// The next position when moving to the left for each initial position.
const MOVE_LEFT = {
  [NORTH]: WEST,
  [WEST]: SOUTH,
  [SOUTH]: EAST,
  [EAST]: NORTH,
};

/**
 * Compute the manhattan distance of given input.
 *
 * @param {string} file File path.
 * @returns {Promise<number>} A promise resolved with the manhattan distance.
 */
function computeManhattanDistance(file) {
  return readLines(file).then((lines) => {
    return execAndCompute(lines);
  });
}

/**
 * Compute the manhattan distance of given input.
 *
 * @param {string} file File path.
 * @returns {Promise<number>} A promise resolved with the manhattan distance.
 */
function computeManhattanDistanceWithWaypoint(file) {
  return readLines(file).then((lines) => {
    return execAndComputeWithWaypoint(lines);
  });
}

/**
 * Compute the ship manhattan position after executing all instructions.
 *
 * @param {Array<string>} instructions List of instructions.
 * @returns {number} The manhattan position.
 */
function execAndCompute(instructions) {
  // The ship starts by facing east
  let currentDirection = 'E';
  let currentPosition = [0, 0];

  for (let i = 0; i < instructions.length; ++i) {
    const instruction = parseInstruction(instructions[i]);
    const action = instruction.action;
    const units = instruction.units;

    // Update direction.
    currentDirection = computeNextDirection(currentDirection, action, units);

    if (action !== RIGHT && action !== LEFT) {
      currentPosition = computeNextPosition(
          action === FORWARD ? currentDirection : action,
          currentPosition,
          units,
      );
    }
  }

  return Math.abs(currentPosition[0]) + Math.abs(currentPosition[1]);
}

/**
 * Compute the ship manhattan position after executing all instructions.
 *
 * @param {Array<string>} instructions List of instructions.
 * @returns {number} The manhattan position.
 */
function execAndComputeWithWaypoint(instructions) {
  // The ship starts by facing east
  let currentPosition = [0, 0];
  let waypointPosition = [10, 1];

  for (let i = 0; i < instructions.length; ++i) {
    const instruction = parseInstruction(instructions[i]);
    const action = instruction.action;
    const units = instruction.units;

    /* eslint-disable brace-style */
    if (action === FORWARD) {
      // Move forward to the waypoint a number of times equal to the given value.
      currentPosition = [
        currentPosition[0] + waypointPosition[0] * units,
        currentPosition[1] + waypointPosition[1] * units,
      ];
    }

    else if (action === NORTH || action === SOUTH || action === WEST || action === EAST) {
      // Move the waypoint [action] by the given value
      waypointPosition = computeNextPosition(
          action,
          waypointPosition,
          units,
      );
    }

    else if (action === LEFT) {
      // Rotate the waypoint around the ship left (counter-clockwise)
      // the given number of degrees.
      let degree = units;
      while (degree > 0) {
        waypointPosition = [-waypointPosition[1], waypointPosition[0]];
        degree -= 90;
      }
    }

    else if (action === RIGHT) {
      // Rotate the waypoint around the ship right (clockwise)
      // the given number of degrees.
      let degree = units;
      while (degree > 0) {
        waypointPosition = [waypointPosition[1], -waypointPosition[0]];
        degree -= 90;
      }
    }
    /* eslint-enable brace-style */
  }

  return Math.abs(currentPosition[0]) + Math.abs(currentPosition[1]);
}

/**
 * Compute the next ship direction.
 *
 * @param {string} currentDirection The current direction.
 * @param {string} nextMove The next movement given by current instruction.
 * @param {number} units The units given by current instruction.
 * @returns {string} The new direction.
 */
function computeNextDirection(currentDirection, nextMove, units) {
  if (nextMove !== LEFT && nextMove !== RIGHT) {
    return currentDirection;
  }

  const map = nextMove === RIGHT ? MOVE_RIGHT : MOVE_LEFT;
  while (units > 0) {
    currentDirection = map[currentDirection];
    units -= 90;
  }

  return currentDirection;
}

/**
 * Compute the next ship position.
 *
 * Note that:
 * - A negative X position means a positive position on the west side.
 * - A negative Y position means a positive position on the south side.
 *
 * @param {string} currentDirection The current direction.
 * @param {Array<number>} currentPosition The current ship position.
 * @param {number} units The units given by current instruction.
 * @returns {Array<number>} The new position.
 */
function computeNextPosition(currentDirection, currentPosition, units) {
  if (currentDirection === NORTH) {
    return [currentPosition[0], currentPosition[1] + units];
  }

  if (currentDirection === SOUTH) {
    return [currentPosition[0], currentPosition[1] - units];
  }

  if (currentDirection === EAST) {
    return [currentPosition[0] + units, currentPosition[1]];
  }

  if (currentDirection === WEST) {
    return [currentPosition[0] - units, currentPosition[1]];
  }

  return currentPosition;
}

/**
 * Parse given instruction.
 *
 * @param {string} instruction The raw instruction to parse.
 * @returns {Object} The parsed instruction.
 */
function parseInstruction(instruction) {
  const action = instruction[0];
  const units = Number(instruction.slice(1));
  return {
    action,
    units,
  };
}

module.exports = {
  computeManhattanDistance,
  computeManhattanDistanceWithWaypoint,
};
