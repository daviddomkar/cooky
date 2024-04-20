import { getServerSession } from "#auth";
import { string, objectAsync, toTrimmed, minLength } from "valibot";
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
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized.",
    });
  }

  const { username, slug } = await useValidatedParams(event, ParametersSchema);

  const recipe = await prisma.recipe.findByUsernameAndSlug(username, slug);

  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recipe not found.",
    });
  }

  if (recipe.state === RecipeState.DRAFT) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden.",
    });
  }

  return prisma.list.findMany({
    where: {
      authorId: session.user.id,
      recipes: {
        some: {
          recipeId: recipe.id,
        },
      },
    },
    select: {
      id: true,
      title: true,
    },
  });
});
