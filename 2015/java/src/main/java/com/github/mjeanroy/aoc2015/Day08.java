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

import java.util.List;

final class Day08 {
	private Day08() {
	}

	static long part01(String fileName) {
		List<String> lines = AocUtils.readLines("/day08/" + fileName);
		long sum = 0;
		for (String line : lines) {
			sum += computeSizeMinusInMemorySize(line.trim());
		}

		return sum;
	}

	static long part02(String fileName) {
		List<String> lines = AocUtils.readLines("/day08/" + fileName);

		long sum = 0;
		for (String line : lines) {
			sum += Math.abs(computeSizeMinusInMemorySize(
					encode(line.trim())
			));
		}

		return sum;
	}

	private static int computeSizeMinusInMemorySize(String input) {
		int length = input.length();

		if (length < 2) {
			throw new RuntimeException("Invalid string representation: " + input);
		}

		if (input.charAt(0) != '"' || input.charAt(length - 1) != '"') {
			throw new RuntimeException("Invalid string representation: " + input);
		}

		return length - computeInMemorySize(input);
	}

	private static int computeEncodedSizeMinusInMemorySize(String input) {
		int length = input.length();

		if (length < 2) {
			throw new RuntimeException("Invalid string representation: " + input);
		}

		if (input.charAt(0) != '"' || input.charAt(length - 1) != '"') {
			throw new RuntimeException("Invalid string representation: " + input);
		}

		return length - computeInMemorySize(input);
	}

	private static int computeInMemorySize(String input) {
		int inMemorySize = 0;
		char[] chars = input.toCharArray();

		for (int i = 1; i < input.length() - 1; ++i) {
			char c = chars[i];
			if (c == '\\') {
				char next = chars[i + 1];
				if (next == 'x') {
					i += 3;
				} else if (next == '"' || next == '\\') {
					i += 1;
				} else {
					throw new RuntimeException("Unknown escaped character: " + c);
				}
			}

			inMemorySize++;
		}

		return inMemorySize;
	}

	private static String encode(String input) {
		StringBuilder sb = new StringBuilder("\"");

		for (char c : input.toCharArray()) {
			if (c == '"' || c == '\\') {
				sb.append('\\');
			}

			sb.append(c);
		}

		return sb.append("\"").toString();
	}
}
