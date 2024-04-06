export default defineEventHandler((_) => prisma.recipesByRatings.findMany({
  take: 30,
}));
