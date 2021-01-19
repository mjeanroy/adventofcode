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

package com.github.mjeanroy.aoc.year2020;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

class Day05 extends AbstractDay {

	static long part1(String file) {
		List<String> lines = readLines("day05", file);
		long max = Long.MIN_VALUE;

		for (String line : lines) {
			max = Math.max(max, computeSeatId(line));
		}

		return max;
	}

	static long part2(String file) {
		List<String> lines = readLines("day05", file);
		Set<Long> seats = new HashSet<>();

		long min = Long.MAX_VALUE;
		long max = -1;

		for (String line : lines) {
      long seatId = computeSeatId(line);
			seats.add(seatId);
			min = Math.min(min, seatId);
			max = Math.max(max, seatId);
		}

		// Then go through all and look for the missing one
		for (long i = min; i <= max; ++i) {
			if (!seats.contains(i)) {
				return i;
			}
		}

		throw new AssertionError("Cannot find missing seat...");
	}

	private static long computeSeatId(String boardingPass) {
		char[] part1 = boardingPass.substring(0, 7).toCharArray();
		long row = binaryComputation(part1, 'F', 'B');

		char[] part2 = boardingPass.substring(7).toCharArray();
		long col = binaryComputation(part2, 'L', 'R');

		return row * 8 + col;
	}

	private static long binaryComputation(char[] chars, char lower, char upper) {
		long left = 0;
		long right = Double.valueOf(Math.pow(2, chars.length)).intValue() - 1;
		for (int i = 0; i < chars.length - 1; ++i) {
			char c = chars[i];
			long mid = Math.floorDiv(right - left, 2);
			if (c == lower) {
				right = left + mid;
			} else if (c == upper) {
				left = right - mid;
			}
		}

		return chars[chars.length - 1] == lower ? Math.min(left, right) : Math.max(left, right);
	}
}
