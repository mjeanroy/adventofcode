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
 * Compute the number of valid password according to the validation function described
 * in part 1 of day 2 of advent of code.
 *
 * @param {string} file File path.
 * @returns {Promise<Number>} A promise resolved with the number of valid passwords.
 */
function computeRule1(file) {
  return compute(file, isPasswordValidRule1);
}

/**
 * Compute the number of valid password according to the validation function described
 * in part 2 of day 2 of advent of code.
 *
 * @param {string} file File path.
 * @returns {Promise<Number>} A promise resolved with the number of valid passwords.
 */
function computeRule2(file) {
  return compute(file, isPasswordValidRule2);
}

/**
 * Compute the number of valid password according to the validation function given
 * in parameter.
 *
 * @param {string} file File path.
 * @param {function} validator The validation function.
 * @returns {Promise<Number>} A promise resolved with the number of valid passwords.
 */
function compute(file, validator) {
  return readLines(file).then((lines) => {
    let nbValid = 0;

    for (let i = 0; i < lines.length; ++i) {
      const line = parseLine(lines[i]);
      const rule = line.rule;
      const boundaries = rule.boundaries;
      if (validator(line.pwd, rule.c, boundaries.min, boundaries.max)) {
        nbValid++;
      }
    }

    return nbValid;
  });
}

/**
 * Parse given line and returns an object with:
 * - `pwd` The password in given line.
 * - `rule` The rule in given line.
 *
 * For example, this line `1-3 a: abcde` will returned:
 *
 * ```js
 * {
 *   pwd: 'abcde',
 *   rule: {
 *     c: 'a',
 *     boundaries: {
 *       min: 1,
 *       max: 3,
 *     },
 *   },
 * }
 * ```
 *
 * @param {string} line The line to parse.
 * @returns {string} The parsed line.
 */
function parseLine(line) {
  const rg = new RegExp('(\\d+)-(\\d+) ([a-z]): ([a-z+]+)');
  const matchings = rg.exec(line);
  if (!matchings || matchings.length < 4) {
    throw new Error('Cannot parse line: ' + line);
  }

  return {
    pwd: matchings[4],
    rule: {
      c: matchings[3],
      boundaries: {
        min: toNumber(matchings[1]),
        max: toNumber(matchings[2]),
      },
    },
  };
}

/**
 * Check that given password is valid.
 *
 * @param {string} pwd The password to check.
 * @param {string} c The character that should appear at least `min` times and at lost `max` times.
 * @param {number} min The minimum of times `c` should appear in given `pwd`.
 * @param {number} max The maximum of times `c` should appear in given `pwd`.
 * @returns {boolean} `true` if `pwd` is valid, `false` otherwise.
 */
function isPasswordValidRule1(pwd, c, min, max) {
  let counter = 0;

  for (let i = 0; i < pwd.length; ++i) {
    if (pwd[i] === c) {
      counter++;
    }

    if (counter > max) {
      return false;
    }
  }

  return counter >= min && counter <= max;
}

/**
 * Check that given password is valid.
 *
 * @param {string} pwd The password to check.
 * @param {string} c The character that should appear at least `min` times and at lost `max` times.
 * @param {number} pos1 The first position where `c` should appear in `pwd`.
 * @param {number} pos2 The second position where `c` should appear in `pwd`.
 * @returns {boolean} `true` if `pwd` is valid, `false` otherwise.
 */
function isPasswordValidRule2(pwd, c, pos1, pos2) {
  const idx1 = pos1 - 1;
  const idx2 = pos2 - 1;

  let counter = 0;

  if (pwd[idx1] === c) {
    counter++;
  }

  if (pwd[idx2] === c) {
    counter++;
  }

  return counter === 1;
}

module.exports = {
  computeRule1,
  computeRule2,
};
