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

const {readLines} = require('../00/index');

/**
 * Compute the number of times ingredients that cannot possibly contains any
 * allergen appear in the input.
 *
 * @param {string} file File input.
 * @returns {Promise<number>} A promise resolved with the number of times ingredients that cannot possibly contains any allergen appears.
 */
function part1(file) {
  return readLines(file).then((lines) => {
    const recipes = lines.map((line) => parseFood(line));
    const allergens = groupIngredientsByAllergens(recipes);
    const ingredients = extractIngredients(allergens);
    return countIngredientsWithoutAllergens(recipes, ingredients);
  });
}

/**
 * Compute the canonical dangerous ingredient list from given input.
 *
 * @param {string} file The file.
 * @returns {Promise<string>} The canonical ingredient list.
 */
function part2(file) {
  return readLines(file).then((lines) => {
    const recipes = lines.map((line) => parseFood(line));
    const allergens = groupIngredientsByAllergens(recipes);
    const map = identityIngredients(allergens);
    return computeCanonicalDangerousIngredientList(map);
  });
}

/**
 * Compute the canonical dangerous ingredient list:
 *
 * - Ingredients are sorted alphabetically by their allergen.
 * - Joined into a string, separated by commas.
 *
 * @param {Map<string, string>} map The map of dangerous ingredients by their allergens.
 * @returns {string} The  canonical dangerous ingredient list.
 */
function computeCanonicalDangerousIngredientList(map) {
  const allergens = [...map.keys()];

  // Sort keys in alphabetical order.
  allergens.sort((x, y) => x.localeCompare(y));

  // Compute the final list.
  const ingredients = [];

  for (const allergen of allergens) {
    ingredients.push(map.get(allergen));
  }

  return ingredients.join(',');
}

/**
 * Count the totol number of times ingredients without allergens appears in the list of recipes, counting
 * duplications.
 *
 * @param {Array<Object>} recipes The list of recipes.
 * @param {Set<string>} ingredients The ingredients.
 * @returns {number} The total.
 */
function countIngredientsWithoutAllergens(recipes, ingredients) {
  let total = 0;

  for (const recipe of recipes) {
    let count = recipe.ingredients.size;

    for (const ingredient of ingredients) {
      if (recipe.ingredients.has(ingredient)) {
        count--;
      }
    }

    total += count;
  }

  return total;
}

/**
 * Identity, for each allergen, the ingredient.
 *
 * @param {Map<string, Set<string>>} allergens The group of ingredients by allergens.
 * @returns {Map<string, string>} The map of allergen -> ingredient.
 */
function identityIngredients(allergens) {
  const results = new Map();

  while (allergens.size > 0) {
    const justFoundIngredients = new Set();

    for (const entry of allergens.entries()) {
      if (entry[1].size === 1) {
        const ingredient = entry[1].values().next().value;
        const allergen = entry[0];

        // Found new mapping
        results.set(allergen, ingredient);

        // Keep in mind what we just found, we will use it next.
        justFoundIngredients.add(ingredient);

        // Remove it to not found it again and again.
        allergens.delete(allergen);
      }
    }

    if (justFoundIngredients.size === 0) {
      throw new Error('Cannot identify ingredients, it looks like an infinite loop');
    }

    // Remove what we found previously.
    for (const entry of allergens.entries()) {
      for (const ingredient of justFoundIngredients) {
        entry[1].delete(ingredient);
      }
    }
  }

  return results;
}

/**
 * Extract the list of ingredients that contains allergens.
 *
 * @param {Map<string, Set<string>>} allergens The group of ingredients by allergens.
 * @returns {Set<string>} The list of ingredients.
 */
function extractIngredients(allergens) {
  const ingredients = new Set();

  for (const value of allergens.values()) {
    union(ingredients, value);
  }

  return ingredients;
}

/**
 * Group all ingredients by possible allergen they may contains.
 *
 * Foe example, suppose the following:
 *
 * ```
 * mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
 * trh fvjkl sbzzf mxmxvkd (contains dairy)
 * sqjhc fvjkl (contains soy)
 * sqjhc mxmxvkd sbzzf (contains fish)
 * ```
 *
 * This function will returns a map such as:
 *
 * ```
 * 'dairy' => Set(['mxmxvkd']) => Intersection of ['mxmxvkd', 'kfcds', 'sqjhc', 'nhms'] and ['trh', 'fvjkl', 'sbzzf', 'mxmxvkd']
 * 'fish' => Set(['mxmxvkd', 'sqjhc']) => Intersection of ['mxmxvkd', 'kfcds', 'sqjhc', 'nhms'] and ['sqjhc', 'mxmxvkd', 'sbzzf']
 * 'soy' => Set(['sqjhc', 'fvjkl'])
 * ```
 *
 * @param {Array<Object>} recipes The list of recipes.
 * @returns {Map<string, Set<string>>} The groups.
 */
function groupIngredientsByAllergens(recipes) {
  const allergens = new Map();

  for (const recipe of recipes) {
    for (const allergen of recipe.allergens) {
      if (!allergens.has(allergen)) {
        allergens.set(allergen, new Set(recipe.ingredients));
      } else {
        allergens.set(allergen, intersect(allergens.get(allergen), recipe.ingredients));
      }
    }
  }
  return allergens;
}

/**
 * Make the intersection of these two sets.
 *
 * @param {Set<*>} set1 First set.
 * @param {Set<*>} set2 Second set.
 * @returns {Set<*>} The intersection.
 */
function intersect(set1, set2) {
  for (const x of set1) {
    if (!set2.has(x)) {
      set1.delete(x);
    }
  }

  return set1;
}

/**
 * Make the union of these two sets.
 *
 * @param {Set<*>} set1 First set.
 * @param {Set<*>} set2 Second set.
 * @returns {Set<*>} The union.
 */
function union(set1, set2) {
  for (const x of set2) {
    set1.add(x);
  }

  return set1;
}

/**
 * Parse food line.
 *
 * For example, following line: `mxmxvkd kfcds sqjhc nhms (contains dairy, fish)`
 * Will returns an object, such as:
 *
 * ```
 * {
 *   ingredients: Set([
 *     'mxmxvkd',
 *     'kfcds',
 *     'sqjhc',
 *     'nhms',
 *   ]),
 *   allergens: Set([
 *     'dairy',
 *     'fish',
 *   ]),
 * }
 * ```
 *
 * @param {string} food The line.
 * @returns {Object} The food.
 */
function parseFood(food) {
  const parts = food.split('(contains', 2);
  const ingredients = parts[0].trim();
  const allergens = parts.length === 2 ? parts[1].trim().slice(0, -1) : '';
  return {
    ingredients: new Set(ingredients.split(' ')),
    allergens: new Set(allergens.split(', ')),
  };
}

module.exports = {
  part1,
  part2,
};
