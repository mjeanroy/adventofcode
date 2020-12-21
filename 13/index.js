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
 * Compute the earliest bus ID from given input.
 *
 * @param {string} file File path.
 * @returns {number} The earliest bus ID.
 */
function computeEarliestBusId(file) {
  return readLines(file).then((lines) => {
    const tt = toNumber(lines[0]);
    const busIds = lines[1].trim().split(',');

    let minWaitTime = Number.MAX_SAFE_INTEGER;
    let earliestBusId = null;

    for (let i = 0; i < busIds.length; ++i) {
      const rawBusId = busIds[i];
      if (rawBusId === 'x') {
        continue;
      }

      const busId = toNumber(rawBusId);
      const waitTime = busId - tt % busId;

      if (waitTime < minWaitTime) {
        minWaitTime = waitTime;
        earliestBusId = busId;
      }
    }

    return earliestBusId * minWaitTime;
  });
}

// eslint-disable-next-line
function computeEarliestTimestamp(file) {
  return readLines(file).then((lines) => {
    // Here we have to run `Chinese Remainder Theorem`
    // Here is the explanation:
    // We want to find a timestamp `t` where for each busses:
    // `t % [busId]` = [busId] - [position]
    // For example, from the sample:
    //  -> t % 7  == (7 - 0)  % 7  == 0
    //  -> t % 13 == (13 - 1) % 13 == 12
    //  -> t % 59 == (59 - 4) % 59 == 55
    // Etc.
    // So basically, we have for i in 1..n: `t % num[i] == rem[i]`
    // Where:
    //  - `num[i]` is the bus ID
    //  - `rem[i]` is `(busId - busPosition) % busId`

    const rawBusses = lines[1].trim().split(',');

    const num = [];
    const rem = [];

    for (let busPosition = 0; busPosition < rawBusses.length; ++busPosition) {
      const rawBus = rawBusses[busPosition];
      if (rawBus === 'x') {
        continue;
      }

      const busId = toNumber(rawBus);
      num.push(BigInt(busId));
      rem.push(BigInt((busId - busPosition) % busId));
    }

    // Ok, now just run CRT thoerem
    return chineseRemainderTheorem(num, rem);
  });
}

/**
 * Run Chinese Remainder Theorem on given inputs.
 *
 * Returns the smallest number x such that:
 *   x % num[0] = rem[0],
 *   x % num[1] = rem[1],
 *   .....................
 *   .....................
 *
 * @param {Array<number>} num First numbers.
 * @param {Array<number>} rem Second numbers.
 * @returns {number} The result with given inputs.
 * @see https://rosettacode.org/wiki/Chinese_remainder_theorem#JavaScript
 */
function chineseRemainderTheorem(num, rem) {
  let sum = 0n;

  const prod = num.reduce((a, c) => a * c, 1n);

  for (let i = 0; i < num.length; i++) {
    const [ni, ri] = [num[i], rem[i]];
    const p = prod / ni;
    sum += ri * p * inverseModulo(p, ni);
  }

  return sum % prod;
}

/**
 * Returns modulo inverse of a with respect to b.
 *
 * @param {number} a Number `a`
 * @param {number} b Modulo value.
 * @returns {number} The modulo inverse.
 * @see https://rosettacode.org/wiki/Chinese_remainder_theorem#JavaScript
 */
function inverseModulo(a, b) {
  const b0 = b;
  let x0 = 0n;
  let x1 = 1n;

  if (b === 1) {
    return 1;
  }

  while (a > 1) {
    const q = BigInt(a / b);
    [a, b] = [b, a % b];
    [x0, x1] = [x1 - q * x0, x0];
  }

  if (x1 < 0) {
    x1 += b0;
  }

  return x1;
}

module.exports = {
  computeEarliestBusId,
  computeEarliestTimestamp,
};
