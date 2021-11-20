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
import java.util.function.Supplier;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

final class Day06 {
	private Day06() {
	}

	static long part01(String fileName) {
		List<String> lines = AocUtils.readLines("/day06/" + fileName);
		LightGrid grid = new LightGrid(1000);
		for (String line : lines) {
			parseInput(line).apply(grid);
		}

		return grid.countLightOn();
	}

	static long part02(String fileName) {
		List<String> lines = AocUtils.readLines("/day06/" + fileName);
		BrightnessGrid grid = new BrightnessGrid(1000);
		for (String line : lines) {
			parseInput(line).apply(grid);
		}

		return grid.totalBrightness();
	}

	private static Instruction parseInput(String input) {
		Pattern p = Pattern.compile("(turn on|turn off|toggle) (\\d+),(\\d+) through (\\d+),(\\d+)");
		Matcher m = p.matcher(input);
		if (!m.matches()) {
			throw new RuntimeException("Cannot parse input: " + input);
		}

		Action action = Action.parse(m.group(1));

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

	private enum Action {
		TOGGLE("toggle") {
			@Override
			void apply(Grid grid, int x, int y) {
				grid.toggle(x, y);
			}
		},

		TURN_OFF("turn off") {
			@Override
			void apply(Grid grid, int x, int y) {
				grid.turnOff(x, y);
			}
		},

		TURN_ON("turn on") {
			@Override
			void apply(Grid grid, int x, int y) {
				grid.turnOn(x, y);
			}
		};

		private final String name;

		Action(String name) {
			this.name = name;
		}

		abstract void apply(Grid grid, int x, int y);

		static Action parse(String input) {
			for (Action action : Action.values()) {
				if (action.name.equals(input)) {
					return action;
				}
			}

			throw new RuntimeException("Unknown action: " + input);
		}
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

	interface Grid {
		void turnOn(int x, int y);
		void turnOff(int x, int y);
		void toggle(int x, int y);
	}

	private static final class LightGrid implements Grid {
		private final boolean[][] rows;

		private LightGrid(int size) {
			this.rows = new boolean[size][];
			for (int i = 0; i < size; ++i) {
				this.rows[i] = new boolean[size];
			}
		}

		@Override
		public void turnOn(int x, int y) {
			action(x, y, (state) -> true);
		}

		@Override
		public void turnOff(int x, int y) {
			action(x, y, (state) -> false);
		}

		@Override
		public void toggle(int x, int y) {
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

	private static final class BrightnessGrid implements Grid {
		private final int[][] rows;

		private BrightnessGrid(int size) {
			this.rows = new int[size][];
			for (int i = 0; i < size; ++i) {
				this.rows[i] = new int[size];
			}
		}

		@Override
		public void turnOn(int x, int y) {
			action(x, y, () -> 1);
		}

		@Override
		public void turnOff(int x, int y) {
			action(x, y, () -> -1);
		}

		@Override
		public void toggle(int x, int y) {
			action(x, y, () -> 2);
		}

		long totalBrightness() {
			long total = 0;
			for (int[] row : rows) {
				for (int brightness : row) {
					total += brightness;
				}
			}

			return total;
		}

		private void action(int x, int y, Supplier<Integer> fn) {
			if (y < 0 || y >= this.rows.length) {
				throw new IndexOutOfBoundsException("Invalid coordinates y=" + y);
			}

			int[] row = this.rows[y];
			if (x < 0 || x >= row.length) {
				throw new IndexOutOfBoundsException("Invalid coordinates x=" + y);
			}

			row[x] = Math.max(0, row[x] + fn.get());
		}
	}
}
