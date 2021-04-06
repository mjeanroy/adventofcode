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

const {readLines, toNumber, sumOf} = require('../00/index');

function part1(file) {
  return readLines(file).then((lines) => {
    return sumOf(lines, (line) => (
        line ? computeOne(toNumber(line)) : 0
    ));
  });
}

function part2(file) {
  return readLines(file).then((lines) => {
    return sumOf(lines, (line) => (
        line ? computeOneRecursively(toNumber(line)) : 0
    ));
  });
}

function computeOne(value) {
  return Math.floor(value / 3) - 2;
}

function computeOneRecursively(value) {
  let start = value;
  let sum = 0;

  while (start > 0) {
    start = computeOne(start);
    if (start >= 0) {
      sum += start;
    }
  }

  return sum;
}

module.exports = {
  part1,
  part2,
};
