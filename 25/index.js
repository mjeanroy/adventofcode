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

/**
 * Compute the encryption key, given the card public key and the door public key.
 *
 * @param {number} cardPublicKey The card public key.
 * @param {number} doorPublicKey The door public key.
 * @returns {number} The encryption key.
 */
function part1(cardPublicKey, doorPublicKey) {
  const cardLoop = handshake(7, cardPublicKey);
  const doorLoop = handshake(7, doorPublicKey);
  const e1 = transform(doorPublicKey, cardLoop);
  const e2 = transform(cardPublicKey, doorLoop);
  if (e1 !== e2) {
    throw new Error('Encryption keys does not match');
  }

  return e1;
}

/**
 * Transform the given subject number to the encryption key by looping
 * exactly `loopSize` times.
 *
 * @param {number} subjectNumber The subject number.
 * @param {number} loopSize The loop size.
 * @returns {number} The encryption key.
 */
function transform(subjectNumber, loopSize) {
  let value = 1;

  for (let i = 0; i < loopSize; ++i) {
    value = process(value, subjectNumber);
  }

  return value;
}

/**
 * The handshake used by the card and the door involves an operation that transforms a subject number.
 * To transform a subject number, start with the value 1.
 * Then, a number of times called the loop size, perform the following steps:
 * - Set the value to itself multiplied by the subject number.
 * - Set the value to the remainder after dividing the value by 20201227.
 *
 * @param {number} subjectNumber The subject number.
 * @param {number} publicKey The known public key.
 * @returns {number} The number of loop before reaching the public key value.
 */
function handshake(subjectNumber, publicKey) {
  let value = 1;
  let nbLoop = 0;

  while (value !== publicKey) {
    value = process(value, subjectNumber);
    nbLoop++;
  }

  return nbLoop;
}

/**
 * Compute the next value according to the current value
 * and the given subject number.
 *
 * @param {number} value The value.
 * @param {number} subjectNumber The subject number.
 * @returns {number} The next value.
 */
function process(value, subjectNumber) {
  return (value * subjectNumber) % 20201227;
}

module.exports = {
  part1,
};
