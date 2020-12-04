const fs = require('fs');

function computeRule1(file) {
  return compute(file, isPasswordValidRule1);
}

function computeRule2(file) {
    return compute(file, isPasswordValidRule2);
  }

function compute(file, validator) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
      
        const lines = data.split(/\r?\n/);
        let nbValid = 0;
  
        for (let i = 0; i < lines.length; ++i) {
          if (!lines[i]) {
            continue;
          }
  
          const line = parseLine(lines[i]);
          const rule = parseRule(line.rule);
          const boundaries = parseBoundaries(rule.boundaries);
          if (validator(line.pwd, rule.c, boundaries.min, boundaries.max)) {
            nbValid++;
          }
        }
  
        resolve(nbValid);
      });
    });
  }

function parseBoundaries(boundaries) {
  const boundariesParts = boundaries.split('-', 2);
  const min = Number(boundariesParts[0]);
  const max = Number(boundariesParts[1]);
  return {
    min,
    max,
  };
}

function parseRule(rule) {
  const ruleParts = rule.split(' ', 2);
  const c = ruleParts[1].trim();
  const boundaries = ruleParts[0].trim();
  return {
    c,
    boundaries,
  };
}

function parseLine(line) {
  const parts = line.split(':', 2);
  const pwd = parts[1].trim();
  const rule = parts[0].trim();
  return {
    pwd,
    rule,
  };
}

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
