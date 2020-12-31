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

const {Tile} = require('./tile');
const {initialize} = require('./puzzle');

describe('day20 - initialize', () => {
  it('should get candidates', () => {
    const tile2311 = getTile2311();
    const tile1951 = getTile1951();
    const tile1171 = getTile1171();
    const tile1427 = getTile1427();
    const tile1489 = getTile1489();
    const tile2473 = getTile2473();
    const tile2971 = getTile2971();
    const tile2729 = getTile2729();
    const tile3079 = getTile3079();
    const tiles = [
      tile2311,
      tile1951,
      tile1171,
      tile1427,
      tile1489,
      tile2473,
      tile2971,
      tile2729,
      tile3079,
    ];

    const puzzle = initialize(tiles);

    expect(puzzle._candidates(2)).toEqual([
      tile1951,
      tile1171,
      tile2971,
      tile3079,
    ]);

    expect(puzzle._candidates(3)).toEqual([
      tile2311,
      tile1489,
      tile2473,
      tile2729,
    ]);

    expect(puzzle._candidates(4)).toEqual([
      tile1427,
    ]);
  });

  it('should get connections', () => {
    const tile2311 = getTile2311();
    const tile1951 = getTile1951();
    const tile1171 = getTile1171();
    const tile1427 = getTile1427();
    const tile1489 = getTile1489();
    const tile2473 = getTile2473();
    const tile2971 = getTile2971();
    const tile2729 = getTile2729();
    const tile3079 = getTile3079();
    const tiles = [
      tile2311,
      tile1951,
      tile1171,
      tile1427,
      tile1489,
      tile2473,
      tile2971,
      tile2729,
      tile3079,
    ];

    const puzzle = initialize(tiles);

    expect(puzzle._connectionsOf(tile1951)).toEqual([
      tile2311,
      tile2729,
    ]);

    expect(puzzle._connectionsOf(tile2311)).toEqual([
      tile1951,
      tile1427,
      tile3079,
    ]);

    expect(puzzle._connectionsOf(tile3079)).toEqual([
      tile2311,
      tile2473,
    ]);

    expect(puzzle._connectionsOf(tile2729)).toEqual([
      tile1951,
      tile1427,
      tile2971,
    ]);

    expect(puzzle._connectionsOf(tile1427)).toEqual([
      tile2311,
      tile1489,
      tile2473,
      tile2729,
    ]);

    expect(puzzle._connectionsOf(tile2473)).toEqual([
      tile1171,
      tile1427,
      tile3079,
    ]);

    expect(puzzle._connectionsOf(tile2971)).toEqual([
      tile1489,
      tile2729,
    ]);

    expect(puzzle._connectionsOf(tile1489)).toEqual([
      tile1171,
      tile1427,
      tile2971,
    ]);

    expect(puzzle._connectionsOf(tile1171)).toEqual([
      tile1489,
      tile2473,
    ]);
  });

  it('should arrange puzzle', () => {
    // Start with this configuration, so we can get the same square as in the sample.
    const tile1951 = new Tile(1951, [
      '#...##.#..',
      '..#.#..#.#',
      '.###....#.',
      '###.##.##.',
      '.###.#####',
      '.##.#....#',
      '#...######',
      '.....#..##',
      '#.####...#',
      '#.##...##.',
    ]);

    const tile2311 = getTile2311();
    const tile1171 = getTile1171();
    const tile1427 = getTile1427();
    const tile1489 = getTile1489();
    const tile2473 = getTile2473();
    const tile2971 = getTile2971();
    const tile2729 = getTile2729();
    const tile3079 = getTile3079();
    const tiles = [
      tile2311,
      tile1951,
      tile1171,
      tile1427,
      tile1489,
      tile2473,
      tile2971,
      tile2729,
      tile3079,
    ];

    const puzzle = initialize(tiles);

    puzzle._arrange();

    // First line
    expect(tile1951.connections()[0]).toBeNull();
    expect(tile1951.connections()[1]).toBe(tile2311);
    expect(tile1951.connections()[2]).toBe(tile2729);
    expect(tile1951.connections()[3]).toBeNull();

    expect(tile2311.connections()[0]).toBeNull();
    expect(tile2311.connections()[1]).toBe(tile3079);
    expect(tile2311.connections()[2]).toBe(tile1427);
    expect(tile2311.connections()[3]).toBe(tile1951);

    expect(tile3079.connections()[0]).toBeNull();
    expect(tile3079.connections()[1]).toBeNull();
    expect(tile3079.connections()[2]).toBe(tile2473);
    expect(tile3079.connections()[3]).toBe(tile2311);

    // Second line
    expect(tile2729.connections()[0]).toBe(tile1951);
    expect(tile2729.connections()[1]).toBe(tile1427);
    expect(tile2729.connections()[2]).toBe(tile2971);
    expect(tile2729.connections()[3]).toBeNull();

    expect(tile1427.connections()[0]).toBe(tile2311);
    expect(tile1427.connections()[1]).toBe(tile2473);
    expect(tile1427.connections()[2]).toBe(tile1489);
    expect(tile1427.connections()[3]).toBe(tile2729);

    expect(tile2473.connections()[0]).toBe(tile3079);
    expect(tile2473.connections()[1]).toBeNull();
    expect(tile2473.connections()[2]).toBe(tile1171);
    expect(tile2473.connections()[3]).toBe(tile1427);

    // Third line
    expect(tile2971.connections()[0]).toBe(tile2729);
    expect(tile2971.connections()[1]).toBe(tile1489);
    expect(tile2971.connections()[2]).toBeNull();
    expect(tile2971.connections()[3]).toBeNull();

    expect(tile1489.connections()[0]).toBe(tile1427);
    expect(tile1489.connections()[1]).toBe(tile1171);
    expect(tile1489.connections()[2]).toBeNull();
    expect(tile1489.connections()[3]).toBe(tile2971);

    expect(tile1171.connections()[0]).toBe(tile2473);
    expect(tile1171.connections()[1]).toBeNull();
    expect(tile1171.connections()[2]).toBeNull();
    expect(tile1171.connections()[3]).toBe(tile1489);
  });

  it('should solve puzzle', () => {
    // Start with this configuration, so we can get the same square as in the sample.
    const tile1951 = new Tile(1951, [
      '#...##.#..',
      '..#.#..#.#',
      '.###....#.',
      '###.##.##.',
      '.###.#####',
      '.##.#....#',
      '#...######',
      '.....#..##',
      '#.####...#',
      '#.##...##.',
    ]);

    const tile2311 = getTile2311();
    const tile1171 = getTile1171();
    const tile1427 = getTile1427();
    const tile1489 = getTile1489();
    const tile2473 = getTile2473();
    const tile2971 = getTile2971();
    const tile2729 = getTile2729();
    const tile3079 = getTile3079();
    const tiles = [
      tile2311,
      tile1951,
      tile1171,
      tile1427,
      tile1489,
      tile2473,
      tile2971,
      tile2729,
      tile3079,
    ];

    const puzzle = initialize(tiles);
    const square = puzzle.solve();

    expect(square.size).toBe(3);

    // First row
    expect(square.get(0, 0)).toBe(tile1951);
    expect(square.get(1, 0)).toBe(tile2311);
    expect(square.get(2, 0)).toBe(tile3079);

    // Second row
    expect(square.get(0, 1)).toBe(tile2729);
    expect(square.get(1, 1)).toBe(tile1427);
    expect(square.get(2, 1)).toBe(tile2473);

    // Third row
    expect(square.get(0, 2)).toBe(tile2971);
    expect(square.get(1, 2)).toBe(tile1489);
    expect(square.get(2, 2)).toBe(tile1171);
  });

  // eslint-disable-next-line require-jsdoc
  function getTile2311() {
    return new Tile(2311, [
      '..##.#..#.',
      '##..#.....',
      '#...##..#.',
      '####.#...#',
      '##.##.###.',
      '##...#.###',
      '.#.#.#..##',
      '..#....#..',
      '###...#.#.',
      '..###..###',
    ]);
  }

  // eslint-disable-next-line require-jsdoc
  function getTile1951() {
    return new Tile(1951, [
      '#.##...##.',
      '#.####...#',
      '.....#..##',
      '#...######',
      '.##.#....#',
      '.###.#####',
      '###.##.##.',
      '.###....#.',
      '..#.#..#.#',
      '#...##.#..',
    ]);
  }

  // eslint-disable-next-line require-jsdoc
  function getTile1171() {
    return new Tile(1171, [
      '####...##.',
      '#..##.#..#',
      '##.#..#.#.',
      '.###.####.',
      '..###.####',
      '.##....##.',
      '.#...####.',
      '#.##.####.',
      '####..#...',
      '.....##...',
    ]);
  }

  // eslint-disable-next-line require-jsdoc
  function getTile1427() {
    return new Tile(1427, [
      '###.##.#..',
      '.#..#.##..',
      '.#.##.#..#',
      '#.#.#.##.#',
      '....#...##',
      '...##..##.',
      '...#.#####',
      '.#.####.#.',
      '..#..###.#',
      '..##.#..#.',
    ]);
  }

  // eslint-disable-next-line require-jsdoc
  function getTile1489() {
    return new Tile(1489, [
      '##.#.#....',
      '..##...#..',
      '.##..##...',
      '..#...#...',
      '#####...#.',
      '#..#.#.#.#',
      '...#.#.#..',
      '##.#...##.',
      '..##.##.##',
      '###.##.#..',
    ]);
  }

  // eslint-disable-next-line require-jsdoc
  function getTile2473() {
    return new Tile(2473, [
      '#....####.',
      '#..#.##...',
      '#.##..#...',
      '######.#.#',
      '.#...#.#.#',
      '.#########',
      '.###.#..#.',
      '########.#',
      '##...##.#.',
      '..###.#.#.',
    ]);
  }

  // eslint-disable-next-line require-jsdoc
  function getTile2971() {
    return new Tile(2971, [
      '..#.#....#',
      '#...###...',
      '#.#.###...',
      '##.##..#..',
      '.#####..##',
      '.#..####.#',
      '#..#.#..#.',
      '..####.###',
      '..#.#.###.',
      '...#.#.#.#',
    ]);
  }

  // eslint-disable-next-line require-jsdoc
  function getTile2729() {
    return new Tile(2729, [
      '...#.#.#.#',
      '####.#....',
      '..#.#.....',
      '....#..#.#',
      '.##..##.#.',
      '.#.####...',
      '####.#.#..',
      '##.####...',
      '##..#.##..',
      '#.##...##.',
    ]);
  }

  // eslint-disable-next-line require-jsdoc
  function getTile3079() {
    return new Tile(3079, [
      '#.#.#####.',
      '.#..######',
      '..#.......',
      '######....',
      '####.#..#.',
      '.#...#.##.',
      '#.#####.##',
      '..#.###...',
      '..#.......',
      '..#.###...',
    ]);
  }
});
