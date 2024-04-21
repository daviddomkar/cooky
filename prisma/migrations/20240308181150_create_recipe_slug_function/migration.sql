-- Create function to generate a slug unique to the user
CREATE OR REPLACE FUNCTION create_recipe_slug (
    IN p_title recipes.title%TYPE,
    IN p_author_id recipes.author_id%TYPE,
    IN p_id recipes.id%TYPE default '00000000-0000-0000-0000-000000000000'::uuid
)
RETURNS recipes.slug%TYPE
LANGUAGE plpgsql
AS $$
DECLARE
    v_clean_slug recipes.slug%TYPE :=
        regexp_replace(
                regexp_replace(
                        regexp_replace(lower(unaccent(p_title)), '[^a-z0-9\\-_]+', '-', 'gi'),
                    '\\-+$', ''),
            '^\\-', '');
BEGIN
    PERFORM
    FROM recipes
    WHERE recipes.slug = v_clean_slug AND recipes.author_id = p_author_id AND recipes.id != p_id;

    IF FOUND THEN
        RAISE EXCEPTION 'Slug "%" already exists for user %', v_clean_slug, p_author_id;
    END IF;

    RETURN v_clean_slug;
END
$$ RETURNS NULL ON NULL INPUT;
