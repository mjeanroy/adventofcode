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

const {part1, part2, Cups} = require('./index');

describe('day23', () => {
  it('should compute sample with move=10', () => {
    expect(part1('389125467', 10)).toBe('92658374');
  });

  it('should compute sample with move=100', () => {
    expect(part1('389125467', 100)).toBe('67384529');
  });

  it('should compute input with move=100', () => {
    expect(part1('253149867', 100)).toBe('34952786');
  });

  it('should predict from sample', () => {
    expect(part2('389125467')).toBe(149245887792);
  });

  it('should predict from input', () => {
    expect(part2('253149867')).toBe(505334281774);
  });

  it('should initialize cups', () => {
    const cups = new Cups('389125467');
    expect(cups.min).toBe(1);
    expect(cups.max).toBe(9);
    expect(cups.toString()).toBe('389125467');
  });

  it('should select next three cups', () => {
    const cups = new Cups('389125467');
    const {values, head, tail} = cups._picksUp();

    // Should have [8, 9, 1]
    expect(values).toEqual(new Set([8, 9, 1]));
    expect(head.value).toBe(8);
    expect(tail.value).toBe(1);

    // Should be: null -> 8 -> 9 -> 1 -> null
    expect(head.value).toBe(8);
    expect(head.next.value).toBe(9);
    expect(head.next.next.value).toBe(1);
    expect(head.next.next.next).toBeNull();

    // The list should have been updated
    expect(cups.toString()).toBe('325467');
  });

  it('should select next three cups and choose next destination', () => {
    const cups = new Cups('389125467');
    const {values} = cups._picksUp();
    const destination = cups._destinationCup(values);
    expect(destination.value).toBe(2);
  });

  it('should select next three cups, choose next destination and places previously picked up values', () => {
    const cups = new Cups('389125467');
    const {head, tail, values} = cups._picksUp();
    const destination = cups._destinationCup(values);
    cups._placeCups(head, tail, destination);

    expect(cups.toString()).toBe('328915467');
  });

  it('should move', () => {
    const cups = new Cups('389125467');

    // Move 1
    cups.move();
    expect(cups.toString()).toBe('328915467');
    expect(cups.current.value).toBe(2);

    // Move 2
    cups.move();
    expect(cups.toString()).toBe('325467891');
    expect(cups.current.value).toBe(5);

    // Move 3
    cups.move();
    expect(cups.toString()).toBe('346725891');
    expect(cups.current.value).toBe(8);

    // Move 4
    cups.move();
    expect(cups.toString()).toBe('325846791');
    expect(cups.current.value).toBe(4);

    // Move 5
    cups.move();
    expect(cups.toString()).toBe('367925841');
    expect(cups.current.value).toBe(1);

    // Move 6
    cups.move();
    expect(cups.toString()).toBe('367258419');
    expect(cups.current.value).toBe(9);
  });
});
