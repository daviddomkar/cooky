import { useValidatedQuery } from "h3-valibot";
import { string, objectAsync, nullish } from "valibot";

export default defineEventHandler(async (event) => {
  const { category } = await useValidatedQuery(
    event,
    objectAsync({
      category: nullish(string("Category must be a string.")),
    }),
  );

  if (category) {
    return await prisma.recipe.findRandomInCategory(category);
  }

  return prisma.recipe.findRandom();
});
