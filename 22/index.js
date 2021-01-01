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

const {readParagraphs, toNumber} = require('../00/index');

/**
 * Compute the the winning player's score.
 *
 * @param {string} file File path.
 * @returns {Promise<number>} A promise resolved with the score of the winner.
 */
function part1(file) {
  return readParagraphs(file).then((paragraphs) => {
    const deck1 = parseDeck(paragraphs[0].trim());
    const deck2 = parseDeck(paragraphs[1].trim());
    const winner = play(deck1, deck2);
    return computeScore(winner);
  });
}

/**
 * Compute the final score for this deck.
 *
 * @param {Array<number>} deck Cards.
 * @returns {number} The final score.
 */
function computeScore(deck) {
  let score = 0;
  let idx = deck.length;
  for (let i = 0; i < deck.length; ++i) {
    const card = deck[i];
    const round = card * idx;
    score += round;
    idx--;
  }

  return score;
}

/**
 * Play the game.
 *
 * @param {Array<number>} deck1 Card of player 1.
 * @param {Array<number>} deck2 Card of player 2.
 * @returns {Array<number>} The winner deck.
 */
function play(deck1, deck2) {
  while (deck1.length > 0 && deck2.length > 0) {
    const p1 = deck1.shift();
    const p2 = deck2.shift();
    if (p1 > p2) {
      deck1.push(p1);
      deck1.push(p2);
    } else {
      deck2.push(p2);
      deck2.push(p1);
    }
  }

  return deck1.length === 0 ? deck2 : deck1;
}

/**
 * Parse card deck.
 *
 * @param {string} paragraph The paragraph.
 * @returns {Array<number>} The card deck.
 */
function parseDeck(paragraph) {
  const lines = paragraph.split('\n');
  return lines.slice(1).map((x) => toNumber(x));
}

module.exports = {
  part1,
};
