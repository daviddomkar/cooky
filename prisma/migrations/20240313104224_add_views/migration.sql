-- Create views

CREATE OR REPLACE  VIEW recipes_sorted_by_ratings AS
SELECT avg(number_of_stars), recipe_id
FROM ratings
    NATURAL JOIN recipes
GROUP BY recipe_id
ORDER BY avg(number_of_stars)
DESC;

CREATE OR REPLACE  VIEW recipes_sorted_by_comments AS
SELECT recipes.*, COUNT(comments.id) as comment_count
FROM recipes
LEFT JOIN comments ON comments.recipe_id = recipes.id
GROUP BY recipes.id
ORDER BY comment_count DESC;

CREATE OR REPLACE VIEW recipes_sorted_by_saves AS
SELECT r.id, r.title, COUNT(rl.recipe_id) AS save_count
FROM recipes r
LEFT JOIN recipe_lists rl ON r.id = rl.recipe_id
GROUP BY r.id
ORDER BY save_count DESC;

CREATE OR REPLACE VIEW  recipes_sorted_by_creation_date AS
SELECT *
FROM recipes
ORDER BY created_at DESC;

-- Random recipe
CREATE OR REPLACE VIEW random_recipe AS
SELECT r.id, r.title
FROM recipes r
ORDER BY RANDOM()
LIMIT 1;

-- Function for getting random recipe from cetegory
CREATE OR REPLACE FUNCTION get_random_recipe_from_category(category_name_arg VARCHAR)
RETURNS TABLE(recipe_id UUID, recipe_title VARCHAR) AS $$
BEGIN
  RETURN QUERY SELECT r.id, r.title
  FROM recipes r
  JOIN recipe_categories rc ON r.id = rc.recipe_id
  JOIN categories c ON rc.category_id = c.id
  WHERE c.title = category_name_arg
  ORDER BY RANDOM()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;