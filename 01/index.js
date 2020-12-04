const fs = require('fs');

function computePair(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const lines = data.split(/\r?\n/);
      const pair = findPairs(lines, 2020);
      if (!pair) {
        reject('Cannot find result');
        return;
      }
      
      resolve(pair[0] * pair[1]);
    });
  })
}

function computeTriplet(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
  
      const lines = data.split(/\r?\n/);
  
      for (let i = 0; i < lines.length; ++i) {
        const value = lines[i].trim();
        const target = 2020 - value;

        // Now we can find pair for this target value.
        const pair = findPairs(lines, target);
        if (pair) {
          resolve(value * pair[0] * pair[1]);
          return;
        }
      }

      reject('Cannot find result');
    });
  })
}

function findPairs(inputs, target) {
  const set = new Set();
  for (let i = 0; i < inputs.length; ++i) {
    const value = inputs[i].trim();
    const nb = Number(value);
    const lookingFor = target - nb;
    if (set.has(lookingFor)) {
      return [nb, lookingFor];
    }

    set.add(nb);
  }

  return null;
}

module.exports = {
  computePair,
  computeTriplet,
};
  
