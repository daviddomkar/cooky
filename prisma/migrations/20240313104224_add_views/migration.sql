-- Create views

CREATE OR REPLACE VIEW recipes_sorted_by_ratings AS
SELECT recipes.*, coalesce(avg(number_of_stars), 0) as average_stars
FROM recipes
    LEFT JOIN ratings ON recipes.id = ratings.recipe_id
GROUP BY recipes.id
ORDER BY average_stars
DESC;

CREATE OR REPLACE VIEW recipes_sorted_by_comments AS
SELECT recipes.*, count(comments.id) as comment_count
FROM comments
JOIN recipes ON comments.recipe_id = recipes.id
GROUP BY recipes.id
ORDER BY comment_count DESC;

CREATE OR REPLACE VIEW recipes_sorted_by_saves AS
SELECT recipes.*, coalesce(count(recipes.id), 0) as save_count
FROM recipes
LEFT JOIN recipe_lists ON recipes.id = recipe_lists.recipe_id
GROUP BY recipes.id
ORDER BY save_count DESC;

CREATE OR REPLACE VIEW recipes_sorted_by_creation_date AS
SELECT *
FROM recipes
ORDER BY created_at DESC;

-- Random recipe
CREATE OR REPLACE VIEW random_recipe AS
SELECT *
FROM recipes
ORDER BY RANDOM()
LIMIT 1;

-- Function for getting random recipe from cetegory
CREATE OR REPLACE FUNCTION get_random_recipe_from_category(p_category_id categories.id%TYPE)
RETURNS SETOF recipes AS $$
BEGIN
  RETURN QUERY SELECT recipes.*
  FROM recipes
  JOIN recipe_categories ON recipes.id = recipe_categories.recipe_id
  JOIN categories ON recipe_categories.category_id = categories.id
  WHERE categories.id = p_category_id
  ORDER BY RANDOM()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
