export default defineEventHandler((_) =>
  prisma.recipesBySaves.findMany({
    take: 1,
  }),
);
