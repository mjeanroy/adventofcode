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

const {readLines, toNumber, intersect, minOf} = require('../00/index');

function part1(file) {
  return readLines(file).then((lines) => {
    const points1 = computePoints(lines[0]);
    const points2 = computePoints(lines[1]);
    const intersection = intersect(new Set(points1.keys()), new Set(points2.keys()));
    return minOf(intersection, (point) => (
      computeManhattanDistance(point)
    ));
  });
}

function part2(file) {
  return readLines(file).then((lines) => {
    const points1 = computePoints(lines[0]);
    const points2 = computePoints(lines[1]);
    const intersection = intersect(new Set(points1.keys()), new Set(points2.keys()));
    return minOf(intersection, (point) => (
      points1.get(point) + points2.get(point)
    ));
  });
}

function computeManhattanDistance(point) {
  const parts = point.split(',');
  const x = toNumber(parts[0]);
  const y = toNumber(parts[1]);
  return Math.abs(x) + Math.abs(y);
}

function computePoints(road) {
  const points = new Map();
  const moves = road.split(',');

  let x = 0;
  let y = 0;
  let steps = 0;

  for (let i = 0; i < moves.length; ++i) {
    const move = moves[i];
    const direction = move[0];
    const distance = toNumber(move.slice(1));

    for (let k = 0; k < distance; ++k) {
      if (direction === 'U') {
        x += 1;
      } else if (direction === 'D') {
        x -= 1;
      } else if (direction === 'R') {
        y += 1;
      } else if (direction === 'L') {
        y -= 1;
      }

      steps++;

      const key = `${x},${y}`;
      if (!points.has(key)) {
        points.set(key, steps);
      }
    }
  }

  return points;
}

module.exports = {
  part1,
  part2,
};
