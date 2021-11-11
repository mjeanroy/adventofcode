/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2021 Mickael Jeanroy
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

const {part01, part02} = require('./index');

describe('day 10', () => {
  describe('part 01', () => {
    it('should compute sample', async () => {
      expect(await part01('sample1_part1.txt')).toEqual(8);
      expect(await part01('sample2_part1.txt')).toEqual(33);
      expect(await part01('sample3_part1.txt')).toEqual(35);
      expect(await part01('sample4_part1.txt')).toEqual(41);
      expect(await part01('sample5_part1.txt')).toEqual(210);
    });

    it('should compute input', async () => {
      expect(await part01('input.txt')).toBe(263);
    });
  });

  describe('part 02', () => {
    it('should compute sample', async () => {
      expect(await part02('sample_part2.txt', 9)).toBe(1501);
    });

    it('should compute input', async () => {
      expect(await part02('input.txt', 200)).toBe(1110);
    });
  });
});
