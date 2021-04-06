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

const path = require('path');
const {part1, part2} = require('./index');

describe('01', () => {
  describe('part1', () => {
    it('should compute mass of sample', async () => {
      const sum = await part1(path.join(__dirname, 'sample.txt'));
      expect(sum).toBe(3375990);
    });

    it('should compute mass of input', async () => {
      const sum = await part1(path.join(__dirname, 'input.txt'));
      expect(sum).toBe(3375962);
    });
  });

  describe('part2', () => {
    it('should compute sample', async () => {
      const sum = await part2(path.join(__dirname, 'sample.txt'));
      expect(sum).toBe(51316);
    });

    it('should compute input', async () => {
      const sum = await part2(path.join(__dirname, 'input.txt'));
      expect(sum).toBe(5061072);
    });
  });
});
