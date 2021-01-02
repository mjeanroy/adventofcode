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

/* eslint-disable brace-style */

const {readParagraphs, sumOf, toNumber} = require('../00/index');

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
 * Compute the the winning player's score.
 *
 * @param {string} file File path.
 * @returns {Promise<number>} A promise resolved with the score of the winner.
 */
function part2(file) {
  return readParagraphs(file).then((paragraphs) => {
    const deck1 = parseDeck(paragraphs[0].trim());
    const deck2 = parseDeck(paragraphs[1].trim());
    const winner = playRecursiveCombat(deck1, deck2);
    return computeScore(winner);
  });
}

/**
 * Play the game.
 *
 * @param {Array<number>} deck1 Card of player 1.
 * @param {Array<number>} deck2 Card of player 2.
 * @returns {Array<number>} The winner deck.
 */
function playRecursiveCombat(deck1, deck2) {
  const rounds = new Set();

  while (deck1.length > 0 && deck2.length > 0) {
    // Before either player deals a card, if there was a previous round
    // in this game that had exactly the same cards in the same order
    // in the same players' decks, the game instantly ends in a win for
    // player 1.
    // Previous rounds from other games are not considered.
    // (This prevents infinite games of Recursive Combat, which everyone
    // agrees is a bad idea.)
    const state = serializeDecks(deck1, deck2);
    if (rounds.has(state)) {
      return deck1;
    }

    // Memorize this round.
    rounds.add(state);

    // The players begin the round by each drawing the top card of their
    // deck as normal.
    const p1 = deck1.shift();
    const p2 = deck2.shift();

    // If both players have at least as many cards remaining in their deck as the
    // value of the card they just drew, the winner of the round is determined by
    // playing a new game of Recursive Combat.
    if (deck1.length >= p1 && deck2.length >= p2) {
      const subDeck1 = deck1.slice(0, p1);
      const subDeck2 = deck2.slice(0, p2);
      const subGameWinner = playRecursiveCombat(subDeck1, subDeck2);
      if (subGameWinner === subDeck1) {
        deck1.push(p1);
        deck1.push(p2);
      } else {
        deck2.push(p2);
        deck2.push(p1);
      }
    }

    // Otherwise, at least one player must not have enough cards left in their deck to recurse;
    // the winner of the round is the player with the higher-value card.
    else {
      playRound(p1, p2, deck1, deck2);
    }
  }

  // The winner is the one with a non empty deck.
  return deck1.length === 0 ? deck2 : deck1;
}

/**
 * Serialize decks, i.e serialze round state, to a unique string.
 *
 * @param {Array<number>} deck1 Player 1 deck.
 * @param {Array<number>} deck2 Player 2 deck.
 * @returns {string} The id.
 */
function serializeDecks(deck1, deck2) {
  return serializeDeck(deck1) + ';' + serializeDeck(deck2);
}

/**
 * Serialize deck to unique string, maintaining card order.
 *
 * @param {Array<number>} deck The deck.
 * @returns {string} The id.
 */
function serializeDeck(deck) {
  return deck.join(',');
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
    playRound(p1, p2, deck1, deck2);
  }

  return deck1.length === 0 ? deck2 : deck1;
}

/**
 * Play a round.
 * @param {number} p1 Card played by player 1.
 * @param {number} p2 Card played by player 2.
 * @param {Array<number>} deck1 Player 1 deck.
 * @param {Array<number>} deck2 Player 2 deck.
 * @returns {void}
 */
function playRound(p1, p2, deck1, deck2) {
  if (p1 > p2) {
    deck1.push(p1);
    deck1.push(p2);
  } else {
    deck2.push(p2);
    deck2.push(p1);
  }
}

/**
 * Compute the final score for this deck.
 *
 * @param {Array<number>} deck Cards.
 * @returns {number} The final score.
 */
function computeScore(deck) {
  return sumOf(deck, (card, i) => (
    card * (deck.length - i)
  ));
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
  part2,
};
