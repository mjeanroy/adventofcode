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
const {computeEarliestBusId, computeEarliestTimestamp} = require('./index');

describe('day13', () => {
  it('should compute earliest bus ID from sample', async () => {
    const result = await computeEarliestBusId(path.join(__dirname, 'sample.txt'));
    expect(result).toBe(295);
  });

  it('should compute earliest bus ID from input', async () => {
    const result = await computeEarliestBusId(path.join(__dirname, 'input.txt'));
    expect(result).toBe(136);
  });

  it('should compute earliest tt from sample', async () => {
    const result = await computeEarliestTimestamp(path.join(__dirname, 'sample.txt'));
    expect(result).toBe(BigInt(1068781));
  });

  it('should compute earliest tt from sample_2', async () => {
    const result = await computeEarliestTimestamp(path.join(__dirname, 'sample_2.txt'));
    expect(result).toBe(BigInt(3417));
  });

  it('should compute earliest tt from sample_3', async () => {
    const result = await computeEarliestTimestamp(path.join(__dirname, 'sample_3.txt'));
    expect(result).toBe(BigInt(754018));
  });

  it('should compute earliest tt from sample_4', async () => {
    const result = await computeEarliestTimestamp(path.join(__dirname, 'sample_4.txt'));
    expect(result).toBe(BigInt(779210));
  });

  it('should compute earliest tt from sample_5', async () => {
    const result = await computeEarliestTimestamp(path.join(__dirname, 'sample_5.txt'));
    expect(result).toBe(BigInt(1261476));
  });

  it('should compute earliest tt from sample_6', async () => {
    const result = await computeEarliestTimestamp(path.join(__dirname, 'sample_6.txt'));
    expect(result).toBe(BigInt(1202161486));
  });

  it('should compute earliest tt from input', async () => {
    const result = await computeEarliestTimestamp(path.join(__dirname, 'input.txt'));
    expect(result).toBe(BigInt(305068317272992));
  });
});
