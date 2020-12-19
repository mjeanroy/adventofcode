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
const {computePair, computeTriplet} = require('./index');

describe('day01', () => {
  it('should compute pair from given sample', async () => {
    const result = await computePair(path.join(__dirname, 'sample.txt'));
    expect(result).toBe(514579);
  });

  it('should compute pair from given input', async () => {
    const result = await computePair(path.join(__dirname, 'input.txt'));
    expect(result).toBe(955584);
  });

  it('should compute triplet from given sample', async () => {
    const result = await computeTriplet(path.join(__dirname, 'sample.txt'));
    expect(result).toBe(241861950);
  });

  it('should compute triplet from given input', async () => {
    const result = await computeTriplet(path.join(__dirname, 'input.txt'));
    expect(result).toBe(287503934);
  });
});
