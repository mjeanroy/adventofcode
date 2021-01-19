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

import java.util.List;

import static java.util.Arrays.asList;

final class Day03 extends AbstractDay {

	private static final char TREE = '#';

	static long part1(String file) {
		List<String> lines = readLines("day03", file);
		Slope slope = new Slope(3, 1);
		return countTrees(lines, slope);
	}

	static long part2(String file) {
		List<String> lines = readLines("day03", file);
		List<Slope> slopes = asList(
				new Slope(1, 1),
				new Slope(3, 1),
				new Slope(5, 1),
				new Slope(7, 1),
				new Slope(1, 2)
		);

		long product = 1;

		for (Slope slope : slopes) {
			product *= countTrees(lines, slope);
		}

		return product;
	}


	private static long countTrees(List<String> lines, Slope slope) {
		int nbRows = lines.size();

		long count = 0;
		Position position = new Position(0, 0);

		while (position.y < nbRows) {
			String row = lines.get(position.y);
			char c = row.charAt(position.x);
			if (c == TREE) {
				count++;
			}

			int nextY = position.y + slope.down;
			int nextX = (position.x + slope.right) % row.length();
			position = new Position(nextX, nextY);
		}

		return count;
	}

	private static final class Slope {
		private final int right;
		private final int down;

		private Slope(int right, int down) {
			this.right = right;
			this.down = down;
		}
	}

	private static final class Position {
		private final int x;
		private final int y;

		private Position(int x, int y) {
			this.x = x;
			this.y = y;
		}
	}
}
