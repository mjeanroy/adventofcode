package com.github.mjeanroy.aoc.year2020;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static java.util.Collections.unmodifiableList;

final class Day04 extends AbstractDay {

	static long part1(String file) {
		List<String> paragraphs = readParagraphs("day04", file);
		return countValid(paragraphs, Day04::isValid);
	}

	static long part2(String file) {
		List<String> paragraphs = readParagraphs("day04", file);
		return countValid(paragraphs, passport -> isValid(passport) && check(passport));
	}

	private static long countValid(List<String> rawPassports, Predicate<Passport> predicate) {
		long count = 0;

		for (String rawPassport : rawPassports) {
			Passport passport = parse(rawPassport);
			if (predicate.test(passport)) {
				count++;
			}
		}

		return count;
	}

	private static Passport parse(String rawPassport) {
		String[] lines = rawPassport.split("\n");
		Passport passport = new Passport();

		for (String line : lines) {
			String[] parts = line.split(" ");
			for (String part : parts) {
				String[] pair = part.split(":", 2);
				String label = pair[0].trim();
				String value = pair[1].trim();
				passport.add(Field.find(label), value);
			}
		}

		return passport;
	}

	private static boolean isValid(Passport passport) {
		Set<Field> passportFields = new HashSet<>(passport.fields());
		passportFields.removeAll(Field.optionalFields);
		return passportFields.size() == Field.requiredFields.size();
	}

	private static boolean check(Passport passport) {
		for (Map.Entry<Field, String> entry : passport.fields.entrySet()) {
			if (!entry.getKey().check(entry.getValue())) {
				return false;
			}
		}

		return true;
	}

	private static final class Passport {
		private final Map<Field, String> fields;

		private Passport() {
			this.fields = new HashMap<>();
		}

		private void add(Field field, String value) {
			this.fields.put(field, value);
		}

		private Set<Field> fields() {
			return this.fields.keySet();
		}
	}

	private enum Field {
		BYR(true) {
			@Override
			boolean check(String input) {
				return isYear(input, 1920, 2002);
			}
		},

		IYR(true) {
			@Override
			boolean check(String input) {
				return isYear(input, 2010, 2020);
			}
		},

		EYR(true) {
			@Override
			boolean check(String input) {
				return isYear(input, 2020, 2030);
			}
		},

		HGT(true) {
			@Override
			boolean check(String input) {
				Pattern pattern = Pattern.compile("^(\\d+)(cm|in)$");
				Matcher matcher = pattern.matcher(input);
				if (!matcher.find()) {
					return false;
				}

				int nb = toInt(matcher.group(1));
				String unit = matcher.group(2);
				return unit.equals("cm") ? isBetween(nb, 150, 193) : isBetween(nb, 59, 76);
			}
		},

		HCL(true) {
			@Override
			boolean check(String input) {
				Pattern pattern = Pattern.compile("^#([a-f0-9]{6})$");
				return pattern.matcher(input).find();
			}
		},

		ECL(true) {
			@Override
			boolean check(String input) {
				Set<String> whitelist = Set.of(
						"amb",
						"blu",
						"brn",
						"gry",
						"grn",
						"hzl",
						"oth"
				);

				return whitelist.contains(input);
			}
		},

		PID(true) {
			@Override
			boolean check(String input) {
				Pattern pattern = Pattern.compile("(^[0-9]{9})$");
				return pattern.matcher(input).find();
			}
		},

		CID(false) {
			@Override
			boolean check(String input) {
				return true;
			}
		};

		private final boolean required;

		Field(boolean required) {
			this.required = required;
		}

		abstract boolean check(String input);

		private static final List<Field> requiredFields = findBy(field -> field.required);
		private static final List<Field> optionalFields = findBy(field -> !field.required);

		private static Field find(String label) {
			return Field.valueOf(label.toUpperCase());
		}

		private static List<Field> findBy(Predicate<Field> predicate) {
			List<Field> fields = new ArrayList<>(Field.values().length);

			for (Field field : Field.values()) {
				if (predicate.test(field)) {
					fields.add(field);
				}
			}

			return unmodifiableList(fields);
		}

		private static boolean isYear(String input, int min, int max) {
			if (input.length() != 4) {
				return false;
			}

			return isBetween(toInt(input), min, max);
		}

		private static boolean isBetween(int value, int min, int max) {
			return value >= min && value <= max;
		}
	}
}
