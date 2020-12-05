const path = require('path');
const {compute1, compute2} = require('./index');

describe('day04', () => {
  it('should compute from sample', (done) => {
    compute1(path.join(__dirname, 'sample.txt'))
      .then((result) => {
        expect(result).toBe(2);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute from input', (done) => {
    compute1(path.join(__dirname, 'input.txt'))
      .then((result) => {
        expect(result).toBe(192);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute with custom rules from sample 2', (done) => {
    compute2(path.join(__dirname, 'sample2.txt'))
      .then((result) => {
        expect(result).toBe(0);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute with custom rules from sample 3', (done) => {
    compute2(path.join(__dirname, 'sample3.txt'))
      .then((result) => {
        expect(result).toBe(4);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute with custom rules from input 2', (done) => {
    compute2(path.join(__dirname, 'input2.txt'))
      .then((result) => {
        expect(result).toBe(101);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});