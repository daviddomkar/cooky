-- Type used to pass recipe ingredients to the create_recipe procedure
CREATE TYPE recipe_ingredient_input AS (
    amount integer,
    ingredient_id UUID,
    unit_id UUID
);

CREATE OR REPLACE PROCEDURE create_recipe (
    IN p_title recipes.title%TYPE,
    IN p_description recipes.description%TYPE,
    IN p_preparation_duration recipes.preparation_duration%TYPE,
    IN p_state recipes.state%TYPE,
    IN p_steps recipes.steps%TYPE,
    IN p_nutrition_per_serving recipes.nutrition_per_serving%TYPE,
    IN p_number_of_servings recipes.number_of_servings%TYPE,
    IN p_image_id recipes.image_id%TYPE,
    IN p_author_id recipes.author_id%TYPE,
    IN p_recipe_ingredients recipe_ingredient_input[],
    IN p_categories uuid[],
    OUT o_id recipes.id%TYPE,
    OUT o_slug recipes.slug%TYPE,
    OUT o_created_at recipes.created_at%TYPE,
    OUT o_updated_at recipes.updated_at%TYPE
)
AS $$
DECLARE
    v_slug recipes.slug%TYPE := create_recipe_slug(p_title, p_author_id);
    v_recipe_ingredient recipe_ingredient_input;
    v_category_id categories.id%TYPE;
BEGIN
    INSERT INTO recipes (title, slug, description, preparation_duration, state, steps, nutrition_per_serving, number_of_servings, image_id, author_id)
    VALUES (p_title, v_slug, p_description, p_preparation_duration, p_state, p_steps, p_nutrition_per_serving, p_number_of_servings, p_image_id, p_author_id)
    RETURNING id, slug, created_at, updated_at
    INTO o_id, o_slug, o_created_at, o_updated_at;

    FOREACH v_recipe_ingredient IN ARRAY p_recipe_ingredients
    LOOP
        PERFORM
        FROM ingredients
        WHERE id = v_recipe_ingredient.ingredient_id
        AND (SELECT type FROM units WHERE id = v_recipe_ingredient.unit_id) = ANY (ingredients.unit_types);

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Ingredient with id % not found or unit type is not compatible', v_recipe_ingredient.ingredient_id;
        END IF;

        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit_id)
        VALUES (o_id, v_recipe_ingredient.ingredient_id, v_recipe_ingredient.amount, v_recipe_ingredient.unit_id);
    END LOOP;

    FOREACH v_category_id IN ARRAY p_categories
    LOOP
        INSERT INTO recipe_categories (recipe_id, category_id)
        VALUES (o_id, v_category_id);
    END LOOP;
END
$$ LANGUAGE plpgsql;
