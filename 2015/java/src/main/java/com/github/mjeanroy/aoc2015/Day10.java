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

final class Day10 {
	private Day10() {
	}

	static int part01(String input) {
		String output = input;
		for (int i = 0; i < 40; ++i) {
			output = lookAndSay(output);
		}

		return output.length();
	}

	private static String lookAndSay(String input) {
		if (input == null || input.length() == 0) {
			return "0";
		}

		if (input.length() == 1) {
			return "1" + input;
		}

		int sequence = 1;
		char[] chars = input.toCharArray();
		char previous = chars[0];
		StringBuilder output = new StringBuilder();

		for (int i = 1; i < chars.length; ++i) {
			char c = chars[i];
			if (c == previous) {
				sequence++;
			} else {
				output.append(sequence).append(previous);
				sequence = 1;
			}

			previous = c;
		}

		output.append(sequence).append(previous);
		return output.toString();
	}
}
