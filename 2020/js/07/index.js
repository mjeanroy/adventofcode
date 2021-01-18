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
 * Count, from given rules, the number of bag that eventually contains at least one
 * given bad id.
 *
 * @param {string} file File path containing rules.
 * @returns {Promise<number>} A promise resolved with the number of bags that eventually contains given `target` bag.
 */
function compute1(file) {
  return compute(file, computeCountOfContainedBags);
}

/**
 * Count, from given rules, the number of individual bags required by given
 * bag id.
 *
 * @param {file} file File containing all rules.
 * @returns {number} A promise resolved with the number of required individual bags.
 */
function compute2(file) {
  return compute(file, computeSumOfRequiredBags);
}

/**
 * Compute result from given input.
 *
 * @param {file} file File containing all rules.
 * @param {function} fn The computation functiob.
 * @returns {number} A promise resolved with the result of `fn`.
 */
function compute(file, fn) {
  return readLines(file).then((lines) => {
    const rules = scanRules(lines);
    return fn(rules, 'shiny gold');
  });
}

/**
 * Parse all given rules in given input.
 *
 * @param {Array<string>} lines All the line of input.
 * @returns {Map<string, Map<string, number>>} Parsed rules.
 */
function scanRules(lines) {
  const rules = new Map();

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i].trim();
    if (line[0] === '#') {
      continue;
    }

    const rule = parseRule(line);

    rules.set(
        rule.id,
        rule.quantifiers,
    );
  }

  return rules;
}

/**
 * Count, from given rules, the number of bag that eventually contains at least one
 * given bad id.
 *
 * @param {Map<string, Map<string, number>>} rules All rules from initial input.
 * @param {string} target The bag id to look for.
 * @returns {number} The number of bags that eventually contains given `target` bag.
 */
function computeCountOfContainedBags(rules, target) {
  let count = 0;

  for (const entry of rules.entries()) {
    const quantifiers = entry[1];

    if (containsDirectly(quantifiers, target)) {
      count++;
    } else if (containsTransitively(quantifiers, rules, target)) {
      count++;
    }
  }

  return count;
}

/**
 * Check that given map of quantifiers contains directly a bag identifier.
 *
 * @param {Map<string, number>} quantifiers The quantifiers map.
 * @param {string} target The bad id to look for.
 * @returns {boolean} `true` if given quantifiers rules contains this bag id.
 */
function containsDirectly(quantifiers, target) {
  return quantifiers.has(target);
}

/**
 * Check that given map of quantifiers contains directly or transitively a bag identifier.
 *
 * @param {Map<string, number>} quantifiers The quantifiers map.
 * @param {Map<string, Map<string, number>>} rules All the rules from initial input.
 * @param {string} target The bad id to look for.
 * @returns {boolean} `true` if given quantifiers rules contains this bag id.
 */
function containsTransitively(quantifiers, rules, target) {
  if (!quantifiers || !rules.has(target)) {
    return false;
  }

  if (containsDirectly(quantifiers, target)) {
    return true;
  }

  for (const entry of quantifiers.entries()) {
    const id = entry[0];
    if (containsTransitively(rules.get(id), rules, target)) {
      return true;
    }
  }

  return false;
}

/**
 * Count, from given rules, the number of individual bags required by given
 * bag id.
 *
 * @param {Map<string, Map<string, number>>} rules All rules from initial input.
 * @param {string} target The bag id to look for.
 * @returns {number} The number of required individual bags.
 */
function computeSumOfRequiredBags(rules, target) {
  if (!rules.has(target)) {
    return 0;
  }

  const quantifiers = rules.get(target);
  if (!quantifiers) {
    return 0;
  }

  let sum = 0;

  for (const entry of quantifiers.entries()) {
    const id = entry[0];
    const value = entry[1];
    const count = computeSumOfRequiredBags(rules, id);
    sum += value + value * count;
  }

  return sum;
}

/**
 * Parse rule and extract identifier and quantifiers.
 * For example: `light red bags contain 1 bright white bag, 2 muted yellow bags.`.
 * This parsing function will returns and object such as:
 *
 * ```js
 * {
 *   id: 'light red bags',
 *   quantifiers: [
 *     { id: 'bright white', value: 1 },
 *     { id: 'muted yellow', value: 2 }
 *   ]
 * }
 * ```
 *
 * @param {string} rule The rule to parse.
 * @returns {Object} The rule object.
 */
function parseRule(rule) {
  const parts = rule.split(' contain ');
  const id = parseBagId(parts[0].trim());
  const quantifiers = parseQuantitiers(parts[1].trim());
  return {
    id,
    quantifiers,
  };
}

/**
 * Parse bad id.
 * For example: `light red bags` will returns `light red`.
 *
 * @param {string} input The bag description.
 * @returns {Object} The rule object.
 */
function parseBagId(input) {
  const reg = new RegExp('([a-z A-Z ]*) bags');
  const matchings = reg.exec(input);
  return matchings[1];
}

/**
 * Parse rule quantifiers.
 * For example: `1 bright white bag, 2 muted yellow bags.` will returns a map, such as:
 *
 * ```js
 * Map(
 *   'bright white' => 1,
 *   'muted yellow' => 2,
 * )
 * ```
 *
 * @param {string} input The quantifiers description.
 * @returns {Map<string, value>} The quantifiers objects.
 */
function parseQuantitiers(input) {
  const values = input.split(',');
  const quantifiers = new Map();

  for (let i = 0; i < values.length; ++i) {
    const quantifier = parseQuantifier(values[i].trim());
    if (quantifier) {
      quantifiers.set(quantifier.id, quantifier.value);
    }
  }

  return quantifiers;
}

/**
 * Parse rule quantifier.
 * For example: `1 bright white bag` will returns an object such as:
 *
 * ```js
 * {
 *   id: 'bright white',
 *   value: 1
 * }
 * ```
 *
 * @param {string} input quantifier description.
 * @returns {Object} The quantifier object.
 */
function parseQuantifier(input) {
  if (input === 'no other bags.') {
    return null;
  }

  const reg = new RegExp('([0-9]*) ([a-zA-Z ]*) bag(s?)');
  const matchings = reg.exec(input);
  return {
    id: matchings[2],
    value: toNumber(matchings[1]),
  };
}

module.exports = {
  compute1,
  compute2,
};
