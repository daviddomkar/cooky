-- Type used to pass recipe ingredients to the create_recipe procedure
CREATE OR REPLACE FUNCTION concat_array_agg(
    p_array1 anyarray,
    p_array2 anyarray
) RETURNS anyarray
AS $$
BEGIN
    RETURN array_agg(x) FROM
   (SELECT * FROM unnest(p_array1)
    UNION
    SELECT * FROM unnest(p_array2)
  ) a(x);
END
$$ LANGUAGE plpgsql;

CREATE TYPE recipe_ingredient_input AS (
    amount decimal,
    ingredient_id uuid,
    unit_id uuid,
    title varchar(32),
    unit_types unit_types[]
);
CREATE TYPE ingredient_info AS (
    ingredient_id uuid,
    unit_types unit_types[]
);

CREATE OR REPLACE PROCEDURE create_recipe (
    IN p_title recipes.title%TYPE,
    IN p_description recipes.description%TYPE,
    IN p_preparation_duration recipes.preparation_duration%TYPE,
    IN p_state recipes.state%TYPE,
    IN p_steps recipes.steps%TYPE,
    IN p_nutrition_per_serving recipes.nutrition_per_serving%TYPE,
    IN p_number_of_servings recipes.number_of_servings%TYPE,
    IN p_author_id recipes.author_id%TYPE,
    IN p_recipe_ingredients recipe_ingredient_input[],
    IN p_categories uuid[],
    IN p_image_key bytea,
    IN p_mime_type files.mime_type%TYPE,
    OUT o_id recipes.id%TYPE,
    OUT o_slug recipes.slug%TYPE,
    OUT o_created_at recipes.created_at%TYPE,
    OUT o_updated_at recipes.updated_at%TYPE,
    OUT o_image_id files.id%TYPE
)
AS $$
DECLARE
    v_slug recipes.slug%TYPE := create_recipe_slug(p_title, p_author_id);
    v_recipe_ingredient recipe_ingredient_input;
    v_category_id uuid;
    v_ingredient_updates ingredient_info[];
    v_existing_unit_types unit_types[];
BEGIN
    -- Populate the array of ingredient updates
    v_ingredient_updates := ARRAY(
        SELECT (i.id, coalesce(i.unit_types, ARRAY[]::unit_types[]))::ingredient_info
        FROM unnest(p_recipe_ingredients) AS r(amount, ingredient_id, unit_id, title, unit_types)
        JOIN ingredients i ON r.ingredient_id = i.id 
        ORDER BY i.id FOR UPDATE
    );

    -- Insert into files table
    INSERT INTO files (key, mime_type)
    VALUES (p_image_key, p_mime_type)
    RETURNING id INTO o_image_id;

    -- Insert into recipes table
    INSERT INTO recipes (title, slug, description, preparation_duration, state, steps, nutrition_per_serving, number_of_servings, image_id, author_id)
    VALUES (p_title, v_slug, p_description, p_preparation_duration, p_state, p_steps, p_nutrition_per_serving, p_number_of_servings, o_image_id, p_author_id)
    RETURNING id, slug, created_at, updated_at INTO o_id, o_slug, o_created_at, o_updated_at;

    -- Process each ingredient
    FOREACH v_recipe_ingredient IN ARRAY p_recipe_ingredients
    LOOP
        IF v_recipe_ingredient.ingredient_id IS NULL THEN
            INSERT INTO ingredients (title, unit_types)
            VALUES (v_recipe_ingredient.title, v_recipe_ingredient.unit_types)
            RETURNING id INTO v_recipe_ingredient.ingredient_id;
        ELSE
            -- Retrieve existing unit_types from v_ingredient_updates
            SELECT unit_types INTO v_existing_unit_types
            FROM unnest(v_ingredient_updates) AS info(id, unit_types)
            WHERE id = v_recipe_ingredient.ingredient_id;

            -- Check if update is necessary
            IF v_existing_unit_types IS DISTINCT FROM v_recipe_ingredient.unit_types THEN
                UPDATE ingredients
                SET unit_types = coalesce(v_recipe_ingredient.unit_types, ARRAY[]::unit_types[])
                WHERE id = v_recipe_ingredient.ingredient_id;
            END IF;
        END IF;

        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit_id)
        VALUES (o_id, v_recipe_ingredient.ingredient_id, v_recipe_ingredient.amount, v_recipe_ingredient.unit_id);
    END LOOP;

    -- Insert categories associated with the recipe
    FOREACH v_category_id IN ARRAY p_categories
    LOOP
        INSERT INTO recipe_categories (recipe_id, category_id)
        VALUES (o_id, v_category_id);
    END LOOP;

END;
$$ LANGUAGE plpgsql;
