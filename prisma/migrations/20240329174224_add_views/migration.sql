-- Create views
CREATE OR REPLACE VIEW recipes_by_ratings AS
SELECT recipes.*, users.username as author_username, users.name as author_name, users.profile_image_id as author_profile_image_id, coalesce(avg(number_of_stars), 0) as average_stars
FROM recipes
JOIN users ON recipes.author_id = users.id
LEFT JOIN ratings ON recipes.id = ratings.recipe_id
GROUP BY recipes.id, users.username, users.name, users.profile_image_id
ORDER BY average_stars
DESC;

CREATE OR REPLACE VIEW recipes_by_comments AS
SELECT recipes.*, users.username as author_username, users.name as author_name, users.profile_image_id as author_profile_image_id, count(comments.id) as comment_count
FROM recipes
LEFT JOIN users ON recipes.author_id = users.id
LEFT JOIN comments ON recipes.id = comments.recipe_id
GROUP BY recipes.id, users.username, users.name, users.profile_image_id
ORDER BY comment_count DESC;

CREATE OR REPLACE VIEW recipes_by_saves AS
SELECT recipes.*, users.username as author_username, users.name as author_name, users.profile_image_id as author_profile_image_id, count(recipe_lists.recipe_id) as save_count
FROM recipes
JOIN users ON recipes.author_id = users.id
LEFT JOIN recipe_lists ON recipes.id = recipe_lists.recipe_id
GROUP BY recipes.id, users.username, users.name, users.profile_image_id
ORDER BY save_count DESC;

CREATE OR REPLACE VIEW recipes_by_created_at AS
SELECT recipes.*, users.username as author_username, users.name as author_name, users.profile_image_id as author_profile_image_id
FROM recipes
JOIN users ON recipes.author_id = users.id
ORDER BY created_at DESC;

-- Random recipe
CREATE OR REPLACE VIEW random_recipe AS
SELECT recipes.*, users.username as author_username, users.name as author_name, users.profile_image_id as author_profile_image_id
FROM recipes
JOIN users ON recipes.author_id = users.id
ORDER BY random()
LIMIT 1;

-- Create function to get random recipe in category
CREATE OR REPLACE FUNCTION find_random_recipe_in_category(
    IN p_category_id categories.id%TYPE
)
RETURNS SETOF recipes
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY SELECT recipes.*, users.username as author_username, users.name as author_name, users.profile_image_id as author_profile_image_id
    FROM recipes
    JOIN users ON recipes.author_id = users.id
    JOIN recipe_categories ON recipes.id = recipe_categories.recipe_id
    JOIN categories ON recipe_categories.category_id = categories.id
    WHERE categories.id = p_category_id
    ORDER BY random()
    LIMIT 1;
END;
$$;
