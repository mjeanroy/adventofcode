const fs = require('fs');

function compute(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const operations = scanOperation(data.split('\n'));
      const nbOperations = operations.length;

      let acc = 0;
      let idx = 0;

      while (idx >= 0 && idx < nbOperations) {
        const op = operations[idx];
        if (op.counter > 0) {
          resolve(acc);
          return;
        }

        const id = op.id;
        if (id === 'acc') {
          acc += op.value;
          idx++;
        } else if (id === 'jmp') {
          idx += op.value;
        } else if (id === 'nop') {
          idx++;
        }

        op.counter++;
      }

      // If we did not resolve, then it is a failure
      reject('Cannot find acc...');
    });
  })
}

function scanOperation(lines) {
  const operations = [];

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i].trim();
    const parts = line.split(' ');
    operations.push({
      id: parts[0].trim(),
      value: toInt(parts[1].trim()),
      counter: 0,
    });
  }

  return operations;
}

function toInt(value) {
  const sign = value.charAt(0);
  const nb = Number(value.slice(1));
  return sign === '-' ? nb * -1 : nb;
}

module.exports = {
  compute,
};
