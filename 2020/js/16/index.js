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

const {readParagraphs, sumOf, toNumber} = require('../00/index');

/**
 * Compute error rate on given input.
 *
 * @param {string} file File path.
 * @returns {Promise} The error rate on given input.
 */
function computeErrorRate(file) {
  return readParagraphs(file).then((paragraphs) => {
    const rules = parseRules(paragraphs[0]);
    return computeTicketsSumOfInvalidFields(paragraphs[2], rules);
  });
}

/**
 * Compute error rate on given input.
 *
 * @param {string} file File path.
 * @param {string} prefix Rule id prefix to look for.
 * @returns {Promise} The error rate on given input.
 */
function computeProduct(file, prefix = 'departure') {
  return readParagraphs(file).then((paragraphs) => {
    const rules = parseRules(paragraphs[0]);
    const tickets = findValidTickets(paragraphs[2], rules);
    const validRules = identifyRules(tickets, rules);
    const myTicket = paragraphs[1].split('\n')[1];
    return computeTicketProduct(myTicket, validRules, prefix);
  });
}

/**
 * Compute the product of all fields in given ticket corresponding to given rules to consider.
 *
 * @param {string} rawTicket The ticket as a raw string.
 * @param {Array<string>} rules All the rules in order.
 * @param {string} prefix The prefix of rules to consider.
 * @returns {number} The product of all fields corresponding to given rules to consider.
 */
function computeTicketProduct(rawTicket, rules, prefix) {
  const ticket = parseTicket(rawTicket);

  let product = 1;

  for (let i = 0; i < rules.length; ++i) {
    const id = rules[i];
    if (id.startsWith(prefix)) {
      product *= ticket[i];
    }
  }

  return product;
}

/**
 * Parse given ticket.
 *
 * @param {string} rawTicket Ticket as a raw string.
 * @returns {Array<number>} Parsed ticket.
 */
function parseTicket(rawTicket) {
  return rawTicket.trim().split(',').map((field) => toNumber(field));
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
  return sumOf(inputs.trim().split('\n').slice(1), (ticket) => (
    computeTicketSumOfInvalidFields(ticket, rules)
  ));
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
  return sumOf(ticket.trim().split(','), (field) => (
    computeFieldErrorRate(field, rules)
  ));
}

/**
 * Extract all valid tickets from given input.
 *
 * @param {string} inputs The raw tickets.
 * @param {Array<Object>} rules The rules.
 * @returns {Array<string>} All the valid tickets.
 */
function findValidTickets(inputs, rules) {
  return inputs.trim().split('\n').slice(1).filter((ticket) => (
    isValidTicket(ticket, rules)
  ));
}

/**
 * Check that given ticket is valid according to given rules.
 *
 * @param {string} ticket The ticket.
 * @param {Array<Object>} rules The rules.
 * @returns {boolean} `true` if ticket is valid, `false` otherwise.
 */
function isValidTicket(ticket, rules) {
  const fields = ticket.split(',');
  for (let i = 0; i < fields.length; ++i) {
    if (!isValidField(toNumber(fields[i]), rules)) {
      return false;
    }
  }

  return true;
}

/**
 * Compute the error rate, i.e the sum of all invalid fields in all tickets
 * according to given rules.
 *
 * @param {Array<string>} tickets All the tickets.
 * @param {Array<Object>} rules All the rules.
 * @returns {number} The sum of all invalid fields in given tickets.
 */
function identifyRules(tickets, rules) {
  // First, build an array with all possible solutions
  const allPossible = [];
  const ruleIds = rules.map((rule) => rule.id);
  for (let i = 0; i < tickets[0].split(',').length; ++i) {
    allPossible[i] = new Set(ruleIds);
  }

  // Then, iterate over all tickets, and starts to eliminate solutions.
  for (let i = 0; i < tickets.length; ++i) {
    const ticket = tickets[i];
    const fields = ticket.split(',');
    for (let j = 0; j < fields.length; ++j) {
      const field = toNumber(fields[j]);
      for (let k = 0; k < rules.length; ++k) {
        const rule = rules[k];
        if (!isValidFieldForRule(field, rule)) {
          allPossible[j].delete(rule.id);
        }
      }
    }
  }

  // Finally, start to iterate to remove duplicated solutions until we have found everything.
  // We should not stop until it becomes stable...
  // Can we do better?

  const results = allPossible.map(() => null);
  let nbFound = 0;

  while (nbFound !== allPossible.length) {
    // Keep in mind what we find in this iteration, we'll use it after to remove
    // duplications.
    const newFound = new Map();

    for (let i = 0; i < allPossible.length; ++i) {
      if (results[i] !== null) {
        // We already found this one, skip it.
        continue;
      }

      // Check if we have found something new.
      const possibilities = allPossible[i];
      if (possibilities.size === 1) {
        const value = possibilities.values().next().value;
        results[i] = value;
        nbFound++;

        // Remember what we found.
        newFound.set(i, value);
      }
    }

    // If we don't find anything, then it means we won't be able to find the right solution,
    // we are in an ended loop.
    if (newFound.size === 0) {
      throw new Error('It looks like we cannot find the right combination, the loop will never stopped...');
    }

    // Remove duplications from what we just found.
    for (const entry of newFound.entries()) {
      for (let i = 0; i < allPossible.length; ++i) {
        if (i !== entry[0]) {
          allPossible[i].delete(entry[1]);
        }
      }
    }
  }

  return results;
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
  return isValidField(value, rules) ? 0 : value;
}

/**
 * Check that given field is valid for, at least, one rule.
 *
 * @param {number} field The field to check.
 * @param {Array<Object>} rules The rules.
 * @returns {boolean} `true` if field is valid for, at least, one rule, `false` otherwise.
 */
function isValidField(field, rules) {
  return rules.some((rule) => (
    isValidFieldForRule(field, rule)
  ));
}

/**
 * Check that given field is valid for this rule.
 *
 * @param {number} field The field to check.
 * @param {Object} rule The rule.
 * @returns {boolean} `true` if field is valid for this rule, `false` otherwise.
 */
function isValidFieldForRule(field, rule) {
  return (field >= rule.range1[0] && field <= rule.range1[1]) || (field >= rule.range2[0] && field <= rule.range2[1]);
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
  computeProduct,
};
