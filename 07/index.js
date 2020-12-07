const fs = require('fs');

function compute1(file) {
  return compute(file, computeCountOfContainedBags);
}

function compute2(file) {
  return compute(file, computeSumOfRequiredBags);
}

function compute(file, fn) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const rules = scanRules(data);

      resolve(
        fn(rules, 'shiny gold')
      );
    });
  });
}

function scanRules(data) {
  const lines = data.split('\n');
  const rules = new Map();

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i].trim();
    if (line[0] === '#') {
      continue;
    }

    const rule = parseRule(line);

    rules.set(
      rule.id,
      rule.quantifiers
    );
  }

  return rules;
}

function computeCountOfContainedBags(rules, target) {
  let count = 0;

  for (const entry of rules.entries()) {
    const quantifiers = entry[1];

    // Check for direct match.
    if (containsDirectly(quantifiers, target)) {
      count++;
    }

    // Check for transitive match.
    else if (containsTransitively(quantifiers, rules, target)) {
      count++;
    }
  }

  return count;
}

function containsDirectly(quantifiers, target) {
  return quantifiers.has(target);
}

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

function parseRule(rule) {
  const parts = rule.split(' contain ');
  const id = parseBagId(parts[0].trim());
  const quantifiers = parseQuantitiers(parts[1].trim());
  return {
    id,
    quantifiers,
  };
}

function parseBagId(input) {
  const reg = new RegExp('([a-z A-Z ]*) bags');
  const matchings = reg.exec(input);
  return matchings[1];
}

function parseQuantitiers(input) {
  const values = input.split(',');
  const quantifiers = new Map();

  for (let i  = 0; i < values.length; ++i) {
    const quantifier = parseQuantifier(values[i].trim());
    if (quantifier) {
      quantifiers.set(quantifier.id, quantifier.value);
    }
  }

  return quantifiers;
}

function parseQuantifier(input) {
  if (input === 'no other bags.') {
    return null;
  }

  const reg = new RegExp('([0-9]*) ([a-zA-Z ]*) bag(s?)');
  const matchings = reg.exec(input);
  return {
    id: matchings[2],
    value: Number(matchings[1]),
  };
}
module.exports = {
  compute1,
  compute2,
};
