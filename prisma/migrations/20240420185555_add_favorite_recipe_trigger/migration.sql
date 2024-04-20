create or replace function add_favorite_recipe() returns trigger as $$
DECLARE
    v_favorites_list_id uuid;
begin
    select favorites_list_id from users where id = new.author_id into v_favorites_list_id;

    PERFORM 1 FROM recipe_lists WHERE list_id = v_favorites_list_id and recipe_id = new.recipe_id limit 1;

    IF NOT FOUND THEN
        insert into recipe_lists (list_id, recipe_id)
        values (v_favorites_list_id, new.recipe_id);
    END IF;

    return new;
end;
$$ LANGUAGE plpgsql;

-- Add trigger which adds a recipe to the user's favorite list if the rating is 4 or higher
create or replace trigger favorite_recipe_trigger
after insert on ratings
for each row
when (new.number_of_stars >= 4)
execute function add_favorite_recipe();
