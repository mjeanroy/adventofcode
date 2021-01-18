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
import java.util.Optional;
import java.util.Set;

final class Day01 extends AbstractDay {

	static long part1(String file) {
		List<String> lines = read(file);
		Pair pair = findPair(lines, 2020).orElseThrow(() -> new AssertionError("Cannot find pair matching 2020"));
		return pair.x * pair.y;
	}

	static long part2(String file) {
		List<String> lines = read(file);
		for (String value : lines) {
			long nb = toLong(value);
			long target = 2020 - nb;
			Optional<Pair> pair = findPair(lines, target);
			if (pair.isPresent()) {
				return nb * pair.get().x * pair.get().y;
			}
		}

		throw new AssertionError("Cannot find triplet matching 2020");
	}

	private static List<String> read(String file) {
		return readLines("/day01/" + file);
	}

	private static Optional<Pair> findPair(List<String> lines, long target) {
		Set<Long> entries = new HashSet<>();

		for (String value : lines) {
			long x = toLong(value);
			long lookingFor = target - x;
			if (entries.contains(lookingFor)) {
				return Optional.of(new Pair(x, lookingFor));
			}

			entries.add(x);
		}

		return Optional.empty();
	}

	private static class Pair {
		private final long x;
		private final long y;

		private Pair(long x, long y) {
			this.x = x;
			this.y = y;
		}
	}
}
