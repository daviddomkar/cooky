import type { Recipe } from '@prisma/client';

export default defineEventHandler((event) => {
  const { username, slug, ...paginationData } = getQuery(event);

  return usePagination<Recipe>({
    prismaModel: prisma.recipe,
    paginationData,
    where: {
      slug,
      author: {
        username
      }
    }
  });
});
