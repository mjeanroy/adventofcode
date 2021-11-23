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
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.LongStream;

final class Day09 {
	private Day09() {
	}

	static long part01(String fileName) {
		return run(fileName).min().orElseThrow(() -> new RuntimeException("No routes to compute"));
	}

	static long part02(String fileName) {
		return run(fileName).max().orElseThrow(() -> new RuntimeException("No routes to compute"));
	}

	static LongStream run(String fileName) {
		List<String> lines = AocUtils.readLines("/day09/" + fileName);
		Routes routes = new Routes();
		for (String line : lines) {
			Route route = parseRoute(line);
			routes.addRoute(route.from, route.to, route.distance);
		}

		List<List<String>> permutations = permutations(routes.cities());
		return permutations.stream().mapToLong(routes::distance);
	}

	// Heap Algorithm
	// https://www.geeksforgeeks.org/heaps-algorithm-for-generating-permutations/
	private static List<List<String>> permutations(Collection<String> inputs) {
		List<List<String>> permutations = new ArrayList<>();
		_permutations(new ArrayList<>(inputs), inputs.size(), permutations);
		return permutations;
	}

	// Heap Algorithm
	// https://www.geeksforgeeks.org/heaps-algorithm-for-generating-permutations/
	private static void _permutations(List<String> inputs, int size, List<List<String>> permutations) {
		// if size becomes 1 then we get a permutation
		if (size == 1) {
			permutations.add(new ArrayList<>(inputs));
		}

		for (int i = 0; i < size; i++) {
			_permutations(inputs, size - 1, permutations);

			// if size is odd, swap 0th i.e (first) and
			// (size-1)th i.e (last) element
			if (size % 2 == 1) {
				swap(inputs, 0, size - 1);
			}

			// If size is even, swap ith
			// and (size-1)th i.e last element
			else {
				swap(inputs, size -1, i);
			}
		}
	}

	private static void swap(List<String> input, int i1, int i2) {
		String temp = input.get(i1);
		input.set(i1, input.get(i2));
		input.set(i2, temp);
	}

	private static Route parseRoute(String input) {
		Pattern p = Pattern.compile("(\\w+) to (\\w+) = (\\d+)");
		Matcher m = p.matcher(input);
		if (!m.matches()) {
			throw new RuntimeException("Cannot parse route: " + input);
		}

		String from = m.group(1);
		String to = m.group(2);
		int distance = AocUtils.toInt(m.group(3));
		return new Route(from, to, distance);
	}

	private record Route(String from, String to, int distance) {
	}

	private static final class Routes {
		private final Map<String, Map<String, Integer>> distances;

		Routes() {
			this.distances = new HashMap<>();
		}

		void addRoute(String city1, String city2, int distance) {
			addSingleRoute(city1, city2, distance);
			addSingleRoute(city2, city1, distance);
		}

		Set<String> cities() {
			return distances.keySet();
		}

		int distance(List<String> path) {
			if (path.size() <= 1) {
				return 0;
			}

			int distance = 0;
			Iterator<String> it = path.iterator();
			String previous = it.next();
			while (it.hasNext()) {
				String current = it.next();
				distance += distance(previous, current);
				previous = current;
			}

			return distance;
		}

		private int distance(String city1, String city2) {
			if (!distances.containsKey(city1) || !distances.get(city1).containsKey(city2)) {
				throw new RuntimeException("Cannot get distance between '" + city1 + "' and '" + city2 + "'");
			}

			return distances.get(city1).get(city2);
		}

		private void addSingleRoute(String city1, String city2, int distance) {
			if (!distances.containsKey(city1)) {
				distances.put(city1, new HashMap<>());
			}

			if (distances.get(city1).containsKey(city2)) {
				throw new RuntimeException("Cannot override distance between '" + city1 + "' to '" + city2 + "'");
			}

			distances.get(city1).put(city2, distance);
		}
	}
}
