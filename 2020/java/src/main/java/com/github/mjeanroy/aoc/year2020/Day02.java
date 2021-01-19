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
import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

final class Day02 extends AbstractDay {

	static int part1(String file) {
		return countValid(file, Day02::isValid1);
	}

	static int part2(String file) {
		return countValid(file, Day02::isValid2);
	}

	private static int countValid(String file, Predicate<Line> predicate) {
		List<String> lines = readLines("day02", file);

		int nbValid = 0;

		for (String rawLine : lines) {
			if (predicate.test(parseLine(rawLine))) {
				nbValid++;
			}
		}

		return nbValid;
	}

	private static boolean isValid1(Line line) {
		int occ = 0;

		for (char x : line.pwd.toCharArray()) {
			if (x == line.policy.c) {
				occ++;
			}
		}

		return occ >= line.policy.min && occ <= line.policy.max;
	}

	private static boolean isValid2(Line line) {
		if (line.pwd.length() < line.policy.min || line.pwd.length() < line.policy.max) {
			return false;
		}

		int occ = 0;

		if (line.pwd.charAt(line.policy.min - 1) == line.policy.c) {
			occ++;
		}

		if (line.pwd.charAt(line.policy.max - 1) == line.policy.c) {
			occ++;
		}

		return occ == 1;
	}

	private static Line parseLine(String line) {
		Pattern pattern = Pattern.compile("(\\d+)-(\\d+) ([a-z]): ([a-z]+)");
		Matcher matcher = pattern.matcher(line);
		if (!matcher.find()) {
			throw new AssertionError("Line '" + line + "' does not match expected pattern");
		}

		Policy policy = new Policy(matcher.group(3).charAt(0), toInt(matcher.group(1)), toInt(matcher.group(2)));
		return new Line(policy, matcher.group(4));
	}

	private static final class Line {
		private final Policy policy;
		private final String pwd;

		private Line(Policy policy, String pwd) {
			this.policy = policy;
			this.pwd = pwd;
		}
	}

	private static final class Policy {
		private final char c;
		private final int min;
		private final int max;

		private Policy(char c, int min, int max) {
			this.c = c;
			this.min = min;
			this.max = max;
		}
	}
}
