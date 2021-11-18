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
import java.util.stream.Collectors;
import java.util.stream.Stream;

class Day02 {
	private Day02() {
	}

	static long part01(String file) {
		List<String> lines = AocUtils.readLines("/day02/" + file);

		long sum = 0;

		for (String line : lines) {
			Box box = parseBox(line);
			sum += box.area() + box.smallestSideArea();
		}

		return sum;
	}

	static long part02(String file) {
		List<String> lines = AocUtils.readLines("/day02/" + file);

		long sum = 0;

		for (String line : lines) {
			Box box = parseBox(line);
			sum += box.volume() + box.smallestSidePerimeter();
		}

		return sum;
	}

	private static Box parseBox(String input) {
		String[] dimensions = input.split("x", 3);
		if (dimensions.length != 3) {
			throw new RuntimeException("Invalid dimensions: " + input);
		}

		long length = AocUtils.toLong(dimensions[0]);
		long width = AocUtils.toLong(dimensions[1]);
		long height = AocUtils.toLong(dimensions[2]);
		return new Box(length, width, height);
	}

	private record Box(long length, long width, long height) {
		long area() {
			return (2 * length * width) + (2 * width * height) + (2 * height * length);
		}

		long smallestSideArea() {
			List<Long> sizes = sizes();
			return sizes.get(0) * sizes.get(1);
		}

		long smallestSidePerimeter() {
			List<Long> sizes = sizes();
			return sizes.get(0) * 2 + sizes.get(1) * 2;
		}

		long volume() {
			return length * width * height;
		}

		private List<Long> sizes() {
			return Stream.of(length, width, height).sorted().collect(Collectors.toList());
		}
	}
}
