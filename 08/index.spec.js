const path = require('path');
const {compute} = require('./index');

describe('day08', () => {
  it('should compute from sample', (done) => {
    compute(path.join(__dirname, 'sample.txt'))
      .then((result) => {
        expect(result).toBe(5);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute from input', (done) => {
    compute(path.join(__dirname, 'input.txt'))
      .then((result) => {
        expect(result).toBe(1797);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});