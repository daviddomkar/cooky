import { getServerSession } from "#auth";
import { string, objectAsync, toTrimmed, minLength, uuid } from "valibot";
import { useValidatedParams } from "h3-valibot";
import { RecipeState } from "@prisma/client";
import { authOptions } from "../../../../../auth/[...]";

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

  // If the recipe doesn't exist, we can't delete comment on it.
  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recipe not found.",
    });
  }

  // Only published recipes can have comments deleted on.
  if (recipe.state === RecipeState.DRAFT) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden.",
    });
  }

  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
  });

  // If the comment doesn't exist, we can't delete it.
  if (!comment) {
    throw createError({
      statusCode: 404,
      statusMessage: "Comment not found.",
    });
  }

  // User cannot delete a comment they didn't create.
  if (comment.authorId !== session.user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden.",
    });
  }

  // Delete the comment.
  await prisma.comment.delete({
    where: {
      id,
    },
  });
});
