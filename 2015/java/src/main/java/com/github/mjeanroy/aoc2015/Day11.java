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

import java.util.HashSet;
import java.util.Set;

final class Day11 {
	private Day11() {
	}

	static String part01(String input) {
		while (true) {
			input = incrementPassword(input);
			if (isValidPassword(input)) {
				return input;
			}
		}
	}

	private static boolean isValidPassword(String input) {
		// Not really optimized but each check run in O(n)
		// At least, it is readable :)
		return (
			containsIncreasingSequence(input)
				&& !containsForbiddenCharacters(input)
				&& containsNonOverlappingPair(input)
		);
	}

	private static boolean containsNonOverlappingPair(String input) {
		if (input == null || input.length() < 2) {
			return false;
		}

		Set<Integer> pairPositions = new HashSet<>();
		char[] chars = input.toCharArray();
		char c1 = chars[0];
		for (int i = 0; i < chars.length - 1; ++i) {
			char c2 = chars[i + 1];
			if (c1 == c2 && !pairPositions.contains(i - 1)) {
				pairPositions.add(i);
			}

			c1 = c2;
		}

		return pairPositions.size() >= 2;
	}

	private static boolean containsIncreasingSequence(String input) {
		if (input == null || input.length() < 3) {
			return false;
		}

		char[] chars = input.toCharArray();
		char c1 = chars[0];
		char c2 = chars[1];
		for (int i = 2; i < chars.length; ++i) {
			char c3 = chars[i];
			if (isIncreasing(c1, c2, c3)) {
				return true;
			}

			c1 = c2;
			c2 = c3;
		}

		return false;
	}

	private static boolean isIncreasing(char c1, char c2, char c3) {
		return c1 == (c2 - 1) && c2 == (c3 - 1);
	}

	private static boolean containsForbiddenCharacters(String input) {
		if (input == null || input.length() < 1) {
			return false;
		}

		Set<Character> blacklist = Set.of(
			'i',
			'o',
			'l'
		);

		for (char c : input.toCharArray()) {
			if (blacklist.contains(c)) {
				return true;
			}
		}

		return false;
	}

	private static String incrementPassword(String input) {
		if (input == null || input.isEmpty()) {
			return "a";
		}

		char[] chars = input.toCharArray();
		for (int i = chars.length - 1; i >= 0; --i) {
			char c = chars[i];
			if (c == 'z') {
				chars[i] = 'a';
			} else {
				chars[i]++;
				break;
			}
		}

		return String.copyValueOf(chars);
	}
}
