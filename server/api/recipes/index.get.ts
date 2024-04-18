import { RecipeState } from "@prisma/client";
import { useValidatedQuery } from "h3-valibot";
import { objectAsync, string, nullish, mergeAsync, toTrimmed } from "valibot";

export default defineEventHandler(async (event) => {
  const { username, slug, category, take, after, before } =
    await useValidatedQuery(
      event,
      mergeAsync([
        objectAsync({
          username: nullish(
            string("Username must be a string.", [toTrimmed()]),
          ),
          slug: nullish(string("Slug must be a string.", [toTrimmed()])),
          category: nullish(
            string("Category must be a string.", [toTrimmed()]),
          ),
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
