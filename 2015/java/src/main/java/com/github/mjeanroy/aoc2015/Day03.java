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

final class Day03 {
	private Day03() {
	}

	static long part01(String fileName) {
		String content = AocUtils.readFile("/day03/" + fileName);

		Coordinates santa = new Coordinates(0, 0);

		Set<Coordinates> visitedLocations = new HashSet<>();
		visitedLocations.add(santa);

		for (char c : content.toCharArray()) {
			santa = move(santa, c);
			visitedLocations.add(santa);
		}

		return visitedLocations.size();
	}

	static long part02(String fileName) {
		Coordinates santa = new Coordinates(0, 0);
		Coordinates robot = new Coordinates(0, 0);

		Set<Coordinates> visitedLocations = new HashSet<>();
		visitedLocations.add(santa);
		visitedLocations.add(robot);

		String content = AocUtils.readFile("/day03/" + fileName);

		int i = 0;
		for (char c : content.toCharArray()) {
			if (i % 2 == 0) {
				santa = move(santa, c);
			} else {
				robot = move(robot, c);
			}

			visitedLocations.add(santa);
			visitedLocations.add(robot);
			i++;
		}

		return visitedLocations.size();
	}

	private static Coordinates move(Coordinates position, char c) {
		if (c == '^') {
			position = position.moveUp();
		} else if (c == 'v') {
			position = position.moveDown();
		} else if (c == '>') {
			position = position.moveRight();
		} else if (c == '<') {
			position = position.moveLeft();
		} else {
			throw new RuntimeException("Unknown operation: " + c);
		}

		return position;
	}

	private record Coordinates(int x, int y) {
		Coordinates moveUp() {
			return new Coordinates(x, y + 1);
		}

		Coordinates moveDown() {
			return new Coordinates(x, y - 1);
		}

		Coordinates moveLeft() {
			return new Coordinates(x - 1, y);
		}

		Coordinates moveRight() {
			return new Coordinates(x + 1, y);
		}
	}
}
