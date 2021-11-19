package com.github.mjeanroy.aoc2015;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class Day04Test {

	@Nested
	class Part01 {
		@Test
		void it_should_compute_sample() {
			assertThat(Day04.part01("abcdef")).isEqualTo(609043L);
			assertThat(Day04.part01("pqrstuv")).isEqualTo(1048970L);
		}

		@Test
		void it_should_compute_input() {
			assertThat(Day04.part01("yzbqklnj")).isEqualTo(282749L);
		}
	}
}
