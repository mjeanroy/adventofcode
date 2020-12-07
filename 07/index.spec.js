const path = require('path');
const {compute1, compute2} = require('./index');

describe('day07', () => {
  it('should compute from sample', (done) => {
    compute1(path.join(__dirname, 'sample.txt'))
      .then((result) => {
        expect(result).toBe(4);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute from input', (done) => {
    compute1(path.join(__dirname, 'input.txt'))
      .then((result) => {
        expect(result).toBe(278);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute sum from sample', (done) => {
    compute2(path.join(__dirname, 'sample.txt'))
      .then((result) => {
        expect(result).toBe(32);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute sum from sample 2', (done) => {
    compute2(path.join(__dirname, 'sample2.txt'))
      .then((result) => {
        expect(result).toBe(126);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute sum from input', (done) => {
    compute2(path.join(__dirname, 'input.txt'))
      .then((result) => {
        expect(result).toBe(45157);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});