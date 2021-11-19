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
import java.util.Set;

class Day05 {
	private static final Set<Character> VOWELS = Set.of('a', 'e', 'i', 'o', 'u');

	private Day05() {
	}

	static long part01(String fileName) {
		List<String> lines = AocUtils.readLines("/day05/" + fileName);
		return lines.stream().filter(Day05::isNiceString).count();
	}

	private static boolean isNiceString(String line) {
		if (line.length() < 2) {
			return false;
		}

		Set<String> disallowedSubstring = Set.of(
				"ab",
				"cd",
				"pq",
				"xy"
		);

		char[] input = line.toCharArray();
		char previous = input[0];
		int nbVowel = isVowel(previous) ? 1 : 0;
		boolean inARow = false;

		for (int i = 1; i < input.length; ++i) {
			char c = input[i];

			String substring = String.valueOf(previous) + c;
			if (disallowedSubstring.contains(substring)) {
				return false;
			}

			if (c == previous) {
				inARow = true;
			}

			if (isVowel(c)) {
				nbVowel++;
			}

			previous = c;
		}

		return nbVowel >= 3 && inARow;
	}

	private static boolean isVowel(char c) {
		return VOWELS.contains(c);
	}
}
