import { useValidatedQuery } from "h3-valibot";
import { getServerSession } from "#auth";
import { objectAsync, string, nullish, mergeAsync, toTrimmed } from "valibot";
import { Visibility } from "@prisma/client";
import { authOptions } from "../auth/[...]";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);

  const { username, take, after, before } = await useValidatedQuery(
    event,
    mergeAsync([
      objectAsync({
        username: nullish(string("Username must be a string.", [toTrimmed()])),
        slug: nullish(string("Slug must be a string.", [toTrimmed()])),
        category: nullish(string("Category must be a string.", [toTrimmed()])),
      }),
      PaginationSchema,
    ]),
  );

  return prisma.list.paginate({
    cursor: {
      field: "id",
      direction: "asc",
    },
    take,
    after,
    before,
    where: {
      visibility:
        session?.user?.username && session?.user?.username === username
          ? undefined
          : Visibility.PUBLIC,
      author: username
        ? {
            username,
          }
        : undefined,
    },
    select: {
      id: true,
      title: true,
      recipes: {
        take: 1,
        select: {
          recipe: {
            select: {
              imageId: true,
            },
          },
        },
      },
    },
  });
});
