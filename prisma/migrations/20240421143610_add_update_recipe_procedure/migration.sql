create or replace procedure update_recipe (
    in p_id recipes.id%type,
    in p_title recipes.title%type,
    in p_description recipes.description%type,
    in p_preparation_duration recipes.preparation_duration%type,
    in p_state recipes.state%type,
    in p_steps recipes.steps%type,
    in p_nutrition_per_serving recipes.nutrition_per_serving%type,
    in p_number_of_servings recipes.number_of_servings%type,
    in p_author_id recipes.author_id%type,
    in p_recipe_ingredients recipe_ingredient_input[],
    in p_categories uuid[],
    in p_image_key files.key%type,
    in p_mime_type files.mime_type%type,
    out o_image_id recipes.id%type,
    out o_slug recipes.slug%type,
    out o_created_at recipes.created_at%type,
    out o_updated_at recipes.updated_at%type
) as $$
    declare
        v_slug recipes.slug%type := create_recipe_slug(p_title, p_author_id, p_id);
        v_recipe_ingredient recipe_ingredient_input;
        v_category_id uuid;
        v_ingredient_updates ingredient_info[];
        v_existing_unit_types unit_types[];
        v_old_img_id files.id%type;
    begin
        -- Populate the array of ingredient updates
        v_ingredient_updates := ARRAY(
            SELECT (i.id, coalesce(i.unit_types, ARRAY[]::unit_types[]))::ingredient_info
            FROM unnest(p_recipe_ingredients) AS r(amount, ingredient_id, unit_id, title, unit_types)
            JOIN ingredients i ON r.ingredient_id = i.id
            ORDER BY i.id FOR UPDATE
        );

        -- Retrieve old image id
        select image_id into v_old_img_id from recipes where id = p_id;

        -- insert new image
        insert into files (key, mime_type)
        values (p_image_key, p_mime_type)
        returning id into o_image_id;

        -- update recipe
        update recipes
        set title = p_title,
            slug = v_slug,
            description = p_description,
            preparation_duration = p_preparation_duration,
            state = p_state,
            steps = p_steps,
            nutrition_per_serving = p_nutrition_per_serving,
            number_of_servings = p_number_of_servings,
            image_id = o_image_id,
            author_id = p_author_id
        where id = p_id
        returning slug, created_at, updated_at
        into o_slug, o_created_at, o_updated_at;

    -- Remove old recipe_ingredients
    DELETE FROM recipe_ingredients WHERE recipe_id = p_id;

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
                    SET unit_types = concat_array_agg(v_existing_unit_types, coalesce(v_recipe_ingredient.unit_types, ARRAY[]::unit_types[]))
                    WHERE id = v_recipe_ingredient.ingredient_id;
                END IF;
            END IF;

            INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit_id)
            VALUES (p_id, v_recipe_ingredient.ingredient_id, v_recipe_ingredient.amount, v_recipe_ingredient.unit_id);
        END LOOP;

        -- remove old image
        delete from files where id = v_old_img_id;

        -- remove old categories
        delete from recipe_categories where recipe_id = p_id;

        -- Insert categories associated with the recipe
        FOREACH v_category_id IN ARRAY p_categories
        LOOP
            INSERT INTO recipe_categories (recipe_id, category_id)
            VALUES (p_id, v_category_id);
        END LOOP;
    end;
$$ LANGUAGE plpgsql;
