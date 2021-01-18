/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Mickael Jeanroy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const path = require('path');
const {compute, computeProduct} = require('./index');

describe('day03', () => {
  it('should compute from sample', async () => {
    const result = await compute(path.join(__dirname, 'sample.txt'));
    expect(result).toBe(7);
  });

  it('should compute from sample with slopRight = 1 & slopDown = 1', async () => {
    const result = await compute(path.join(__dirname, 'sample.txt'), 1, 1);
    expect(result).toBe(2);
  });

  it('should compute from sample with slopRight = 5 & slopDown = 1', async () => {
    const result = await compute(path.join(__dirname, 'sample.txt'), 5, 1);
    expect(result).toBe(3);
  });

  it('should compute from sample with slopRight = 7 & slopDown = 1', async () => {
    const result = await compute(path.join(__dirname, 'sample.txt'), 7, 1);
    expect(result).toBe(4);
  });

  it('should compute from sample with slopRight = 1 & slopDown = 2', async () => {
    const result = await compute(path.join(__dirname, 'sample.txt'), 1, 2);
    expect(result).toBe(2);
  });

  it('should compute product from sample', async () => {
    const slops = [
      [1, 1],
      [3, 1],
      [5, 1],
      [7, 1],
      [1, 2],
    ];

    const result = await computeProduct(path.join(__dirname, 'sample.txt'), slops);
    expect(result).toBe(336);
  });

  it('should compute from input', async () => {
    const result = await compute(path.join(__dirname, 'input.txt'));
    expect(result).toBe(228);
  });

  it('should compute product from input', async () => {
    const slops = [
      [1, 1],
      [3, 1],
      [5, 1],
      [7, 1],
      [1, 2],
    ];

    const result = await computeProduct(path.join(__dirname, 'input.txt'), slops);
    expect(result).toBe(6818112000);
  });
});
