import { useValidatedQuery } from "h3-valibot";
import { objectAsync, string, optional } from "valibot";
import type { Ingredient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { query, ...paginationData } = await useValidatedQuery(
    event,
    objectAsync({
      query: optional(string()),
      ...PaginationMetadataSchema.entries,
    }),
  );

  let where = {};

  if (query) {
    where = {
      title: {
        search: `${query}:*`,
      },
    };
  }

  return usePagination<Ingredient>({
    prismaModel: prisma.ingredient,
    paginationData,
    where,
  });
});
