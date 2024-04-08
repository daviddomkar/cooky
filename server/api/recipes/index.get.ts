import type { Recipe } from "@prisma/client";
import { useValidatedQuery } from "h3-valibot";
import { objectAsync, string, nullish } from "valibot";

export default defineEventHandler(async (event) => {
  const { username, slug, ...paginationData } = await useValidatedQuery(
    event,
    objectAsync({
      username: nullish(string()),
      slug: nullish(string()),
      ...PaginationMetadataSchema.entries,
    }),
  );

  return usePagination<
    Recipe & {
      author: {
        username: string;
        name: string;
        profileImageId: string | null;
      };
    }
  >({
    // @ts-ignore
    prismaModel: prisma.recipe,
    paginationData,
    where: {
      slug,
      author: {
        username,
      },
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
