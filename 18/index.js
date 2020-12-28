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

const {readLines} = require('../00/index');

const OPEN_PARENTHESIS = '(';
const CLOSED_PARENTHESIS = ')';

const ADDITION = '+';
const MULTIPLICATION = '*';
const OPERATIONS = {
  [ADDITION]: (x, y) => Number(x) + Number(y),
  [MULTIPLICATION]: (x, y) => Number(x) * Number(y),
};

/**
 * Evaluate the expression on each line and compute the sum of the resulting values.
 *
 * @param {string} file The file path.
 * @returns {Promise<number>} A promise resolved with the sum of each expression.
 */
function compute(file) {
  return readLines(file).then((lines) => {
    return lines.reduce((acc, expr) => acc + computeExpression(expr), 0);
  });
}

/**
 * Compute the expression.
 *
 * The rules of operator precedence have changed.
 * Rather than evaluating multiplication before addition, the operators have the same precedence,
 * and are evaluated left-to-right regardless of the order in which they appear.
 * Note that parentheses can override this order.
 *
 * @param {string} expr The expression.
 * @returns {number} The resulting value.
 */
function computeExpression(expr) {
  let values = [];
  let op = null;

  let nbParenthesis = 0;
  let pending = '';

  for (let i = 0; i < expr.length; ++i) {
    const c = expr[i];
    // Skip sub-expression parsed recursively.
    if (nbParenthesis > 0) {
      if (c === CLOSED_PARENTHESIS) {
        nbParenthesis--;
      } else if (c === OPEN_PARENTHESIS) {
        nbParenthesis++;
      }
    }

    // Otherwise, continue parsing
    else if (nbParenthesis === 0) {
      // We found a new "word"
      if (c === ' ') {
        // We found a number or the operator.
        if (pending === ADDITION || pending === MULTIPLICATION) {
          op = pending;
        } else if (pending) {
          values.push(Number(pending));
        }

        // If we find two values, we can compute it and use the result as the first operand.
        if (values.length === 2) {
          values = [OPERATIONS[op](values[0], values[1])];
        }

        pending = '';
      }

      // Beginning of a sub-expression, parse it recursively.
      else if (c === OPEN_PARENTHESIS) {
        nbParenthesis++;
        values.push(computeExpression(expr.slice(i + 1)));
      }

      // End of the current sub-expression, stop it.
      else if (c === CLOSED_PARENTHESIS) {
        nbParenthesis--;
        break;
      }

      else {
        pending += c;
      }
    }
  }

  if (pending) {
    values.push(Number(pending));
  }

  if (values.length === 2) {
    values = [
      OPERATIONS[op](values[0], values[1]),
    ];
  }

  return values[0];
}

module.exports = {
  compute,
  computeExpression,
};
