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

describe('day20 - Tile', () => {
  it('should get top/right/bottom/left edge of given tile', () => {
    const tile = new Tile(1, [
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

    expect(tile.topEdge()).toEqual('..##.#..#.');
    expect(tile.rightEdge()).toEqual('...#.##..#');
    expect(tile.bottomEdge()).toEqual('..###..###');
    expect(tile.leftEdge()).toEqual('.#####..#.');
  });

  it('should flip tile', () => {
    const tile = new Tile(1, [
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

    tile.flip();

    expect(tile.id).toBe(1);
    expect(tile.rows).toEqual([
      '.#..#.##..',
      '.....#..##',
      '.#..##...#',
      '#...#.####',
      '.###.##.##',
      '###.#...##',
      '##..#.#.#.',
      '..#....#..',
      '.#.#...###',
      '###..###..',
    ]);

    expect(tile.topEdge()).toEqual('.#..#.##..');
    expect(tile.rightEdge()).toEqual('.#####..#.');
    expect(tile.bottomEdge()).toEqual('###..###..');
    expect(tile.leftEdge()).toEqual('...#.##..#');
  });

  it('should rotate tile', () => {
    const tile = new Tile(1, [
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

    tile.rotate();

    expect(tile.id).toBe(1);
    expect(tile.rows[0]).toEqual('.#..#####.');
    expect(tile.rows[1]).toEqual('.#.####.#.');
    expect(tile.rows[2]).toEqual('###...#..#');
    expect(tile.rows[3]).toEqual('#..#.##..#');
    expect(tile.rows[4]).toEqual('#....#.##.');
    expect(tile.rows[5]).toEqual('...##.##.#');
    expect(tile.rows[6]).toEqual('.#...#....');
    expect(tile.rows[7]).toEqual('#.#.##....');
    expect(tile.rows[8]).toEqual('##.###.#.#');
    expect(tile.rows[9]).toEqual('#..##.#...');

    expect(tile.topEdge()).toEqual('.#..#####.');
    expect(tile.rightEdge()).toEqual('..##.#..#.');
    expect(tile.bottomEdge()).toEqual('#..##.#...');
    expect(tile.leftEdge()).toEqual('..###..###');
  });

  it('should compute tile variations', () => {
    const tile = new Tile(1951, [
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

    expect(tile.id).toBe(1951);
    expect(tile.rows[0]).toEqual('#.##...##.');
    expect(tile.rows[1]).toEqual('#.####...#');
    expect(tile.rows[2]).toEqual('.....#..##');
    expect(tile.rows[3]).toEqual('#...######');
    expect(tile.rows[4]).toEqual('.##.#....#');
    expect(tile.rows[5]).toEqual('.###.#####');
    expect(tile.rows[6]).toEqual('###.##.##.');
    expect(tile.rows[7]).toEqual('.###....#.');
    expect(tile.rows[8]).toEqual('..#.#..#.#');
    expect(tile.rows[9]).toEqual('#...##.#..');

    expect(tile.topEdge()).toEqual('#.##...##.');
    expect(tile.rightEdge()).toEqual('.#####..#.');
    expect(tile.bottomEdge()).toEqual('#...##.#..');
    expect(tile.leftEdge()).toEqual('##.#..#..#');

    // First Rotation
    tile.rotate();
    expect(tile.id).toBe(1951);
    expect(tile.rows[0]).toEqual('#..#..#.##');
    expect(tile.rows[1]).toEqual('..####....');
    expect(tile.rows[2]).toEqual('.#####..##');
    expect(tile.rows[3]).toEqual('..#.#...##');
    expect(tile.rows[4]).toEqual('##.#.##.#.');
    expect(tile.rows[5]).toEqual('#..##.###.');
    expect(tile.rows[6]).toEqual('....#.#...');
    expect(tile.rows[7]).toEqual('##.##.#..#');
    expect(tile.rows[8]).toEqual('..###.##.#');
    expect(tile.rows[9]).toEqual('.#..#####.');

    expect(tile.topEdge()).toEqual('#..#..#.##');
    expect(tile.rightEdge()).toEqual('#.##...##.');
    expect(tile.bottomEdge()).toEqual('.#..#####.');
    expect(tile.leftEdge()).toEqual('#...##.#..');

    // Second Rotation
    tile.rotate();
    expect(tile.id).toBe(1951);
    expect(tile.rows[0]).toEqual('..#.##...#');
    expect(tile.rows[1]).toEqual('#.#..#.#..');
    expect(tile.rows[2]).toEqual('.#....###.');
    expect(tile.rows[3]).toEqual('.##.##.###');
    expect(tile.rows[4]).toEqual('#####.###.');
    expect(tile.rows[5]).toEqual('#....#.##.');
    expect(tile.rows[6]).toEqual('######...#');
    expect(tile.rows[7]).toEqual('##..#.....');
    expect(tile.rows[8]).toEqual('#...####.#');
    expect(tile.rows[9]).toEqual('.##...##.#');

    expect(tile.topEdge()).toEqual('..#.##...#');
    expect(tile.rightEdge()).toEqual('#..#..#.##');
    expect(tile.bottomEdge()).toEqual('.##...##.#');
    expect(tile.leftEdge()).toEqual('.#..#####.');

    // Third Rotation
    tile.rotate();
    expect(tile.id).toBe(1951);
    expect(tile.rows[0]).toEqual('.#####..#.');
    expect(tile.rows[1]).toEqual('#.##.###..');
    expect(tile.rows[2]).toEqual('#..#.##.##');
    expect(tile.rows[3]).toEqual('...#.#....');
    expect(tile.rows[4]).toEqual('.###.##..#');
    expect(tile.rows[5]).toEqual('.#.##.#.##');
    expect(tile.rows[6]).toEqual('##...#.#..');
    expect(tile.rows[7]).toEqual('##..#####.');
    expect(tile.rows[8]).toEqual('....####..');
    expect(tile.rows[9]).toEqual('##.#..#..#');

    expect(tile.topEdge()).toEqual('.#####..#.');
    expect(tile.rightEdge()).toEqual('..#.##...#');
    expect(tile.bottomEdge()).toEqual('##.#..#..#');
    expect(tile.leftEdge()).toEqual('.##...##.#');

    // Flipped Tile
    tile.flip();
    expect(tile.id).toBe(1951);
    expect(tile.rows[0]).toEqual('.#..#####.');
    expect(tile.rows[1]).toEqual('..###.##.#');
    expect(tile.rows[2]).toEqual('##.##.#..#');
    expect(tile.rows[3]).toEqual('....#.#...');
    expect(tile.rows[4]).toEqual('#..##.###.');
    expect(tile.rows[5]).toEqual('##.#.##.#.');
    expect(tile.rows[6]).toEqual('..#.#...##');
    expect(tile.rows[7]).toEqual('.#####..##');
    expect(tile.rows[8]).toEqual('..####....');
    expect(tile.rows[9]).toEqual('#..#..#.##');

    expect(tile.topEdge()).toEqual('.#..#####.');
    expect(tile.rightEdge()).toEqual('.##...##.#');
    expect(tile.bottomEdge()).toEqual('#..#..#.##');
    expect(tile.leftEdge()).toEqual('..#.##...#');

    // Flipped Rotation 1
    tile.rotate();
    expect(tile.id).toBe(1951);
    expect(tile.rows[0]).toEqual('#...##.#..');
    expect(tile.rows[1]).toEqual('..#.#..#.#');
    expect(tile.rows[2]).toEqual('.###....#.');
    expect(tile.rows[3]).toEqual('###.##.##.');
    expect(tile.rows[4]).toEqual('.###.#####');
    expect(tile.rows[5]).toEqual('.##.#....#');
    expect(tile.rows[6]).toEqual('#...######');
    expect(tile.rows[7]).toEqual('.....#..##');
    expect(tile.rows[8]).toEqual('#.####...#');
    expect(tile.rows[9]).toEqual('#.##...##.');

    expect(tile.topEdge()).toEqual('#...##.#..');
    expect(tile.rightEdge()).toEqual('.#..#####.');
    expect(tile.bottomEdge()).toEqual('#.##...##.');
    expect(tile.leftEdge()).toEqual('#..#..#.##');

    // Flipped Rotation 2
    tile.rotate();
    expect(tile.id).toBe(1951);
    expect(tile.rows[0]).toEqual('##.#..#..#');
    expect(tile.rows[1]).toEqual('....####..');
    expect(tile.rows[2]).toEqual('##..#####.');
    expect(tile.rows[3]).toEqual('##...#.#..');
    expect(tile.rows[4]).toEqual('.#.##.#.##');
    expect(tile.rows[5]).toEqual('.###.##..#');
    expect(tile.rows[6]).toEqual('...#.#....');
    expect(tile.rows[7]).toEqual('#..#.##.##');
    expect(tile.rows[8]).toEqual('#.##.###..');
    expect(tile.rows[9]).toEqual('.#####..#.');

    expect(tile.topEdge()).toEqual('##.#..#..#');
    expect(tile.rightEdge()).toEqual('#...##.#..');
    expect(tile.bottomEdge()).toEqual('.#####..#.');
    expect(tile.leftEdge()).toEqual('#.##...##.');

    // Flipped Rotation 3
    tile.rotate();
    expect(tile.id).toBe(1951);
    expect(tile.rows[0]).toEqual('.##...##.#');
    expect(tile.rows[1]).toEqual('#...####.#');
    expect(tile.rows[2]).toEqual('##..#.....');
    expect(tile.rows[3]).toEqual('######...#');
    expect(tile.rows[4]).toEqual('#....#.##.');
    expect(tile.rows[5]).toEqual('#####.###.');
    expect(tile.rows[6]).toEqual('.##.##.###');
    expect(tile.rows[7]).toEqual('.#....###.');
    expect(tile.rows[8]).toEqual('#.#..#.#..');
    expect(tile.rows[9]).toEqual('..#.##...#');

    expect(tile.topEdge()).toEqual('.##...##.#');
    expect(tile.rightEdge()).toEqual('##.#..#..#');
    expect(tile.bottomEdge()).toEqual('..#.##...#');
    expect(tile.leftEdge()).toEqual('.#####..#.');
  });

  it('should check that given edge is an adjacent edge', () => {
    const tile = new Tile(1, [
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

    // Top Edge
    expect(tile.isAdjacentEdge('..##.#..#.')).toBe(true);
    expect(tile.isAdjacentEdge('.#..#.##..')).toBe(true);

    // Bottom edge
    expect(tile.isAdjacentEdge('..###..###')).toBe(true);
    expect(tile.isAdjacentEdge('###..###..')).toBe(true);

    // Right edge
    expect(tile.isAdjacentEdge('...#.##..#')).toBe(true);
    expect(tile.isAdjacentEdge('#..##.#...')).toBe(true);

    // Left edge
    expect(tile.isAdjacentEdge('.#####..#.')).toBe(true);
    expect(tile.isAdjacentEdge('.#..#####.')).toBe(true);

    expect(tile.isAdjacentEdge('##...#.###')).toBe(false);
  });

  it('should count adjacent edges between tiles', () => {
    const tile1 = new Tile(2311, [
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

    const tile2 = new Tile(1951, [
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

    expect(tile1.countAdjacentEdges(tile2)).toBe(1);
  });

  it('should check adjacent edge between tile 1951 & 2311', () => {
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

    expect(tile1951.rightEdge()).toEqual('.#..#####.');
    expect(tile2311.isAdjacentEdge(tile1951.rightEdge())).toBe(true);
  });

  it('should make connection between tile', () => {
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

    const connected = tile1951.tryConnection(tile2311);

    expect(connected).toBe(true);

    // Check connections
    expect(tile1951._connections[0]).toBeNull();
    expect(tile1951._connections[1]).toBe(tile2311);
    expect(tile1951._connections[2]).toBeNull();
    expect(tile1951._connections[3]).toBeNull();

    expect(tile2311._connections[0]).toBeNull();
    expect(tile2311._connections[1]).toBeNull();
    expect(tile2311._connections[2]).toBeNull();
    expect(tile2311._connections[3]).toBe(tile1951);
  });

  it('should update connections after a tile is flipped', () => {
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

    tile1951.tryConnection(tile2311);
    tile1951.flip();

    // Check connections
    expect(tile1951._connections[0]).toBeNull();
    expect(tile1951._connections[1]).toBeNull();
    expect(tile1951._connections[2]).toBeNull();
    expect(tile1951._connections[3]).toBe(tile2311);

    expect(tile2311._connections[0]).toBeNull();
    expect(tile2311._connections[1]).toBe(tile1951);
    expect(tile2311._connections[2]).toBeNull();
    expect(tile2311._connections[3]).toBeNull();
  });

  it('should update connections after a tile is rotated', () => {
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

    tile1951.tryConnection(tile2311);

    expect(tile1951.rightEdge()).toBe(tile2311.leftEdge());

    expect(tile1951._connections[0]).toBeNull();
    expect(tile1951._connections[1]).toBe(tile2311);
    expect(tile1951._connections[2]).toBeNull();
    expect(tile1951._connections[3]).toBeNull();

    expect(tile2311._connections[0]).toBeNull();
    expect(tile2311._connections[1]).toBeNull();
    expect(tile2311._connections[2]).toBeNull();
    expect(tile2311._connections[3]).toBe(tile1951);

    tile1951.rotate();

    expect(tile1951.bottomEdge()).toBe(tile2311.topEdge());

    expect(tile1951._connections[0]).toBeNull();
    expect(tile1951._connections[1]).toBeNull();
    expect(tile1951._connections[2]).toBe(tile2311);
    expect(tile1951._connections[3]).toBeNull();

    expect(tile2311._connections[0]).toBe(tile1951);
    expect(tile2311._connections[1]).toBeNull();
    expect(tile2311._connections[2]).toBeNull();
    expect(tile2311._connections[3]).toBeNull();
  });

  it('should update both right and left connections after a tile is flipped', () => {
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

    tile2311.tryConnection(tile1951);
    tile2311.tryConnection(tile3079);

    // Check Connections
    expect(tile2311._connections[0]).toBeNull();
    expect(tile2311._connections[1]).toBe(tile3079);
    expect(tile2311._connections[2]).toBeNull();
    expect(tile2311._connections[3]).toBe(tile1951);

    expect(tile1951._connections[0]).toBeNull();
    expect(tile1951._connections[1]).toBe(tile2311);
    expect(tile1951._connections[2]).toBeNull();
    expect(tile1951._connections[3]).toBeNull();

    expect(tile3079._connections[0]).toBeNull();
    expect(tile3079._connections[1]).toBeNull();
    expect(tile3079._connections[2]).toBeNull();
    expect(tile3079._connections[3]).toBe(tile2311);

    // Flipping should existing connections.

    tile2311.flip();

    expect(tile2311._connections[0]).toBeNull();
    expect(tile2311._connections[1]).toBe(tile1951);
    expect(tile2311._connections[2]).toBeNull();
    expect(tile2311._connections[3]).toBe(tile3079);

    expect(tile1951._connections[0]).toBeNull();
    expect(tile1951._connections[1]).toBeNull();
    expect(tile1951._connections[2]).toBeNull();
    expect(tile1951._connections[3]).toBe(tile2311);

    expect(tile3079._connections[0]).toBeNull();
    expect(tile3079._connections[1]).toBe(tile2311);
    expect(tile3079._connections[2]).toBeNull();
    expect(tile3079._connections[3]).toBeNull();

    // Flipping again should reverse connections, and so everything should come back to the initial state.

    tile2311.flip();

    expect(tile2311._connections[0]).toBeNull();
    expect(tile2311._connections[1]).toBe(tile3079);
    expect(tile2311._connections[2]).toBeNull();
    expect(tile2311._connections[3]).toBe(tile1951);

    expect(tile1951._connections[0]).toBeNull();
    expect(tile1951._connections[1]).toBe(tile2311);
    expect(tile1951._connections[2]).toBeNull();
    expect(tile1951._connections[3]).toBeNull();

    expect(tile3079._connections[0]).toBeNull();
    expect(tile3079._connections[1]).toBeNull();
    expect(tile3079._connections[2]).toBeNull();
    expect(tile3079._connections[3]).toBe(tile2311);
  });

  it('should update both top and bottom connections after a tile is flipped', () => {
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

    tile1427.tryConnection(tile2311);
    tile1427.tryConnection(tile1489);

    expect(tile1427.topEdge()).toBe(tile2311.bottomEdge());
    expect(tile1427.bottomEdge()).toBe(tile1489.topEdge());

    // Check Connections
    expect(tile1427._connections[0]).toBe(tile2311);
    expect(tile1427._connections[1]).toBeNull();
    expect(tile1427._connections[2]).toBe(tile1489);
    expect(tile1427._connections[3]).toBeNull();

    expect(tile2311._connections[0]).toBeNull();
    expect(tile2311._connections[1]).toBeNull();
    expect(tile2311._connections[2]).toBe(tile1427);
    expect(tile2311._connections[3]).toBeNull();

    expect(tile1489._connections[0]).toBe(tile1427);
    expect(tile1489._connections[1]).toBeNull();
    expect(tile1489._connections[2]).toBeNull();
    expect(tile1489._connections[3]).toBeNull();

    // Flipping should existing connections.

    tile2311.flip();

    expect(tile1427.topEdge()).toBe(tile2311.bottomEdge());
    expect(tile1427.bottomEdge()).toBe(tile1489.topEdge());

    expect(tile1427._connections[0]).toBe(tile2311);
    expect(tile1427._connections[1]).toBeNull();
    expect(tile1427._connections[2]).toBe(tile1489);
    expect(tile1427._connections[3]).toBeNull();

    expect(tile2311._connections[0]).toBeNull();
    expect(tile2311._connections[1]).toBeNull();
    expect(tile2311._connections[2]).toBe(tile1427);
    expect(tile2311._connections[3]).toBeNull();

    expect(tile1489._connections[0]).toBe(tile1427);
    expect(tile1489._connections[1]).toBeNull();
    expect(tile1489._connections[2]).toBeNull();
    expect(tile1489._connections[3]).toBeNull();
  });
});
