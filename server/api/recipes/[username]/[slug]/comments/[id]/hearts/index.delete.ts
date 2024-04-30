import { getServerSession } from "#auth";
import { string, objectAsync, toTrimmed, minLength, uuid } from "valibot";
import { useValidatedParams } from "h3-valibot";
import { RecipeState } from "@prisma/client";
import { authOptions } from "../../../../../../auth/[...]";

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

  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recipe not found.",
    });
  }

  if (recipe.state === RecipeState.DRAFT) {
    throw createError({
      statusCode: 403,
      statusMessage: "Draft recipe comment cannot be unliked.",
    });
  }

  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
  });

  if (!comment) {
    throw createError({
      statusCode: 404,
      statusMessage: "Comment not found.",
    });
  }

  const existingHeart = await prisma.commentHeart.findFirst({
    where: {
      commentId: comment.id,
      authorId: session.user.id,
    },
  });

  if (!existingHeart) {
    throw createError({
      statusCode: 403,
      statusMessage: "Cannot unlike comment which is not liked.",
    });
  }

  await prisma.commentHeart.delete({
    where: {
      id: {
        authorId: session.user.id,
        commentId: comment.id,
      },
    },
  });
});
