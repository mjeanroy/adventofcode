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
const {readFile, toNumber} = require('../00/index');

class Layer {
  constructor(pixels) {
    this._pixels = pixels.slice();
    this._counts = new Map();
    this._initializeCounters();
  }

  countNumberOf(digit = 0) {
    return this._counts.get(digit) ?? 0;
  }

  _initializeCounters() {
    for (let i = 0; i < this._pixels.length; ++i) {
      const digit = this._pixels[i];
      this._counts.set(digit, (this._counts.get(digit) ?? 0) + 1);
    }
  }
}

function part01(fileName, pixelWide = 25, pixelTall = 6) {
  const file = path.join(__dirname, fileName);
  return readFile(file).then((content) => {
    const digits = content.trim();
    const layers = [];
    const nbDigitsPerPayer = pixelWide * pixelTall;

    if (digits.length === 0) {
      throw new Error('No layer in image');
    }

    if (digits.length % nbDigitsPerPayer !== 0) {
      throw new Error('Not enough digits to compute layers');
    }

    let pixels = [];

    for (let i = 0; i < digits.length; ++i) {
      pixels.push(toNumber(digits[i]));
      if (pixels.length === nbDigitsPerPayer) {
        layers.push(new Layer(pixels));
        pixels = [];
      }
    }

    // Find the max
    let layerWithFewestZero = layers[0];
    for (let i = 1; i < layers.length; ++i) {
      const layer = layers[i];
      if (layer.countNumberOf(0) < layerWithFewestZero.countNumberOf(0)) {
        layerWithFewestZero = layer;
      }
    }

    return layerWithFewestZero.countNumberOf(1) * layerWithFewestZero.countNumberOf(2);
  });
}

module.exports = {
  part01,
};
