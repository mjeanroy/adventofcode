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

const TOP = 0;
const RIGHT = 1;
const BOTTOM = 2;
const LEFT = 3;

/**
 * A simple tile.
 *
 * @class
 */
class Tile {
  /**
   * Create the tile and compute the eight edges.
   *
   * @param {number} id Tile id.
   * @param {Array<string>} rows The tile rows.
   * @constructor
   */
  constructor(id, rows) {
    this.id = id;
    this._initRows(rows);

    this._connections = [];
    this._connections[TOP] = null;
    this._connections[RIGHT] = null;
    this._connections[BOTTOM] = null;
    this._connections[LEFT] = null;
  }

  /**
   * Initialize rows.
   *
   * @param {Array<string>} rows The tile rows.
   * @returns {void}
   */
  _initRows(rows) {
    this.rows = rows;
  }

  /**
   * Get array of the fourth edges in given position:
   *
   * ```
   * [top, right, bottom, left]
   * ```
   *
   * @returns {Array<string>} The edges.
   */
  rowsEdges() {
    const rowsEdges = [];
    rowsEdges[TOP] = this.rows[0];
    rowsEdges[RIGHT] = this.rows.map((row) => row[row.length -1]).join('');
    rowsEdges[BOTTOM] = this.rows[this.rows.length - 1];
    rowsEdges[LEFT] = this.rows.map((row) => row[0]).join('');
    return rowsEdges;
  }

  /**
   * Get set of all edges.
   *
   * @returns {Set<string>} The edges.
   */
  edges() {
    return new Set(this.rowsEdges());
  }

  /**
   * Get set of all edges after flip operation.
   *
   * @returns {Set<string>} The edges.
   */
  flippedEdges() {
    return new Set(this.rowsEdges().map((edge) => reverse(edge)));
  }

  /**
   * Get set of all possible edges for this tile.
   *
   * @returns {Set<string>} The edges.
   */
  possibleEdges() {
    const edges = this.edges();
    const flippedEdges = this.flippedEdges();
    return new Set([
      ...edges,
      ...flippedEdges,
    ]);
  }

  /**
   * Check if given edge is inside one of the possible edges (rotated and/ or flipped edges).
   *
   * @param {string} edge The edge.
   * @returns {boolean} `true` if given edge is inside one the eight possible edges, `false` otherwise.
   */
  containsEdge(edge) {
    return this.edges().has(edge) || this.flippedEdges().has(edge);
  }

  /**
   * Count the number of possible edges with an other tile.
   *
   * @param {Tile} otherTile The tile.
   * @returns {number} The number of possible adjacent edges.
   */
  countAdjacentEdges(otherTile) {
    if (otherTile === this) {
      throw new Error('Cannot compute adjacent edges with this');
    }

    let count = 0;

    for (const edge of this.edges().values()) {
      if (otherTile.isAdjacentEdge(edge)) {
        count++;
      }
    }

    return count;
  }

  /**
   * Check if given edge is an adjacent edge of this tile.
   *
   * @param {string} edge The edge to check.
   * @returns {boolean} `true` if the given edge is an adjacent edge of this tile.
   */
  isAdjacentEdge(edge) {
    for (const maybeAdjacentEdge of this.possibleEdges().values()) {
      if (maybeAdjacentEdge === edge) {
        return true;
      }
    }

    return false;
  }

  /**
   * Rotate tile and returns the tile with this new configuration.
   *
   * @returns {this} this
   */
  rotate() {
    const rotatedRows = [];
    const rows = this.rows;
    const size = rows.length;

    for (let y = 0; y < size; ++y) {
      let newRow = '';

      for (let x = 0; x < size; ++x) {
        newRow += rows[size - 1 - x][y];
      }

      rotatedRows.push(newRow);
    }

    // Override rows.
    this._initRows(rotatedRows);

    // Do not forget to rotate connected tiles.
    this._rotateConnections();

    // Connections should also be rotated to keep it sync.

    if (this._connections[BOTTOM] && this._connections[BOTTOM].topEdge() !== this.bottomEdge()) {
      this._connections[BOTTOM].rotate();
    }

    if (this._connections[TOP] && this._connections[TOP].bottomEdge() !== this.topEdge()) {
      this._connections[TOP].rotate();
    }

    if (this._connections[RIGHT] && this._connections[RIGHT].leftEdge() !== this.rightEdge()) {
      this._connections[RIGHT].rotate();
    }

    if (this._connections[LEFT] && this._connections[LEFT].rightEdge() !== this.leftEdge()) {
      this._connections[LEFT].rotate();
    }

    return this;
  }

  /**
   * Rotate connections of this tile.
   *
   * @returns {void}
   */
  _rotateConnections() {
    this._connections.unshift(
        this._connections.pop(),
    );
  }

  /**
   * Get the top edge.
   *
   * @returns {string} The top edge.
   */
  topEdge() {
    return this._edge(TOP);
  }

  /**
   * Get the bottom edge.
   *
   * @returns {string} The bottom edge.
   */
  bottomEdge() {
    return this._edge(BOTTOM);
  }

  /**
   * Get the left edge.
   *
   * @returns {string} The left edge.
   */
  leftEdge() {
    return this._edge(LEFT);
  }

  /**
   * Get the right edge.
   *
   * @returns {string} The right edge.
   */
  rightEdge() {
    return this._edge(RIGHT);
  }

  /**
   * Get known connections of given tile.
   *
   * @returns {Array<Tile>} The known connections.
   */
  connections() {
    return this._connections;
  }

  /**
   * Get the connected tile on top.
   *
   * @returns {Tile} Top connected tile.
   */
  top() {
    return this._connections[TOP];
  }

  /**
   * Get the connected tile on right.
   *
   * @returns {Tile} Right connected tile.
   */
  right() {
    return this._connections[RIGHT];
  }

  /**
   * Get the connected tile on bottom.
   *
   * @returns {Tile} Bottom connected tile.
   */
  bottom() {
    return this._connections[BOTTOM];
  }

  /**
   * Get the connected left on top.
   *
   * @returns {Tile} Left connected tile.
   */
  left() {
    return this._connections[LEFT];
  }

  /**
   * Get given edge by its id.
   *
   * @param {number} id A given edge.
   * @returns {string} The edge.
   */
  _edge(id) {
    return this.rowsEdges()[id];
  }

  /**
   * Flip tile and returns the tile in this new configuration.
   *
   * @returns {this} this
   */
  flip() {
    this._initRows(this.rows.map((row) => (
      reverse(row)
    )));

    // Do not forget to flip connected tile.
    this._flipConnections();

    // Also flip opposite to keep it sync.
    if (this._connections[LEFT]) {
      this._connections[LEFT]._flipConnections();
    }

    if (this._connections[RIGHT]) {
      this._connections[RIGHT]._flipConnections();
    }

    // Top and Bottom connections may also be flipped to keep connections sync
    if (this._connections[TOP] && this._connections[TOP].bottomEdge() !== this.topEdge()) {
      this._connections[TOP].flip();
    }

    if (this._connections[BOTTOM] && this._connections[BOTTOM].topEdge() !== this.bottomEdge()) {
      this._connections[BOTTOM].flip();
    }

    return this;
  }

  /**
   * Flip connections.
   *
   * @return {void}
   */
  _flipConnections() {
    const tmp = this._connections[LEFT];
    this._connections[LEFT] = this._connections[RIGHT];
    this._connections[RIGHT] = tmp;
  }

  /**
   * Try to make the connection with this tile.
   *
   * @param {Tile} tile The tile.
   * @returns {boolean} `true` if connection has been initialized, `false` otherwise.
   */
  tryConnection(tile) {
    if (this.topEdge() === tile.bottomEdge()) {
      this._addConnection(TOP, tile);
      tile._addConnection(BOTTOM, this);
      return true;
    }

    if (this.rightEdge() === tile.leftEdge()) {
      this._addConnection(RIGHT, tile);
      tile._addConnection(LEFT, this);
      return true;
    }

    if (this.bottomEdge() === tile.topEdge()) {
      this._addConnection(BOTTOM, tile);
      tile._addConnection(TOP, this);
      return true;
    }

    if (this.leftEdge() === tile.rightEdge()) {
      this._addConnection(LEFT, tile);
      tile._addConnection(RIGHT, this);
      return true;
    }

    return false;
  }

  /**
   * Add new connection with the tile at the given edge.
   *
   * @param {number} position The edge position.
   * @param {Tile} tile The tile.
   * @returns {void}
   */
  _addConnection(position, tile) {
    this._connections[position] = tile;
  }

  /**
   * Serialize tile to a string.
   *
   * @returns {string} The tile.
   */
  toString() {
    const lines = [];
    lines.push(`Tile ${this.id}:`);

    for (let i = 0; i < this.rows.length; ++i) {
      lines.push(this.rows[i]);
    }

    return lines.join('\n');
  }
}

/**
 * Reverse string.
 *
 * @param {string} str The string.
 * @returns {string} The reversed string.
 */
function reverse(str) {
  let out = '';

  for (let i = str.length - 1; i >= 0; --i) {
    out += str[i];
  }

  return out;
}

module.exports = {
  Tile,
};
