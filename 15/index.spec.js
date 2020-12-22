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

describe('day15', () => {
  it('should compute sample', async () => {
    const result = await compute(path.join(__dirname, 'sample.txt'));
    expect(result).toBe(436);
  });

  it('should compute sample1', async () => {
    const result = await compute(path.join(__dirname, 'sample1.txt'));
    expect(result).toBe(1);
  });

  it('should compute sample2', async () => {
    const result = await compute(path.join(__dirname, 'sample2.txt'));
    expect(result).toBe(10);
  });

  it('should compute sample3', async () => {
    const result = await compute(path.join(__dirname, 'sample3.txt'));
    expect(result).toBe(27);
  });

  it('should compute sample4', async () => {
    const result = await compute(path.join(__dirname, 'sample4.txt'));
    expect(result).toBe(78);
  });

  it('should compute sample5', async () => {
    const result = await compute(path.join(__dirname, 'sample5.txt'));
    expect(result).toBe(438);
  });

  it('should compute input', async () => {
    const result = await compute(path.join(__dirname, 'input.txt'));
    expect(result).toBe(492);
  });
});
