/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2021 Mickael Jeanroy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package com.github.mjeanroy.aoc2015;

class Day01 {
	private Day01() {
	}

	static long part01(String fileName) {
		String input = AocUtils.readFile("/day01/" + fileName);

		long floor = 0;
		for (char c : input.toCharArray()) {
			floor = move(floor, c);
		}

		return floor;
	}

	static long part02(String fileName) {
		String input = AocUtils.readFile("/day01/" + fileName);

		int i = 1;
		long floor = 0;
		for (char c : input.toCharArray()) {
			floor = move(floor, c);

			if (floor == -1) {
				return i;
			}

			i++;
		}

		return -1;
	}

	private static long move(long floor, char c) {
		if (c == '(') {
			return floor + 1;
		} else if (c == ')') {
			return floor - 1;
		}

		throw new RuntimeException("Unknown operation: " + c);
	}
}
