const path = require('path');
const {computePair, computeTriplet} = require('./index');

describe('day01', () => {
  it('should compute pair from given sample', (done) => {
    computePair(path.join(__dirname, 'sample.txt'))
      .then((result) => {
        expect(result).toBe(514579);
        done();
      })
      .catch((err) => {
        done.fail(err);
      });
  });

  it('should compute pair from given input', (done) => {
    computePair(path.join(__dirname, 'input.txt'))
      .then((result) => {
        expect(result).toBe(955584);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute triplet from given sample', (done) => {
    computeTriplet(path.join(__dirname, 'sample.txt'))
      .then((result) => {
        expect(result).toBe(241861950);
        done();
      })
      .catch((err) => {
        done.fail(err);
      });
  });

  it('should compute triplet from given input', (done) => {
    computeTriplet(path.join(__dirname, 'input.txt'))
      .then((result) => {
        expect(result).toBe(287503934);
        done();
      })
      .catch((err) => {
        done.fail(err);
      });
  });
});