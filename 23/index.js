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

const {toNumber} = require('../00/index');

/**
 * Compute the labels on the cups after cup 1.
 *
 * @param {string} input The input.
 * @param {number} move The number of move to do, defaults to 100.
 * @returns {string} The output.
 */
function part1(input, move = 100) {
  const cups = new Cups(input);

  for (let i = 0; i < move; ++i) {
    cups.move();
  }

  return cups.labels();
}

/**
 * Compute the labels on the cups after cup 1.
 *
 * @param {string} input The input.
 * @returns {string} The output.
 */
function part2(input ) {
  const cups = new Cups(input);

  // Add [max+1 -> 1_000_000]
  for (let i = cups.max + 1; i <= 1000000; ++i) {
    cups.push(i);
  }

  // Then, move 10 000 000 times

  for (let i = 0; i < 10000000; ++i) {
    cups.move();
  }

  return cups.predict();
}

/**
 * The cups structure.
 *
 * @class
 */
class Cups {
  /**
   * Create the cups structure.
   *
   * @param {string} input The input.
   */
  constructor(input) {
    // Yeah, for this puzzle, I will use a circular linked list.
    // You may ask why?
    // - The biggest advantage is that each operations needed in this puzzle can be solved in O(1) using this kind of list...
    // - And I don't have the chance to use this data-structure very often, so the main reason is fun!
    // [EDIT] Ok, after resolving the part2 of the day, it looks like that was the data-structure to use :)
    this.input = new CircularLinkedList();

    // Track each node in a map to retrieve them in O(1).
    this.nodes = new Map();

    this.min = Number.MAX_SAFE_INTEGER;
    this.max = -1;

    // Index all cups by the number of times it has been used.
    for (let i = 0; i < input.length; ++i) {
      const cup = input[i];
      const value = toNumber(cup);
      this.push(value);
    }

    // The current pointer, start with the head of the list.
    this.current = this.input.head();
  }

  /**
   * Push new value into the cups list.
   *
   * @param {number} value The value to add.
   * @returns {void}
   */
  push(value) {
    const node = this.input.push(value);
    this.nodes.set(value, node);
    this.min = Math.min(this.min, value);
    this.max = Math.max(this.max, value);
  }

  /**
   * Move:
   * - The crab picks up the three cups that are immediately clockwise
   *   of the current cup. They are removed from the circle;
   *   cup spacing is adjusted as necessary to maintain the circle.
   * - The crab selects a destination cup: the cup with a label equal to
   *   the current cup's label minus one.
   *   If this would select one of the cups that was just picked up,
   *   the crab will keep subtracting one until it finds a cup that
   *   wasn't just picked up.
   *   If at any point in this process the value goes below the lowest value
   *   on any cup's label, it wraps around to the highest value on
   *   any cup's label instead.
   * - The crab places the cups it just picked up so that they are immediately clockwise
   *   of the destination cup.
   *   They keep the same order as when they were picked up.
   * - The crab selects a new current cup: the cup which is immediately
   *   clockwise of the current cup.
   *
   * @returns {void}
   */
  move() {
    const {head, tail, values} = this._picksUp();
    const destination = this._destinationCup(values);
    this._placeCups(head, tail, destination);
    this._selectNextCurrentCup();
  }

  /**
   * Picks up the next three cups.
   *
   * @returns {string} The next three cups.
   */
  _picksUp() {
    const head = this.current.next;
    const values = new Set();

    let node = head;
    let tail = null;
    while (values.size !== 3) {
      // Store picked up value.
      values.add(node.value);

      // Go to the next.
      tail = node;
      node = node.next;
    }

    // Remove [head-tail] from the list
    this.current.next = node;

    // Update [head-tail] to remove links with the original list.
    tail.next = null;

    return {
      head,
      tail,
      values,
    };
  }

  /**
   * Place given cups in the input.
   *
   * @param {Object} head The head node of picked values.
   * @param {Object} tail The tail node of picked values.
   * @param {Object} destination The destination previously computed.
   * @returns {void}
   */
  _placeCups(head, tail, destination) {
    const next = destination.next;
    destination.next = head;
    tail.next = next;
  }

  /**
   * Select the next current cup.
   *
   * @returns {number} The next current cup.
   */
  _selectNextCurrentCup() {
    this.current = this.current.next;
  }

  /**
   * Get the destination cup.
   *
   * The crab selects a destination cup: the cup with a label equal to the current cup's label minus one.
   *
   * If this would select one of the cups that was just picked up, the crab will keep subtracting
   * one until it finds a cup that wasn't just picked up.
   *
   * If at any point in this process the value goes below the lowest value on any cup's label,
   * it wraps around to the highest value on any cup's label instead.
   *
   * @param {Set<number>} pickedUpValues The previously picked up values.
   * @returns {Object} The node corresponding to the destination cup.
   */
  _destinationCup(pickedUpValues) {
    let cup = this.current.value - 1;

    while (cup < this.min || pickedUpValues.has(cup)) {
      if (cup < this.min) {
        cup = this.max;
      } else {
        cup--;
      }
    }

    return this.nodes.get(cup);
  }

  /**
   * Get cups labels, starting from cup `1` (and excluding `1`).
   *
   * @returns {string} The cups label.
   */
  labels() {
    const one = this.nodes.get(1);

    let node = one.next;
    let output = '';
    while (node !== one) {
      output += node.value;
      node = node.next;
    }

    return output;
  }

  /**
   * Determine which two cups will end up immediately clockwise of cup 1
   * and multiply their labels together.
   *
   * @returns {number} The multiplication of the next two cups after one.
   */
  predict() {
    const one = this.nodes.get(1);
    const next1 = one.next.value;
    const next2 = one.next.next.value;
    return next1 * next2;
  }

  /**
   * Serialize current state to a string.
   *
   * @returns {string} The serialized output.
   */
  toString() {
    let output = '';
    let node = this.input.head();

    do {
      output += node.value;
      node = node.next;
    } while (node !== this.input.head());

    return output;
  }
}

/**
 * A circular linked list.
 *
 * @class
 */
class CircularLinkedList {
  /**
   * Create empty list.
   */
  constructor() {
    this._head = null;
    this._tail = null;
  }

  /**
   * Push value into the lsit.
   *
   * @param {*} value The value.
   * @returns {Object} The new node.
   */
  push(value) {
    const node = {
      value,
      next: null,
    };

    if (this._head) {
      this._tail.next = node;
      this._tail = node;
    } else {
      this._head = node;
      this._tail = node;
    }

    // Fix the loop
    this._tail.next = this._head;

    return node;
  }

  /**
   * The head.
   *
   * @returns {Object} The head node.
   */
  head() {
    return this._head;
  }
}

module.exports = {
  part1,
  part2,
  Cups,
};
