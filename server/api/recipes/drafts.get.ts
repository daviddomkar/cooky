import { RecipeState } from "@prisma/client";
import { useValidatedQuery } from "h3-valibot";
import { getServerSession } from "#auth";
import { objectAsync, string, mergeAsync, toTrimmed } from "valibot";
import { authOptions } from "../auth/[...]";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized.",
    });
  }

  const { username, take, after, before } = await useValidatedQuery(
    event,
    mergeAsync([
      objectAsync({
        username: string("Username must be a string.", [toTrimmed()]),
      }),
      PaginationSchema,
    ]),
  );

  if (username !== session.user.username) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  return prisma.recipe.paginate({
    cursor: {
      field: "id",
      direction: "asc",
    },
    take,
    after,
    before,
    where: {
      state: RecipeState.DRAFT,
      author: username
        ? {
            username,
          }
        : undefined,
    },
    include: {
      author: {
        select: {
          username: true,
          name: true,
          profileImageId: true,
        },
      },
    },
  });
});
