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

import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

final class AocUtils {
	private AocUtils() {
	}

	static String readFile(String file) {
		URL url = AocUtils.class.getResource(file);
		if (url == null) {
			throw new RuntimeException("File not found: " + file);
		}

		try {
			Path path = Path.of(url.toURI());
			return Files.readString(path).trim();
		} catch (Exception ex) {
			throw new RuntimeException(ex);
		}
	}

	static List<String> readLines(String file) {
		return Arrays.stream(readFile(file).split("\n")).collect(Collectors.toList());
	}

	static long toLong(String input) {
		return Long.parseLong(input.trim());
	}

	static int toInt(String input) {
		return Integer.parseInt(input.trim());
	}

	static <T> T lastElement(List<T> elements) {
		if (elements.isEmpty()) {
			throw new RuntimeException("Cannot get last element of empty list");
		}

		return elements.get(elements.size() - 1);
	}
}
