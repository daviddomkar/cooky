import { useValidatedQuery } from "h3-valibot";
import { objectAsync, string, nullish, toTrimmed, mergeAsync } from "valibot";

export default defineEventHandler(async (event) => {
  const { query, take, after, before } = await useValidatedQuery(
    event,
    mergeAsync([
      objectAsync({
        query: nullish(string("Query must be a string.", [toTrimmed()])),
      }),
      PaginationSchema,
    ]),
  );

  return prisma.ingredient.paginate({
    cursor: {
      field: "id",
      direction: "asc",
    },
    take,
    after,
    before,
    where: query
      ? {
          title: {
            search: `${query}:*`,
          },
        }
      : undefined,
  });
});
