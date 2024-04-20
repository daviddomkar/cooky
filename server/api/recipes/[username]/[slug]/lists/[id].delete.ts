import { getServerSession } from "#auth";
import { string, objectAsync, toTrimmed, minLength, uuid } from "valibot";
import { useValidatedParams } from "h3-valibot";
import { RecipeState } from "@prisma/client";
import { authOptions } from "../../../../auth/[...]";

const ParametersSchema = objectAsync({
  username: string("username parameter is required.", [
    toTrimmed(),
    minLength(1, "username parameter is required."),
  ]),
  slug: string("slug parameter is required.", [
    toTrimmed(),
    minLength(1, "slug parameter is required."),
  ]),
  id: string("id parameter is required.", [
    toTrimmed(),
    uuid("id parameter is must be a valid UUID."),
  ]),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized.",
    });
  }

  const { username, slug, id } = await useValidatedParams(
    event,
    ParametersSchema,
  );

  const recipe = await prisma.recipe.findByUsernameAndSlug(username, slug);

  // If the recipe doesn't exist, we can't remove it from a list.
  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recipe not found.",
    });
  }

  // Only published recipes can be removed from lists.
  if (recipe.state === RecipeState.DRAFT) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden.",
    });
  }

  const list = await prisma.list.findUnique({
    where: {
      id,
    },
    include: {
      recipes: {
        where: {
          recipeId: recipe.id,
        },
      },
    },
  });

  // If the list doesn't exist, we can't remove the recipe from it.
  if (!list) {
    throw createError({
      statusCode: 404,
      statusMessage: "List not found.",
    });
  }

  // Only the author of the list can remove recipes from it.
  if (list.authorId !== session.user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden.",
    });
  }

  // If the recipe is not in the list, we can't remove it.
  if (list.recipes.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recipe not found in list.",
    });
  }

  await prisma.recipeList.delete({
    where: {
      id: {
        listId: list.id,
        recipeId: recipe.id,
      },
    },
  });
});
