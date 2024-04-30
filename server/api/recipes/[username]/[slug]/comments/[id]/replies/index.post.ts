import { getServerSession } from "#auth";
import { string, objectAsync, toTrimmed, minLength, uuid } from "valibot";
import { useValidatedParams, useValidatedBody } from "h3-valibot";
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
  const { content } = await useValidatedBody(event, CommentSchema);

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
      statusMessage: "Draft recipe comment cannot be replied to.",
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

  await prisma.reply.create({
    data: {
      comment: {
        connect: {
          id,
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
