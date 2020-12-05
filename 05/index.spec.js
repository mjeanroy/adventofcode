const path = require('path');
const {computeHighestSeat, computeMissingSeat} = require('./index');

describe('day05', () => {
  it('should compute from sample', (done) => {
    computeHighestSeat(path.join(__dirname, 'sample.txt'))
      .then((result) => {
        expect(result).toBe(820);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute from input', (done) => {
    computeHighestSeat(path.join(__dirname, 'input.txt'))
      .then((result) => {
        expect(result).toBe(896);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute missing seat from input', (done) => {
    computeMissingSeat(path.join(__dirname, 'input.txt'))
      .then((result) => {
        expect(result).toBe(659);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});