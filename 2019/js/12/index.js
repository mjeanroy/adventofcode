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
const {readLines, sumOf, toNumber} = require('../00/index');

class Coordinates {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  move(x, y, z) {
    this.x += x;
    this.y += y;
    this.z += z;
  }

  sum() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }

  toString() {
    return `<x=${this.x}, y=${this.y}, z=${this.z}>`;
  }
}

class Moon {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
  }

  applyGravity(x, y, z) {
    this.velocity.move(x, y, z);
  }

  applyVelocity() {
    this.position.move(
        this.velocity.x,
        this.velocity.y,
        this.velocity.z,
    );
  }

  potentialEnergy() {
    return this.position.sum();
  }

  kineticEnergy() {
    return this.velocity.sum();
  }

  totalEnergy() {
    return this.potentialEnergy() * this.kineticEnergy();
  }

  toString() {
    return `pos=${this.position}, vel=${this.velocity}`;
  }
}

class Universe {
  constructor(moons) {
    this._moons = moons;
  }

  move() {
    this._applyGravity();
    this._applyVelocity();
  }

  totalEnergy() {
    return sumOf(this._moons, (moon) => moon.totalEnergy());
  }

  _applyGravity() {
    for (let i = 0; i < this._moons.length; ++i) {
      for (let k = i + 1; k < this._moons.length; ++k) {
        this._applyGravityBetweenMoon(i, k);
      }
    }
  }

  _applyVelocity() {
    for (let i = 0; i < this._moons.length; ++i) {
      this._moons[i].applyVelocity();
    }
  }

  _applyGravityBetweenMoon(i, j) {
    if (i === j) {
      return;
    }

    const moon1 = this._moons[i];
    const moon2 = this._moons[j];

    const x = Math.sign(moon1.position.x - moon2.position.x);
    const y = Math.sign(moon1.position.y - moon2.position.y);
    const z = Math.sign(moon1.position.z - moon2.position.z);

    moon1.applyGravity(-x, -y, -z);
    moon2.applyGravity(x, y, z);
  }
}

function parseValue(input) {
  const [, rawValue] = input.trim().split('=');
  return toNumber(rawValue);
}

function parseCoordinates(input) {
  const [x, y, z] = input.trim().slice(1, -1).split(', ').map((rawValue) => parseValue(rawValue));
  return new Coordinates(x, y, z);
}

function parseMoon(input) {
  const velocity = new Coordinates(0, 0, 0);
  const position = parseCoordinates(input);
  return new Moon(position, velocity);
}

function createUniverse(inputs) {
  const moons = inputs.map((line) => parseMoon(line));
  return new Universe(moons);
}

function part01(fileName, timeSteps = 10) {
  const file = path.join(__dirname, fileName);
  return readLines(file).then((lines) => {
    const universe = createUniverse(lines);
    for (let time = 0; time < timeSteps; ++time) {
      universe.move();
    }

    return universe.totalEnergy();
  });
}

module.exports = {
  part01,
};
