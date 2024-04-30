import { getServerSession } from "#auth";
import { string, objectAsync, toTrimmed, minLength } from "valibot";
import { useValidatedParams, useValidatedBody } from "h3-valibot";
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
  const { content } = await useValidatedBody(event, CommentSchema);

  const recipe = await prisma.recipe.findByUsernameAndSlug(username, slug);

  // If the recipe doesn't exist, we can't comment on it.
  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recipe not found.",
    });
  }

  // Only published recipes can be commented on.
  if (recipe.state === RecipeState.DRAFT) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden.",
    });
  }

  await prisma.comment.create({
    data: {
      recipe: {
        connect: {
          id: recipe.id,
        },
      },
      author: {
        connect: {
          id: session.user.id,
        },
      },
      content,
    },
  });
});
