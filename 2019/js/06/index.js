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
const {readLines} = require('../00/index');

class Galaxy {
  constructor() {
    this._orbits = new Map();
    this._cache = new Map();
  }

  addOrbit(o1, o2) {
    if (this._orbits.has(o2)) {
      throw new Error(
          `Cannot override link ${this._orbits.get(o2)})${o2} with ${o1})${o2}`,
      );
    }

    this._orbits.set(o2, o1);
    this._cache.clear();
  }

  countTotalOrbits() {
    let sum = 0;
    for (const o of this._orbits.keys()) {
      sum += this.countOrbits(o);
    }

    return sum;
  }

  countOrbits(o) {
    // Check in cache first.
    if (this._cache.has(o)) {
      return this._cache.get(o);
    }

    // Check if given object has a direct orbit or not.
    if (!this._orbits.has(o)) {
      this._cache.set(o, 0);
      return 0;
    }

    // Number of orbit is "just": number of orbit of direct object + 1
    const directOrbit = this._orbits.get(o);
    const count = 1 + this.countOrbits(directOrbit);

    // Do not forget to store in cache.
    this._cache.set(o, count);

    return count;
  }

  findCommonOrbit(o1, o2) {
    const path1 = this._pathToCenter(o1);
    const path2 = this._pathToCenter(o2);

    const set = new Set(path1);
    for (let i = path2.length - 1; i >= 0; --i) {
      if (set.has(path2[i])) {
        return path2[i];
      }
    }

    return null;
  }

  _pathToCenter(o) {
    const path = [];

    let currentObject = o;
    while (currentObject && this._orbits.has(currentObject)) {
      currentObject = this._orbits.get(currentObject);
      path.unshift(currentObject);
    }

    return path;
  }
}

function createGalaxy(lines) {
  const galaxy = new Galaxy();

  for (const line of lines) {
    const parts = line.split(')', 2);
    const o1 = parts[0];
    const o2 = parts[1];
    galaxy.addOrbit(o1, o2);
  }

  return galaxy;
}

function part01(fileName) {
  const file = path.join(__dirname, fileName);
  return readLines(file).then((lines) => {
    const galaxy = createGalaxy(lines);
    return galaxy.countTotalOrbits();
  });
}

function part02(fileName) {
  const file = path.join(__dirname, fileName);
  return readLines(file).then((lines) => {
    const galaxy = createGalaxy(lines);

    const commonOrbit = galaxy.findCommonOrbit('YOU', 'SAN');
    if (!commonOrbit) {
      return -1;
    }

    // Compute number or orbital move
    // This is the sum of the number of move from given points to given common orbit
    // Note: decrease each total of 1 because we are counting from direct orbit
    const total = galaxy.countOrbits(commonOrbit);
    return (
      (galaxy.countOrbits('YOU') - 1 - total) +
      (galaxy.countOrbits('SAN') - 1 - total)
    );
  });
}

module.exports = {
  part01,
  part02,
};
