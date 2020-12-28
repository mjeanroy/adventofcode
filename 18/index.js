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
  [ADDITION]: {
    precedence: 2,
    evaluate(x, y) {
      return Number(x) + Number(y);
    },
  },

  [MULTIPLICATION]: {
    precedence: 1,
    evaluate(x, y) {
      return Number(x) * Number(y);
    },
  },
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
  const stack = [];

  let token = '';

  for (let i = 0; i < expr.length; ++i) {
    const c = expr[i];
    if (c === ' ') {
      addToStack(stack, token);
      token = '';
    }

    else if (c === OPEN_PARENTHESIS) {
      addToStack(stack, token);
      addToStack(stack, c);
      token = '';
    }

    else if (c === CLOSED_PARENTHESIS) {
      addToStack(stack, token);
      computeOnTopStack(stack);
      token = '';
    }

    else {
      token += c;
    }
  }

  addToStack(stack, token);

  return computeOnFrontOfStack(stack);
}

/**
 * Add value to the stack if it is defined.
 *
 * @param {Array<string|number>} stack The stack.
 * @param {string} token The token to add.
 * @returns {void}
 */
function addToStack(stack, token) {
  if (token) {
    stack.push(token);
  }
}

/**
 * Compute the top of the stack, until the stack is empty or until we find an open parenthesis.
 *
 * @param {Array<string>} stack The stack.
 * @returns {void}
 */
function computeOnTopStack(stack) {
  const queue = [];

  while (stack.length > 0) {
    const v = stack.pop();

    if (v === OPEN_PARENTHESIS) {
      break;
    }

    else {
      queue.unshift(v);
    }
  }

  stack.push(
      computeOnFrontOfStack(queue),
  );
}

/**
 * Reduce stack by computing all values one by one from left to right.
 *
 * @param {Array<string|number>} stack The stack.
 * @returns {number} The last resulting value.
 */
function computeOnFrontOfStack(stack) {
  while (stack.length > 1) {
    const v1 = stack.shift();
    const op = stack.shift();
    const v2 = stack.shift();

    const operator = OPERATIONS[op];
    const result = operator.evaluate(v1, v2);

    stack.unshift(result);
  }

  // The last stored value is the final result.
  return Number(stack[0]);
}

module.exports = {
  compute,
  computeExpression,
};
