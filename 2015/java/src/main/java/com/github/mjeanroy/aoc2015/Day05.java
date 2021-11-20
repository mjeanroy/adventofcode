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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Predicate;

class Day05 {

	private Day05() {
	}

	static long part01(String fileName) {
		return countNiceStrings(fileName, Day05::isNiceStringPart1);
	}

	static long part02(String fileName) {
		return countNiceStrings(fileName, Day05::isNiceStringPart2);
	}

	private static long countNiceStrings(String fileName, Predicate<String> predicate) {
		return AocUtils.readLines("/day05/" + fileName).stream().filter(predicate).count();
	}

	private static boolean isNiceStringPart2(String line) {
		return containsRepeatedCharacter(line) && containsRepeatedPair(line);
	}

	private static boolean containsRepeatedCharacter(String line) {
		if (line.length() < 3) {
			return false;
		}

		char[] chars = line.toCharArray();
		char c0 = chars[0];
		char c1 = chars[1];
		for (int i = 2; i < chars.length; ++i) {
			char c2 = chars[i];
			if (c0 == c2) {
				return true;
			}

			c0 = c1;
			c1 = c2;
		}

		return false;
	}

	private static boolean containsRepeatedPair(String line) {
		if (line.length() < 4) {
			return false;
		}

		Map<String, List<Position>> pairs = new HashMap<>();
		char[] chars = line.toCharArray();
		char c0 = chars[0];

		for (int i = 1; i < chars.length; ++i) {
			char c1 = chars[i];
			String pair = concat(c0, c1);
			Position position = new Position(i - 1, i);

			if (!pairs.containsKey(pair)) {
				pairs.put(pair, new ArrayList<>());
			}

			List<Position> currentPositions = pairs.get(pair);
			if (currentPositions.isEmpty()) {
				pairs.get(pair).add(position);
			} else {
				// Does it overlap with previous position?
				Position lastPosition = AocUtils.lastElement(currentPositions);
				if (!lastPosition.overlapWith(position)) {
					currentPositions.add(position);
				}
			}

			if (currentPositions.size() == 2) {
				return true;
			}

			c0 = c1;
		}

		return false;
	}

	private static String concat(char c1, char c2) {
		return String.valueOf(c1) + c2;
	}

	private record Position(int x, int y) {
		boolean overlapWith(Position position) {
			return position.x >= x && position.x <= y;
		}
	}

	private static boolean isNiceStringPart1(String line) {
		if (line.length() < 2) {
			return false;
		}

		Set<Character> vowels = Set.of(
				'a',
				'e',
				'i',
				'o',
				'u'
		);

		Set<String> disallowedSubstring = Set.of(
				"ab",
				"cd",
				"pq",
				"xy"
		);

		char[] input = line.toCharArray();
		char previous = input[0];
		int nbVowel = vowels.contains(previous) ? 1 : 0;
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

			if (vowels.contains(c)) {
				nbVowel++;
			}

			previous = c;
		}

		return nbVowel >= 3 && inARow;
	}
}
