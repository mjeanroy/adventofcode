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

describe('day 12', () => {
  describe('part 01', () => {
    it('should compute sample', async () => {
      expect(await part01('sample1.txt', 10)).toBe(179);
      expect(await part01('sample2.txt', 100)).toBe(1940);
    });

    it('should compute input', async () => {
      expect(await part01('input.txt', 100)).toBe(1504);
      expect(await part01('input.txt', 1000)).toBe(7928);
    });
  });

  describe('part 02', () => {
    it('should compute sample', async () => {
      expect(await part02('sample1.txt')).toBe(2772);
      expect(await part02('sample2.txt')).toBe(4686774924);
    });

    it('should compute input', async () => {
      expect(await part02('input.txt')).toBe(518311327635164);
    });
  });
});
