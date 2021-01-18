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
const {compute} = require('./index');

describe('day15 - part2', () => {
  it('should compute sample', async () => {
    expect(await compute(path.join(__dirname, 'sample.txt'), 30000000)).toBe(175594);
  });

  it('should compute sample1', async () => {
    expect(await compute(path.join(__dirname, 'sample1.txt'), 30000000)).toBe(2578);
  });

  it('should compute sample2', async () => {
    expect(await compute(path.join(__dirname, 'sample2.txt'), 30000000)).toBe(3544142);
  });

  it('should compute sample3', async () => {
    expect(await compute(path.join(__dirname, 'sample3.txt'), 30000000)).toBe(261214);
  });

  it('should compute sample4', async () => {
    expect(await compute(path.join(__dirname, 'sample4.txt'), 30000000)).toBe(6895259);
  });

  it('should compute sample5', async () => {
    expect(await compute(path.join(__dirname, 'sample5.txt'), 30000000)).toBe(18);
  });

  it('should compute sample6', async () => {
    expect(await compute(path.join(__dirname, 'sample6.txt'), 30000000)).toBe(362);
  });

  it('should compute input', async () => {
    expect(await compute(path.join(__dirname, 'input.txt'), 30000000)).toBe(63644);
  });
});
