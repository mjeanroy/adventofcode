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
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

final class Day06 {
	private Day06() {
	}

	static long part01(String fileName) {
		List<String> lines = AocUtils.readLines("/day06/" + fileName);
		Grid grid = new Grid(1000);
		for (String line : lines) {
			parseInput(line).apply(grid);
		}

		return grid.countLightOn();
	}

	private static Instruction parseInput(String input) {
		Pattern p = Pattern.compile("(turn on|turn off|toggle) (\\d+),(\\d+) through (\\d+),(\\d+)");
		Matcher m = p.matcher(input);
		if (!m.matches()) {
			throw new RuntimeException("Cannot parse input: " + input);
		}

		Action action = parseAction(m.group(1));

		Coordinate topLeft = new Coordinate(
				AocUtils.toInt(m.group(2)),
				AocUtils.toInt(m.group(3))
		);

		Coordinate bottomRight = new Coordinate(
				AocUtils.toInt(m.group(4)),
				AocUtils.toInt(m.group(5))
		);

		return new Instruction(action, topLeft, bottomRight);
	}

	private static Action parseAction(String action) {
		if (action.equals("turn on")) {
			return Action.TURN_ON;
		}

		if (action.equals("turn off")) {
			return Action.TURN_OFF;
		}

		if (action.equals("toggle")) {
			return Action.TOGGLE;
		}

		throw new RuntimeException("Unknown action: " + action);
	}

	private enum Action {
		TOGGLE {
			@Override
			void apply(Grid grid, int x, int y) {
				grid.toggle(x, y);
			}
		},

		TURN_OFF {
			@Override
			void apply(Grid grid, int x, int y) {
				grid.turnOff(x, y);
			}
		},

		TURN_ON {
			@Override
			void apply(Grid grid, int x, int y) {
				grid.turnOn(x, y);
			}
		};

		abstract void apply(Grid grid, int x, int y);
	}

	private record Instruction(Action action, Coordinate topLeft, Coordinate bottomRight) {
		void apply(Grid grid) {
			for (int y = topLeft.y; y <= bottomRight.y; ++y) {
				for (int x = topLeft.x; x <= bottomRight.x; ++x) {
					action.apply(grid, x, y);
				}
			}
		}
	}

	private record Coordinate(int x, int y) {
	}

	private static final class Grid {
		private final boolean[][] rows;

		private Grid(int size) {
			this.rows = new boolean[size][];
			for (int i = 0; i < size; ++i) {
				this.rows[i] = new boolean[size];
			}
		}

		void turnOn(int x, int y) {
			action(x, y, (state) -> true);
		}

		void turnOff(int x, int y) {
			action(x, y, (state) -> false);
		}

		void toggle(int x, int y) {
			action(x, y, (state) -> !state);
		}

		long countLightOn() {
			long count = 0;

			for (boolean[] row : rows) {
				for (boolean state : row) {
					if (state) {
						count++;
					}
				}
			}

			return count;
		}

		private void action(int x, int y, Function<Boolean, Boolean> fn) {
			if (y < 0 || y >= this.rows.length) {
				throw new IndexOutOfBoundsException("Invalid coordinates y=" + y);
			}

			boolean[] row = this.rows[y];
			if (x < 0 || x >= row.length) {
				throw new IndexOutOfBoundsException("Invalid coordinates x=" + y);
			}

			row[x] = fn.apply(row[x]);
		}
	}
}
