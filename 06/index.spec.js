const path = require('path');
const {computeSumOfAllPositiveAnswers, computeSumPositiveAnswers} = require('./index');

describe('day06', () => {
  it('should compute from sample', (done) => {
    computeSumOfAllPositiveAnswers(path.join(__dirname, 'sample.txt'))
      .then((result) => {
        expect(result).toBe(11);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute from input', (done) => {
    computeSumOfAllPositiveAnswers(path.join(__dirname, 'input.txt'))
      .then((result) => {
        expect(result).toBe(6430);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute part 2 from sample', (done) => {
    computeSumPositiveAnswers(path.join(__dirname, 'sample.txt'))
      .then((result) => {
        expect(result).toBe(6);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute part 2 from input', (done) => {
    computeSumPositiveAnswers(path.join(__dirname, 'input.txt'))
      .then((result) => {
        expect(result).toBe(3125);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});