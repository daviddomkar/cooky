export default defineEventHandler(() => {
  return prisma.category.findMany({
    orderBy: {
      order: 'asc'
    }
  });
});
