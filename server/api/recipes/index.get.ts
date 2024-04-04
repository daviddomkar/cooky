import type { Recipe } from "@prisma/client";
import { useValidatedQuery } from "h3-valibot";
import { objectAsync, string, optional, nullable } from "valibot";
import PaginationMetadataSchema from "~/server/schemas/PaginationMetadataSchema";

export default defineEventHandler(async (event) => {
  const { username, slug, ...paginationData } = await useValidatedQuery(
    event,
    objectAsync({
      username: nullable(optional(string())),
      slug: nullable(optional(string())),
      ...PaginationMetadataSchema.entries,
    }),
  );

  return usePagination<Recipe>({
    prismaModel: prisma.recipe,
    paginationData,
    where: {
      slug,
      author: {
        username,
      },
    },
  });
});
