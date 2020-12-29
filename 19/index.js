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

const {readFile} = require('../00/index');

/**
 * Parse file and compute the number of invalid messages according
 * to given rules descibed in the first part of the file.
 *
 * @param {string} file File path.
 * @returns {Promise<number>} A promise resolved with the number of invalid messages.
 */
function compute(file) {
  return readFile(file).then((data) => {
    const parts = data.split('\n\n');
    const rules = parseRules(parts[0].trim().split('\n'));
    const regexp = produceRegex(rules);
    const messages = parts[1].trim().split('\n');
    return messages.reduce((acc, message) => acc + (isValid(message, regexp) ? 1 : 0), 0);
  });
}

/**
 * Check that a given message is valid according to given rules.
 *
 * @param {string} message The message.
 * @param {RegExp} regexp The regexp to use as a validator.
 * @returns {boolean} `true` if message is valid, `false` otherwise.
 */
function isValid(message, regexp) {
  return !!regexp.exec(message);
}

/**
 * Produce regexp of rule 0 according to the rule dictionary.
 *
 * @param {Map<string, string>} rules The rules.
 * @returns {RegExp} The final regexp.
 */
function produceRegex(rules) {
  const middle = extractTerminalValue('0', rules);
  const pattern = `^${middle}$`;
  return new RegExp(pattern);
}

/**
 * Extract the terminal value of given rule id (go up in the graph if needed).
 *
 * @param {string} id The rule id.
 * @param {Map<string, string>} rules The rules.
 * @param {Map<string, string>} memo A cache of already computed values.
 * @returns {string} The terminal value.
 */
function extractTerminalValue(id, rules, memo = new Map()) {
  if (!rules.has(id)) {
    throw new Error('Cannot find rule: ' + id);
  }

  if (memo.has(id)) {
    return memo.get(id);
  }

  const value = rules.get(id);
  if (isTerminalValue(value)) {
    const result = value[1];

    // Store in cache.
    memo.set(id, result);

    return result;
  }

  const parts = value.split('|');
  const terminalValues = parts.map((part) => (
    part.trim().split(' ').map((id) => extractTerminalValue(id, rules, memo)).join('')
  ));

  const result = `(${terminalValues.join('|')})`;

  // Store in cache.
  memo.set(id, result);

  return result;
}

/**
 * Check that a given value is a "terminal" value, i.e something like: `"[a letter]"`.
 *
 * @param {string} value The value to check.
 * @returns {boolean} `true` if `value` is a terminal value, `false` otherwise.
 */
function isTerminalValue(value) {
  const rg = new RegExp('"[a-z]"');
  return rg.exec(value);
}

/**
 * Parse given rules and index them into a map.
 *
 * @param {Array<string>} rules The rules.
 * @returns {Map<string, string>} A map of all rules.
 */
function parseRules(rules) {
  const map = new Map();

  for (let i = 0; i < rules.length; ++i) {
    const rule = parseRule(rules[i]);
    map.set(rule.id, rule.value);
  }

  return map;
}

/**
 * Parse given rule.
 *
 * @param {string} rule The rule.
 * @returns {Map<string, string>} A map of all rules.
 */
function parseRule(rule) {
  const regexp = new RegExp('(\\d+): (.+)');
  const matchings = regexp.exec(rule);
  if (!matchings) {
    throw new Error('Cannot parse given rule: ' + rule);
  }

  return {
    id: matchings[1].trim(),
    value: matchings[2].trim(),
  };
}

module.exports = {
  compute,
};
