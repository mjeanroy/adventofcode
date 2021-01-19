package com.github.mjeanroy.aoc.year2020;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class Day04Test {

	@Test
	void part1_test() {
		assertThat(Day04.part1("sample.txt")).isEqualTo(2);
		assertThat(Day04.part1("input.txt")).isEqualTo(192);
	}

	@Test
	void part2_test() {
		assertThat(Day04.part2("sample.txt")).isEqualTo(2);
		assertThat(Day04.part2("input.txt")).isEqualTo(101);
	}
}
