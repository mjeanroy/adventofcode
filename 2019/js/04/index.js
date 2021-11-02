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

function countValidPasswords(min, max, validatorFn) {
  let count = 0;

  for (let pwd = min; pwd <= max; ++pwd) {
    const str = pwd.toString();
    if (str.length === 6 && validatorFn(str)) {
      count++;
    }
  }

  return count;
}

function part01(min, max) {
  return countValidPasswords(min, max, (pwd) => {
    let foundPair = false;
    let previous = pwd[0];

    for (let i = 1; i < pwd.length; ++i) {
      const c = pwd[i];

      if (c === previous) {
        foundPair = true;
      } else if (c < previous) {
        return false;
      }

      previous = c;
    }

    return foundPair;
  });
}

function part02(min, max) {
  return countValidPasswords(min, max, (pwd) => {
    let foundPair = false;
    let sequenceSize = 1;
    let previous = pwd[0];

    for (let i = 1; i < pwd.length; ++i) {
      const c = pwd[i];
      if (c < previous) {
        return false;
      }

      if (c === previous) {
        sequenceSize++;
      } else {
        foundPair = foundPair || sequenceSize === 2;
        sequenceSize = 1;
      }

      previous = c;
    }

    // Check for last sequence of digits
    if (sequenceSize === 2) {
      foundPair = true;
    }

    return foundPair;
  });
}

module.exports = {
  part01,
  part02,
};
