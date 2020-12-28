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
const {compute, computeExpression} = require('./index');

describe('day18', () => {
  it('should compute value from expression', async () => {
    expect(await compute(path.join(__dirname, 'expr.txt'))).toBe(71);
  });

  it('should compute value from expression with parenthesis', async () => {
    expect(await compute(path.join(__dirname, 'expr_parenthesis.txt'))).toBe(51);
  });

  it('should compute expression', () => {
    expect(computeExpression('2 * 3 + (4 * 5)')).toBe(26);
    expect(computeExpression('5 + (8 * 3 + 9 + 3 * 4 * 3)')).toBe(437);
    expect(computeExpression('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))')).toBe(12240);
    expect(computeExpression('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2')).toBe(13632);
  });

  it('should compute value from input', async () => {
    expect(await compute(path.join(__dirname, 'input.txt'))).toBe(4940631886147);
  });
});
