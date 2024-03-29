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

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class Day07Test {

	@Nested
	class Part01 {
		@Test
		void it_should_compute_sample() {
			assertThat(Day07.part01("sample.txt", "d")).isEqualTo(72L);
			assertThat(Day07.part01("sample.txt", "e")).isEqualTo(507L);
			assertThat(Day07.part01("sample.txt", "f")).isEqualTo(492L);
			assertThat(Day07.part01("sample.txt", "g")).isEqualTo(114L);
			assertThat(Day07.part01("sample.txt", "h")).isEqualTo(65412L);
			assertThat(Day07.part01("sample.txt", "i")).isEqualTo(65079L);
			assertThat(Day07.part01("sample.txt", "x")).isEqualTo(123L);
			assertThat(Day07.part01("sample.txt", "y")).isEqualTo(456L);
		}

		@Test
		void it_should_compute_input() {
			assertThat(Day07.part01("input.txt", "a")).isEqualTo(956L);
		}
	}

	@Nested
	class Part02 {
		@Test
		void it_should_compute_input() {
			assertThat(Day07.part02("input.txt")).isEqualTo(40149L);
		}
	}
}
