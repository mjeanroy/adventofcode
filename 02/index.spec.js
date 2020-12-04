const path = require('path');
const {computeRule1, computeRule2} = require('./index');

describe('day02', () => {
  it('should compute number of valid passwords given sample according to rule 1', (done) => {
    computeRule1(path.join(__dirname, 'sample.txt'))
      .then((result) => {
        expect(result).toBe(2);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute number of valid passwords given input according to rule 1', (done) => {
    computeRule1(path.join(__dirname, 'input.txt'))
      .then((result) => {
        expect(result).toBe(591);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute number of valid passwords given sample according to rule 2', (done) => {
    computeRule2(path.join(__dirname, 'sample.txt'))
      .then((result) => {
        expect(result).toBe(1);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute number of valid passwords given input according to rule 2', (done) => {
    computeRule2(path.join(__dirname, 'input.txt'))
      .then((result) => {
        expect(result).toBe(335);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});