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

const BLACK_PIXEL = 0;
const WHITE_PIXEL = 1;
const TRANSPARENT_PIXEL = 2;

class Layer {
  constructor({pixels, width, height}) {
    this._pixels = pixels.slice();
    this._width = width;
    this._height = height;
    this._counts = new Map();
    this._initializeCounters();
  }

  render() {
    const outputs = [];

    let row = '';

    for (let i = 0; i < this.size(); ++i) {
      if (i > 0 && i % this._width === 0) {
        outputs.push(row);
        row = '';
      }

      row += this.at(i) === WHITE_PIXEL ? '#' : ' ';
    }

    if (row) {
      outputs.push(row);
    }

    return outputs;
  }

  size() {
    return this._width * this._height;
  }

  at(position) {
    if (position < 0 || position >= this.size()) {
      throw new Error(`Cannot read position ${position}`);
    }

    return this._pixels[position];
  }

  countNumberOf(digit = 0) {
    return this._counts.get(digit) ?? 0;
  }

  toString() {
    return this._pixels.join('');
  }

  _initializeCounters() {
    for (let i = 0; i < this._pixels.length; ++i) {
      const digit = this._pixels[i];
      this._counts.set(digit, (this._counts.get(digit) ?? 0) + 1);
    }
  }
}

class Image {
  constructor({layers, width, height}) {
    this._layers = layers;
    this._width = width;
    this._height = height;
  }

  size() {
    return this._width * this._height;
  }

  computeCorruptionKey() {
    let layerWithFewestZero = this._layers[0];

    for (let i = 1; i < this._layers.length; ++i) {
      const layer = this._layers[i];
      if (layer.countNumberOf(0) < layerWithFewestZero.countNumberOf(0)) {
        layerWithFewestZero = layer;
      }
    }

    return (
      layerWithFewestZero.countNumberOf(1) * layerWithFewestZero.countNumberOf(2)
    );
  }

  computeFinalLayer() {
    if (!this._layers.length) {
      return null;
    }

    const image = [];
    const nbDigits = this.size();

    for (let i = 0; i < nbDigits; ++i) {
      const visibleLayer = this._layers.find((layer) => (
        layer.at(i) === BLACK_PIXEL || layer.at(i) === WHITE_PIXEL
      ));

      if (visibleLayer) {
        image[i] = visibleLayer.at(i);
      } else {
        image[i] = TRANSPARENT_PIXEL;
      }
    }

    return new Layer({
      pixels: image,
      width: this._width,
      height: this._height,
    });
  }
}

function createImage(digits, width, height) {
  const layers = [];
  const nbDigitsPerPayer = width * height;

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
      layers.push(new Layer({pixels, width, height}));
      pixels = [];
    }
  }

  return new Image({
    layers,
    width,
    height,
  });
}

function part01(fileName, pixelWide = 25, pixelTall = 6) {
  const file = path.join(__dirname, fileName);
  return readFile(file).then((content) => {
    const digits = content.trim();
    const image = createImage(digits, pixelWide, pixelTall);
    return image.computeCorruptionKey();
  });
}

function part02(fileName, pixelWide = 25, pixelTall = 6) {
  const file = path.join(__dirname, fileName);
  return readFile(file).then((content) => {
    const digits = content.trim();
    const image = createImage(digits, pixelWide, pixelTall);
    const decodedLayer = image.computeFinalLayer();
    return decodedLayer.render();
  });
}

module.exports = {
  part01,
  part02,
};
