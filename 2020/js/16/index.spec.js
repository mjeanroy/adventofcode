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
const {computeErrorRate, computeProduct} = require('./index');

describe('day15 - part1', () => {
  it('should compute error rate from sample', async () => {
    expect(await computeErrorRate(path.join(__dirname, 'sample.txt'))).toBe(71);
  });

  it('should compute error rate from input', async () => {
    expect(await computeErrorRate(path.join(__dirname, 'input.txt'))).toBe(29878);
  });

  it('should compute product of class fields from sample', async () => {
    expect(await computeProduct(path.join(__dirname, 'sample_part2.txt'), 'class')).toBe(12);
  });

  it('should compute product of departure fields from input', async () => {
    expect(await computeProduct(path.join(__dirname, 'input.txt'), 'departure')).toBe(855438643439);
  });
});
