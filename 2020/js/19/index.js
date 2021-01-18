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

/* eslint-disable brace-style */

const {readParagraphs, sumOf} = require('../00/index');

/**
 * Parse file and compute the number of invalid messages according
 * to given rules descibed in the first part of the file.
 *
 * @param {string} file File path.
 * @returns {Promise<number>} A promise resolved with the number of invalid messages.
 */
function part1(file) {
  return run(file, false);
}

/**
 * Parse file and compute the number of invalid messages according
 * to given rules descibed in the first part of the file.
 *
 * @param {string} file File path.
 * @returns {Promise<number>} A promise resolved with the number of invalid messages.
 */
function part2(file) {
  return run(file, true);
}

/**
 * Parse file and compute the number of invalid messages according
 * to given rules descibed in the first part of the file.
 *
 * If second parameter is equal to `true`, then rules 8 and 11 are updated
 * with the following semantic;
 *   `8: 42 | 42 8`
 *   `11: 42 31 | 42 11 31`
 *
 * @param {string} file File path.
 * @param {boolean} overrideRules Flag to override rules 8 and 11 such as described in puzzle.
 * @returns {Promise<number>} A promise resolved with the number of invalid messages.
 */
function run(file, overrideRules) {
  return readParagraphs(file).then((paragraphs) => {
    const rules = parseRules(paragraphs[0].trim().split('\n'));

    // A good way would have been to take care of this while creating the final regexp.
    // But... I really don't know how to specify a recursive regexp, especially for the rule 11...
    // The rule 8 is not so hard, since it is only a simple repetition.
    // The rule 11 is hard since it is a symetric repetition between a left and right part.
    if (overrideRules) {
      rules.set('8', '42 | 42+');
      rules.set('11', `42 31 | ${generateSymetricQuantifiers('42', '31', 10)}`);
    }

    const regexp = produceRegex(rules, overrideRules);
    const messages = paragraphs[1].trim().split('\n');
    return sumOf(messages, (message) => (
      isValid(message, regexp) ? 1 : 0
    ));
  });
}

/**
 * Generate patterns where a left and a right value are repeated in a symetric way.
 *
 * For example:
 *
 *  1: `LEFT RIGHT`
 *  2: `LEFT LEFT RIGHT RIGHT`
 *  3: `LEFT LEFT LEFT RIGHT RIGHT RIGHT`
 *  ...
 *
 * @param {string} left The left part of the rule.
 * @param {string} right The right part of the rule.
 * @param {number} n The number of repetition.
 * @returns {string} The regexp part.
 */
function generateSymetricQuantifiers(left, right, n) {
  const outputs = [];

  for (let i = 1; i <= n; ++i) {
    outputs.push(`${left}{${i}} ${right}{${i}}`);
  }

  return outputs.join(' | ');
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
  const terminalValues = parts.map((part) => {
    const inputs = part.trim().split(' ');
    const outputs = [];

    for (let i = 0; i < inputs.length; ++i) {
      const x = inputs[i].trim();

      if (x !== id) {
        const ref = parseRuleReference(x);

        let rg = extractTerminalValue(ref.id, rules, memo);
        if (ref.quantifier) {
          rg += ref.quantifier;
        }

        outputs.push(rg);
      }
    }

    return outputs.join('');
  });

  const result = `(${terminalValues.join('|')})`;

  // Store in cache.
  memo.set(id, result);

  return result;
}

/**
 * Parse a rule reference.
 *
 * For example:
 *
 * - `parseRuleReference('42')` => {id: '42', quantifier: null}
 * - `parseRuleReference('42+')` => {id: '42', quantifier: '+'}
 * - `parseRuleReference('42{1}')` => {id: '42', quantifier: '{1}'}
 *
 * @param {string} ruleId The rule ID.
 * @returns {Object} The rule, with its ID and an optional quantifier.
 */
function parseRuleReference(ruleId) {
  const rg = new RegExp('(\\d+)(.+)?');
  const matchings = rg.exec(ruleId);
  if (!matchings) {
    throw new Error('Cannot parse rule id: ' + ruleId);
  }

  return {
    id: matchings[1],
    quantifier: matchings[2] || null,
  };
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
  part1,
  part2,
};
