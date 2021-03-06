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
const {part1, part2, computePosition} = require('./index');

describe('day24', () => {
  it('should compute from sample', async () => {
    expect(await part1(path.join(__dirname, 'sample.txt'))).toBe(10);
  });

  it('should compute from input', async () => {
    expect(await part1(path.join(__dirname, 'input.txt'))).toBe(528);
  });

  it('should compute coordinates', async () => {
    expect(computePosition('nwwswee')).toEqual([0, 0]);
  });

  it('should compute black tiles after X day from sample', async () => {
    expect(await part2(path.join(__dirname, 'sample.txt'), 1)).toEqual(15);
    expect(await part2(path.join(__dirname, 'sample.txt'), 10)).toEqual(37);
    expect(await part2(path.join(__dirname, 'sample.txt'), 100)).toEqual(2208);
  });

  it('should compute black tiles after X day from input', async () => {
    expect(await part2(path.join(__dirname, 'input.txt'), 100)).toEqual(4200);
  });
});
