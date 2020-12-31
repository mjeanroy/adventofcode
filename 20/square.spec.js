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
const {Square} = require('./square');

describe('day20 - Square', () => {
  it('should put / get tile', () => {
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

    const tile2311 = new Tile(2311, [
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

    const square = new Square(3);

    square.put(0, 0, tile1951);
    square.put(0, 1, tile2311);

    expect(square.get(0, 0)).toBe(tile1951);
    expect(square.get(0, 1)).toBe(tile2311);
    expect(square.get(0, 2)).toBeNull();

    expect(square.get(1, 0)).toBeNull();
    expect(square.get(1, 1)).toBeNull();
    expect(square.get(1, 2)).toBeNull();

    expect(square.get(2, 0)).toBeNull();
    expect(square.get(2, 1)).toBeNull();
    expect(square.get(2, 2)).toBeNull();
  });

  it('should build inner tile', () => {
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

    const tile2311 = new Tile(2311, [
      '..###..###',
      '###...#.#.',
      '..#....#..',
      '.#.#.#..##',
      '##...#.###',
      '##.##.###.',
      '####.#...#',
      '#...##..#.',
      '##..#.....',
      '..##.#..#.',
    ]);

    const tile3079 = new Tile(3079, [
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

    const tile2729 = new Tile(2729, [
      '#.##...##.',
      '##..#.##..',
      '##.####...',
      '####.#.#..',
      '.#.####...',
      '.##..##.#.',
      '....#..#.#',
      '..#.#.....',
      '####.#....',
      '...#.#.#.#',
    ]);

    const tile1427 = new Tile(1427, [
      '..##.#..#.',
      '..#..###.#',
      '.#.####.#.',
      '...#.#####',
      '...##..##.',
      '....#...##',
      '#.#.#.##.#',
      '.#.##.#..#',
      '.#..#.##..',
      '###.##.#..',
    ]);

    const tile2473 = new Tile(2473, [
      '..#.###...',
      '##.##....#',
      '..#.###..#',
      '###.#..###',
      '.######.##',
      '#.#.#.#...',
      '#.###.###.',
      '#.###.##..',
      '.######...',
      '.##...####',
    ]);

    const tile2971 = new Tile(2971, [
      '...#.#.#.#',
      '..#.#.###.',
      '..####.###',
      '#..#.#..#.',
      '.#..####.#',
      '.#####..##',
      '##.##..#..',
      '#.#.###...',
      '#...###...',
      '..#.#....#',
    ]);

    const tile1489 = new Tile(1489, [
      '###.##.#..',
      '..##.##.##',
      '##.#...##.',
      '...#.#.#..',
      '#..#.#.#.#',
      '#####...#.',
      '..#...#...',
      '.##..##...',
      '..##...#..',
      '##.#.#....',
    ]);

    const tile1171 = new Tile(1171, [
      '.##...####',
      '#..#.##..#',
      '.#.#..#.##',
      '.####.###.',
      '####.###..',
      '.##....##.',
      '.####...#.',
      '.####.##.#',
      '...#..####',
      '...##.....',
    ]);

    const square = new Square(3);
    square.put(0, 0, tile1951);
    square.put(1, 0, tile2311);
    square.put(2, 0, tile3079);

    square.put(0, 1, tile2729);
    square.put(1, 1, tile1427);
    square.put(2, 1, tile2473);

    square.put(0, 2, tile2971);
    square.put(1, 2, tile1489);
    square.put(2, 2, tile1171);

    const innerTile = square.innerTile();

    expect(innerTile.rows.length).toBe(24);
    expect(innerTile.rows[0]).toBe('.#.#..#.##...#.##..#####');
    expect(innerTile.rows[1]).toBe('###....#.#....#..#......');
    expect(innerTile.rows[2]).toBe('##.##.###.#.#..######...');
    expect(innerTile.rows[3]).toBe('###.#####...#.#####.#..#');
    expect(innerTile.rows[4]).toBe('##.#....#.##.####...#.##');
    expect(innerTile.rows[5]).toBe('...########.#....#####.#');
    expect(innerTile.rows[6]).toBe('....#..#...##..#.#.###..');
    expect(innerTile.rows[7]).toBe('.####...#..#.....#......');
    expect(innerTile.rows[8]).toBe('#..#.##..#..###.#.##....');
    expect(innerTile.rows[9]).toBe('#.####..#.####.#.#.###..');
    expect(innerTile.rows[10]).toBe('###.#.#...#.######.#..##');
    expect(innerTile.rows[11]).toBe('#.####....##..########.#');
    expect(innerTile.rows[12]).toBe('##..##.#...#...#.#.#.#..');
    expect(innerTile.rows[13]).toBe('...#..#..#.#.##..###.###');
    expect(innerTile.rows[14]).toBe('.#.#....#.##.#...###.##.');
    expect(innerTile.rows[15]).toBe('###.#...#..#.##.######..');
    expect(innerTile.rows[16]).toBe('.#.#.###.##.##.#..#.##..');
    expect(innerTile.rows[17]).toBe('.####.###.#...###.#..#.#');
    expect(innerTile.rows[18]).toBe('..#.#..#..#.#.#.####.###');
    expect(innerTile.rows[19]).toBe('#..####...#.#.#.###.###.');
    expect(innerTile.rows[20]).toBe('#####..#####...###....##');
    expect(innerTile.rows[21]).toBe('#.##..#..#...#..####...#');
    expect(innerTile.rows[22]).toBe('.#.###..##..##..####.##.');
    expect(innerTile.rows[23]).toBe('...###...##...#...#..###');
  });
});
