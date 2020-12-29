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

const add = (x, y) => Number(x) + Number(y);
const multiply = (x, y) => Number(x) * Number(y);

const OPERATIONS = {
  [ADDITION]: {
    precedence: 2,
    evaluate: add,
  },

  [MULTIPLICATION]: {
    precedence: 1,
    evaluate: multiply,
  },
};

/**
 * Evaluate the expression on each line and compute the sum of the resulting values.
 *
 * @param {string} file The file path.
 * @returns {Promise<number>} A promise resolved with the sum of each expression.
 */
function part1(file) {
  return readLines(file).then((lines) => {
    return lines.reduce((acc, expr) => acc + computeExpression(expr), 0);
  });
}

/**
 * Evaluate the expression on each line and compute the sum of the resulting values.
 *
 * @param {string} file The file path.
 * @returns {Promise<number>} A promise resolved with the sum of each expression.
 */
function part2(file) {
  return readLines(file).then((lines) => {
    return lines.reduce((acc, expr) => acc + computeExpressionWithPrecedence(expr), 0);
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
 * @param {Object<string, object>} operations The list of operations.
 * @returns {number} The resulting value.
 */
function computeExpression(expr, operations) {
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
 * Compute the expression.
 *
 * The rules of operator precedence have changed.
 * Addition and multiplication have different precedence levels: addition is evaluated before multiplication.
 *
 * @param {string} expr The expression.
 * @returns {number} The resulting value.
 */
function computeExpressionWithPrecedence(expr) {
  const rpn = shuntingYard(expr);
  return computeReversePolishNotation(rpn);
}

/**
 * Run the shunting yard algorithm on given expression.
 *
 * Basically, it will translate postfix notation to `reverse polish notation`
 * taking care of operator precedence.
 *
 * @param {string} expr The expression.
 * @returns {Array<string>} The RPN outout.
 * @see https://brilliant.org/wiki/shunting-yard-algorithm/
 */
function shuntingYard(expr) {
  let token = '';

  const output = []; // A queue
  const operators = []; // A stack

  const handleToken = (token) => {
    if (!token) {
      return;
    }

    // We found a new token

    // If it's a number add it to queue `output`
    if (isNumber(token)) {
      output.push(token);
    }

    // If it's an operator
    //   While there's an operator on the top of the stack with greater precedence:
    //     Pop operators from the stack onto the output queue
    //   Push the current operator onto the stack
    else if (isOperator(token)) {
      const operator = OPERATIONS[token];
      const precedence = operator.precedence;
      while (operators.length > 0 && OPERATIONS[operators[operators.length - 1]] && OPERATIONS[operators[operators.length - 1]].precedence > precedence) {
        output.push(operators.pop());
      }

      operators.push(token);
    }

    // If it's a left bracket push it onto the stack
    else if (token === OPEN_PARENTHESIS) {
      operators.push(token);
    }

    // If it's a right bracket
    //   While there's not a left bracket at the top of the stack:
    //     Pop operators from the stack onto the output queue.
    //   Pop the left bracket from the stack and discard it
    else if (token === CLOSED_PARENTHESIS) {
      while (operators.length > 0 && operators[operators.length - 1] !== OPEN_PARENTHESIS) {
        output.push(operators.pop());
      }

      operators.pop();
    }

    else {
      throw new Error('Unknown token: ' + token);
    }
  };

  // While there are tokens to be read:
  for (let i = 0; i < expr.length; ++i) {
    const c = expr[i];
    if (token === OPEN_PARENTHESIS || c === CLOSED_PARENTHESIS) {
      handleToken(token);
      token = c;
    }

    else if (c === ' ') {
      handleToken(token);
      token = '';
    }

    else {
      token += c;
    }
  }

  // Do not forget the last token!
  handleToken(token);

  // While there are operators on the stack, pop them to the queue
  while (operators.length > 0) {
    output.push(operators.pop());
  }

  return output;
}

/**
 * Compute the result of the RPN notation expression.
 *
 * @param {Array<string>} output The RPN queue.
 * @returns {number} The final result.
 */
function computeReversePolishNotation(output) {
  const stack = [];

  for (let i = 0; i < output.length; ++i) {
    const value = output[i];
    if (isNumber(value)) {
      stack.push(value);
    }

    else if (isOperator(value)) {
      const v2 = stack.pop();
      const v1 = stack.pop();
      const operator = OPERATIONS[value];
      const result = operator.evaluate(v1, v2);
      stack.push(result);
    }
  }

  return stack[0];
}

/**
 * Check that a given token is a number.
 *
 * @param {string} token The token.
 * @returns {boolean} `true` if token is a number, `false` otherwise.
 */
function isNumber(token) {
  if (!token) {
    return false;
  }

  for (let i = 0; i < token.length; ++i) {
    const c = token[i];
    if (c < '0' || c > '9') {
      return false;
    }
  }

  return true;
}

/**
 * Check that a given is an operator.
 *
 * @param {string} token The token.
 * @returns {boolean} `true` if token is an operator, `false` otherwise.
 */
function isOperator(token) {
  return Object.prototype.hasOwnProperty.call(OPERATIONS, token);
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
  part1,
  part2,
  computeExpression,
  computeExpressionWithPrecedence,
};
