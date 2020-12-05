const path = require('path');
const {compute, computeProduct} = require('./index');

describe('day03', () => {
  it('should compute from sample', (done) => {
    compute(path.join(__dirname, 'sample.txt'))
      .then((result) => {
        expect(result).toBe(7);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute from sample with slopRight = 1 & slopDown = 1', (done) => {
    compute(path.join(__dirname, 'sample.txt'), 1, 1)
      .then((result) => {
        expect(result).toBe(2);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute from sample with slopRight = 5 & slopDown = 1', (done) => {
    compute(path.join(__dirname, 'sample.txt'), 5, 1)
      .then((result) => {
        expect(result).toBe(3);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute from sample with slopRight = 7 & slopDown = 1', (done) => {
    compute(path.join(__dirname, 'sample.txt'), 7, 1)
      .then((result) => {
        expect(result).toBe(4);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute from sample with slopRight = 1 & slopDown = 2', (done) => {
    compute(path.join(__dirname, 'sample.txt'), 1, 2)
      .then((result) => {
        expect(result).toBe(2);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute product from sample', (done) => {
    const slops = [
      [1, 1],
      [3, 1],
      [5, 1],
      [7, 1],
      [1, 2],
    ];

    computeProduct(path.join(__dirname, 'sample.txt'), slops)
      .then((result) => {
        expect(result).toBe(336);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute from input', (done) => {
    compute(path.join(__dirname, 'input.txt'))
      .then((result) => {
        expect(result).toBe(228);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should compute product from input', (done) => {
    const slops = [
      [1, 1],
      [3, 1],
      [5, 1],
      [7, 1],
      [1, 2],
    ];

    computeProduct(path.join(__dirname, 'input.txt'), slops)
      .then((result) => {
        expect(result).toBe(6818112000);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});