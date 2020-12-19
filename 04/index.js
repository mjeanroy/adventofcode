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

/**
 * Count the number of valid passports in given input file.
 *
 * @param {string} file The input file.
 * @returns {Promise<number>} A promise resolved with the number of valid passports.
 */
function compute1(file) {
  const validators = new Map();
  validators.set('byr', () => true);
  validators.set('iyr', () => true);
  validators.set('eyr', () => true);
  validators.set('hgt', () => true);
  validators.set('hcl', () => true);
  validators.set('ecl', () => true);
  validators.set('pid', () => true);
  return computeAndValidate(file, validators);
}

/**
 * Count the number of valid passports in given input file.
 * Note that in this part, each rule is checked precisely.
 *
 * @param {string} file The input file.
 * @returns {Promise<number>} A promise resolved with the number of valid passports.
 */
function compute2(file) {
  const validators = new Map();

  validators.set('byr', (value) => (
    validateYear(value, 1920, 2002)
  ));

  validators.set('iyr', (value) => (
    validateYear(value, 2010, 2020)
  ));

  validators.set('eyr', (value) => (
    validateYear(value, 2020, 2030)
  ));

  validators.set('hgt', (value) => {
    const isCm = endsWith(value, 'cm');
    const isIn = endsWith(value, 'in');
    if (!isCm && !isIn) {
      return false;
    }

    const nb = value.slice(0, value.length - 2);
    return (isCm && validateNumber(nb, 150, 193)) || (isIn && validateNumber(nb, 59, 76));
  });

  validators.set('hcl', (value) => {
    if (!value || value.length !== 7) {
      return false;
    }

    if (value[0] !== '#') {
      return false;
    }

    return value.slice(1).split('').every((c) => (
      isHex(c)
    ));
  });

  validators.set('ecl', (value) => {
    const allowed = new Set([
      'amb',
      'blu',
      'brn',
      'gry',
      'grn',
      'hzl',
      'oth',
    ]);

    return allowed.has(value);
  });

  validators.set('pid', (value) => {
    if (!value || value.length !== 9) {
      return false;
    }

    return value.split('').every((c) => (
      isDigit(c)
    ));
  });

  return computeAndValidate(file, validators);
}

/**
 * Check that given character is an hexadecimal character, i.e one
 * of `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `a`, `b`, `c`, `d`, `e` or `f`.
 *
 * @param {string} c The character to check.
 * @returns {boolean} `true` if `c` is an hexadecimal character, `false` otherwise.
 */
function isHex(c) {
  return isDigit(c) || isHexChar(c);
}

/**
 * Check that given character is a digit.
 *
 * @param {string} c The character to check.
 * @returns {boolean} `true` if `c` is a digit, `false` otherwise.
 */
function isDigit(c) {
  return c >= '0' && c <= '9';
}

/**
 * Check that given character is an hexadecimal alpha character, i.e a one
 * of `a`, `b`, `c`, `d`, `e` or `f`.
 *
 * @param {string} c The character to check.
 * @returns {boolean} `true` if `c` is an hexadecimal alpa character, `false` otherwise.
 */
function isHexChar(c) {
  return c >= 'a' && c <= 'f';
}

/**
 * Check that given value is a valid year with: `lowerBound <= year <= upperBound`.
 *
 * @param {string} value The given value.
 * @param {number} lowerBound The allowed lower bound.
 * @param {number} upperBound The allowed upper bound.
 * @returns {boolean} `true` if value is a valid year, `false` otherwise.
 */
function validateYear(value, lowerBound, upperBound) {
  if (!value || value.length < 4) {
    return false;
  }

  return validateNumber(value, lowerBound, upperBound);
}

/**
 * Check that given value is a valid number with: `lowerBound <= nb <= upperBound`.
 *
 * @param {string} value The given value.
 * @param {number} lowerBound The allowed lower bound.
 * @param {number} upperBound The allowed upper bound.
 * @returns {boolean} `true` if value is a valid year, `false` otherwise.
 */
function validateNumber(value, lowerBound, upperBound) {
  const nb = Number(value);
  return !!nb && nb >= lowerBound && nb <= upperBound;
}

/**
 * Check that given value is a string ending with given suffix.
 *
 * @param {string} value The given value.
 * @param {string} suffix The expected suffix.
 * @returns {boolean} `true` if value is a valid year, `false` otherwise.
 */
function endsWith(value, suffix) {
  if (!value || value.length < suffix.length) {
    return false;
  }

  return value.slice(value.length - suffix.length, value.length) === suffix;
}

/**
 * Count the number of valid passports in given input.
 *
 * @param {string} file File path.
 * @param {Map<string, function>} validators Validators functions.
 * @returns {Promise<number>} A promise resolved with the number of valid passports.
 */
function computeAndValidate(file, validators) {
  return readLines(file).then((lines) => {
    let passport = [];
    let nbValidPassport = 0;

    for (let i = 0; i < lines.length; ++i) {
      const line = lines[i];
      if (line === '') {
        if (passport.length > 0 && isValidPassport(passport, validators)) {
          nbValidPassport++;
        }

        passport = [];
      } else {
        passport.push(line);
      }
    }

    if (passport.length > 0 && isValidPassport(passport, validators)) {
      nbValidPassport++;
    }

    return nbValidPassport;
  });
}

/**
 * Check that given input is a valid passport.
 *
 * @param {string} input The input to check.
 * @param {Map<string, function>} validators The validation functions.
 * @return {boolean} `true` if input is a valid passport, `false` otherwise.
 */
function isValidPassport(input, validators) {
  const passport = input.join(' ');
  const fields = passport.split(' ');
  const map = new Map();

  for (let i = 0; i < fields.length; ++i) {
    const field = fields[i].trim();
    const parts = field.split(':', 2);
    const id = parts[0];
    const value = parts[1];
    map.set(id, value.trim());
  }

  for (const validator of validators.entries()) {
    const id = validator[0];
    if (!map.has(id)) {
      return false;
    }

    const fn = validator[1];
    if (!fn(map.get(id))) {
      return false;
    }
  }

  return true;
}

module.exports = {
  compute1,
  compute2,
};
