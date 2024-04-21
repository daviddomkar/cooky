CREATE OR REPLACE FUNCTION add_favorite_recipe() RETURNS TRIGGER AS $$
DECLARE
    v_favorites_list_id uuid;
BEGIN
    SELECT favorites_list_id FROM users WHERE id = new.author_id INTO v_favorites_list_id;

    PERFORM 1 FROM recipe_lists WHERE list_id = v_favorites_list_id AND recipe_id = new.recipe_id LIMIT 1;

    IF NOT FOUND THEN
        INSERT INTO recipe_lists (list_id, recipe_id)
        VALUES (v_favorites_list_id, new.recipe_id);
    END IF;

    RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Add trigger which adds a recipe to the user's favorite list if the rating is 4 or higher
CREATE OR REPLACE TRIGGER favorite_recipe_trigger
AFTER INSERT OR UPDATE ON ratings
FOR EACH ROW
WHEN (new.number_of_stars >= 4)
EXECUTE FUNCTION add_favorite_recipe();
