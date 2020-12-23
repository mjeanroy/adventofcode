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

const {readFile, toNumber} = require('../00/index');

/**
 * Compute error rate on given input.
 *
 * @param {string} file File path.
 * @returns {Promise} The error rate on given input.
 */
function computeErrorRate(file) {
  return readFile(file).then((data) => {
    const parts = data.split('\n\n');
    const rules = parseRules(parts[0]);
    return computeTicketsSumOfInvalidFields(parts[2], rules);
  });
}

/**
 * Compute the error rate, i.e the sum of all invalid fields in all tickets
 * according to given rules.
 *
 * @param {string} inputs All the tickets as a raw string.
 * @param {Array<Object>} rules All the rules.
 * @returns {number} The sum of all invalid fields in given tickets.
 */
function computeTicketsSumOfInvalidFields(inputs, rules) {
  return inputs.trim().split('\n').slice(1).reduce((acc, ticket) => acc + computeTicketSumOfInvalidFields(ticket, rules), 0);
}

/**
 * Compute the ticket error rate, i.e the sum of all invalid fields
 * in given ticket.
 *
 * @param {string} ticket The ticket.
 * @param {Array<Object>} rules All the rules.
 * @returns {number} The sum of all the invalid fields in given ticket.
 */
function computeTicketSumOfInvalidFields(ticket, rules) {
  return ticket.trim().split(',').reduce((acc, field) => acc + computeFieldErrorRate(field, rules), 0);
}

/**
 * Compute field error rate.
 *
 * @param {string} field The field.
 * @param {Array<Object>} rules All the rules.
 * @returns {number} The field error rate.
 */
function computeFieldErrorRate(field, rules) {
  const value = toNumber(field);
  return isValid(value, rules) ? 0 : value;
}

/**
 * Check that given field is valid for, at least, one rule.
 *
 * @param {number} field The field to check.
 * @param {Object} rules The rules.
 * @returns {boolean} `true` if field is valid for, at least, one rule, `false` otherwise.
 */
function isValid(field, rules) {
  return rules.some((rule) => (
    (field >= rule.range1[0] && field <= rule.range1[1]) || (field >= rule.range2[0] && field <= rule.range2[1])
  ));
}

/**
 * Parse all rules.
 *
 * For example, following sentences:
 *
 * ```
 * departure location: 33-679 or 691-971
 * departure station: 48-646 or 671-966
 * departure platform: 37-601 or 619-950
 * ```
 *
 * Will returns an array, such as:
 *
 * ```
 * [
 *   {id: 'departure location', range1: [33, 679], range2: [691, 971]},
 *   {id: 'departure station', range1: [48, 646], range2: [671, 966]},
 *   {id: 'departure platform', range1: [37, 601], range2: [619, 950]}
 * ]
 * ```
 *
 * @param {string} inputs All the rules.
 * @returns {Array<Object>} The rules.
 */
function parseRules(inputs) {
  return inputs.trim().split('\n').map((line) => (
    parseRule(line)
  ));
}

/**
 * Parse rule.
 * For example, the following rule: `departure location: 33-679 or 691-971`
 * Will returns an object such as:
 *
 * ```
 * {
 *   id: 'departure location',
 *   range1: [33, 679],
 *   range2: [691, 971]
 * }
 * ```
 * @param {string} rule The rule.
 * @returns {Object} Parsed rule.
 */
function parseRule(rule) {
  const regexp = new RegExp('([\\w ]+): (\\d+)-(\\d+) or (\\d+)-(\\d+)');
  const groups = regexp.exec(rule);
  if (!groups) {
    throw new Error('Cannot parse rule: ' + rule);
  }

  const id = groups[1];
  const range1 = [
    toNumber(groups[2]),
    toNumber(groups[3]),
  ];

  const range2 = [
    toNumber(groups[4]),
    toNumber(groups[5]),
  ];

  return {
    id,
    range1,
    range2,
  };
}

module.exports = {
  computeErrorRate,
};
