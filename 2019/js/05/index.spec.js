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

describe('day 05', () => {
  describe('part01', () => {
    it('should compute output for sample', async () => {
      const outputs = await part01('sample.txt');
      expect(outputs).toBeNull();
    });

    it('should compute output for input', async () => {
      const outputs = await part01('input.txt');
      expect(outputs).toEqual(9938601);
    });
  });

  describe('part02', () => {
    it('should compute output for sample1.txt', async () => {
      const r1 = await part02('sample1.txt', 1);
      const r2 = await part02('sample1.txt', 8);
      const r3 = await part02('sample1.txt', 10);

      expect(r1).toEqual(999);
      expect(r2).toEqual(1000);
      expect(r3).toEqual(1001);
    });

    it('should compute output for input.txt', async () => {
      const result = await part02('input.txt', 5);
      expect(result).toEqual(4283952);
    });
  });
});
