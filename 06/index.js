const fs = require('fs');

function computeSumOfAllPositiveAnswers(file) {
  return compute(file, computeAllPositiveAnswers);
}

function computeSumPositiveAnswers(file) {
  return compute(file, computePositiveAnswers);
}

function compute(file, computeFn) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const groups = data.split('\n\n');

      let sum = 0;

      for (let i = 0; i < groups.length; ++i) {
        sum += computeFn(
          groups[i].trim()
        );
      }

      resolve(sum);
    });
  });
}

function computeAllPositiveAnswers(group) {
  const positiveAnswers = toSet(group);
  return positiveAnswers.size;
}

function computePositiveAnswers(group) {
  const peoples = group.split('\n');

  let positiveAnswers = null;

  for (let i = 0; i < peoples.length; ++i) {
    const currentPositiveAnswers = toSet(
      peoples[i]
    );

    if (positiveAnswers === null) {
      // Start with the first group as a base.
      positiveAnswers = currentPositiveAnswers;
    } else {
      // Keep only answers appearing in previous set current set.
      retainAll(positiveAnswers, currentPositiveAnswers);
    }
  }

  return positiveAnswers === null ? 0 : positiveAnswers.size;
}

function toSet(group) {
  const answers = group.split('');
  const positiveAnswers = new Set();

  for (let i = 0; i < answers.length; ++i) {
    const answer = answers[i].trim();
    if (answer) {
      positiveAnswers.add(answer);
    }
  }

  return positiveAnswers;
}

function retainAll(set1, set2) {
  for (const v of set1.values()) {
    if (!set2.has(v)) {
      set1.delete(v);
    }
  }
}

module.exports = {
  computeSumOfAllPositiveAnswers,
  computeSumPositiveAnswers,
};
