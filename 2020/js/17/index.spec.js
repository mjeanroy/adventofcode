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
const {compute3D, compute4D} = require('./index');

describe('day17', () => {
  it('should compute active cubes in 3D grid from sample', async () => {
    expect(await compute3D(path.join(__dirname, 'sample.txt'))).toBe(112);
  });

  it('should compute active cubes in 3D grid from input', async () => {
    expect(await compute3D(path.join(__dirname, 'input.txt'))).toBe(384);
  });

  it('should compute active cubes in 4D grid from sample', async () => {
    expect(await compute4D(path.join(__dirname, 'sample.txt'))).toBe(848);
  });

  it('should compute active cubes in 4D grid from input', async () => {
    expect(await compute4D(path.join(__dirname, 'input.txt'))).toBe(2012);
  });
});
