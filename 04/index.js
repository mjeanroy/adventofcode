const fs = require('fs');

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

function isHex(c) {
  return isDigit(c) || isHexChar(c);
}

function isDigit(c) {
  return c >= '0' && c <= '9';
}

function isHexChar(c) {
  return c >= 'a' && c <= 'f';
}

function validateYear(value, lowerBound, upperBound) {
  if (!value || value.length < 4) {
    return false;
  }

  const nb = Number(value);
  return !!nb && nb >= lowerBound && nb <= upperBound;
}

function validateNumber(value, lowerBound, upperBound) {
  const nb = Number(value);
  return !!nb && nb >= lowerBound && nb <= upperBound;
}

function endsWith(value, suffix) {
  if (!value || value.length < suffix.length) {
    return false;
  }

  return value.slice(value.length - suffix.length, value.length) === suffix;
}

function computeAndValidate(file, validators) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
    
      const lines = data.split(/\r?\n/);
  
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
  
      resolve(nbValidPassport);
    });
  });
}

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
