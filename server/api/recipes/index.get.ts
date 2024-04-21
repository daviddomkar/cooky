import { RecipeState } from "@prisma/client";
import { useValidatedQuery } from "h3-valibot";
import { objectAsync, string, nullish, mergeAsync, toTrimmed } from "valibot";

export default defineEventHandler(async (event) => {
  const { username, slug, category, listId, query, take, after, before } =
    await useValidatedQuery(
      event,
      mergeAsync([
        objectAsync({
          username: nullish(
            string("username must be a string.", [toTrimmed()]),
          ),
          slug: nullish(string("slug must be a string.", [toTrimmed()])),
          category: nullish(
            string("category must be a string.", [toTrimmed()]),
          ),
          listId: nullish(string("listId must be a string.", [toTrimmed()])),
          query: nullish(string("query must be a string.", [toTrimmed()])),
        }),
        PaginationSchema,
      ]),
    );

  return prisma.recipe.paginate({
    cursor: {
      field: "id",
      direction: "asc",
    },
    take,
    after,
    before,
    where: {
      state: RecipeState.PUBLISHED,
      slug: slug ?? undefined,
      categories: category
        ? {
            some: {
              category: {
                slug: category,
              },
            },
          }
        : undefined,
      author: username
        ? {
            username,
          }
        : undefined,
      lists: listId
        ? {
            some: {
              listId,
            },
          }
        : undefined,
      title: query
        ? {
            search: `${query.replace(/[\s\n\t]/g, "_")}:*`,
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
