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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

final class Day07 {

	static long part01(String fileName, String wire) {
		List<String> lines = AocUtils.readLines("/day07/" + fileName);

		Wires wires = new Wires();
		for (String line : lines) {
			String[] parts = line.split(" -> ", 2);
			if (parts.length != 2) {
				throw new RuntimeException("Cannot parse instruction: " + line);
			}

			String output = parts[1].trim();
			String rawInstruction = parts[0].trim();
			wires.addInstruction(rawInstruction, output);
		}

		int result = wires.computeWire(wire);

		// If result is negative, translate it to an unsigned 16bit value ([0, 65535])
		// It means that -1 should be translated to 65537 (65535 (max) -> 65536 (zero) -> 65537 (-1)).

		if (result < 0) {
			return 65535 + result + 1;
		}

		if (result > 65535) {
			return 65535 - result + 1;
		}

		return result;
	}

	private static class Wires {
		private final Map<String, String> instructions;
		private final Map<String, Integer> cache;

		private Wires() {
			this.instructions = new HashMap<>();
			this.cache = new HashMap<>();
		}

		void addInstruction(String instruction, String output) {
			if (instructions.containsKey(output)) {
				throw new RuntimeException("Cannot override instruction of wire: " + output);
			}

			instructions.put(output, instruction);
		}

		int computeWire(String wire) {
			if (cache.containsKey(wire)) {
				return cache.get(wire);
			}

			// Check if we know how to compute given wire.
			if (!instructions.containsKey(wire)) {
				throw new RuntimeException("Cannot find instruction for wire: " + wire);
			}

			// Compute given instruction, may need to compute other wire recursively.
			int result = computeInstruction(
				instructions.get(wire)
			);

			cache.put(wire, result);
			return result;
		}

		private int computeInstruction(String instruction) {
			// Check for "direct value" instruction.
			Pattern p = Pattern.compile("([a-z\\d]+)");
			Matcher m = p.matcher(instruction);
			if (m.matches()) {
				return computeParameter(m.group(1));
			}

			// Check for "NOT" operation
			p = Pattern.compile("NOT ([a-z\\d]+)");
			m = p.matcher(instruction);
			if (m.matches()) {
				return ~computeParameter(m.group(1));
			}

			// Check for AND / OR / LSHIFT / RSHIFT operations.
			p = Pattern.compile("([a-z\\d+]+) (AND|OR|LSHIFT|RSHIFT) ([a-z\\d+]+)");
			m = p.matcher(instruction);
			if (m.matches()) {
				int x = computeParameter(m.group(1));
				int y = computeParameter(m.group(3));
				return switch (m.group(2)) {
					case "AND" -> x & y;
					case "OR" -> x | y;
					case "LSHIFT" -> x << y;
					case "RSHIFT" -> x >> y;
					default -> throw new RuntimeException("Cannot parse instruction: " + instruction);
				};
			}

			// Nothing match...
			throw new RuntimeException("Cannot parse instructon: " + instruction);
		}

		private int computeParameter(String input) {
			if (input.matches("\\d+")) {
				return AocUtils.toInt(input);
			}

			// Compute recursively
			return computeWire(input);
		}
	}
}
