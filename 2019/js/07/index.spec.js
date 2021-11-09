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

describe('day07', () => {
  describe('part01', () => {
    it('should compute samples', async () => {
      expect(await(part01('sample1_part1.txt'))).toBe(43210);
      expect(await(part01('sample2_part1.txt'))).toBe(54321);
      expect(await(part01('sample3_part1.txt'))).toBe(65210);
    });

    it('should compute input', async () => {
      expect(await(part01('input.txt'))).toBe(67023);
    });
  });

  describe('part02', () => {
    it('should compute samples', async () => {
      expect(await(part02('sample1_part2.txt'))).toBe(139629729);
      expect(await(part02('sample2_part2.txt'))).toBe(18216);
    });

    it('should compute input', async () => {
      expect(await(part02('input.txt'))).toBe(7818398);
    });
  });
});
