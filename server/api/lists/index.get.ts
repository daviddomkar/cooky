import { useValidatedQuery } from "h3-valibot";
import { objectAsync, string, nullish, mergeAsync, toTrimmed } from "valibot";

export default defineEventHandler(async (event) => {
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
