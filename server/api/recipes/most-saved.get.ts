import { useValidatedQuery } from "h3-valibot";
import { number, objectAsync, nullish, maxValue, minValue } from "valibot";

export default defineEventHandler(async (event) => {
  const { limit } = await useValidatedQuery(
    event,
    objectAsync({
      limit: nullish(
        number("Limit must be a number.", [
          minValue(1, "Limit must be at least 1."),
          maxValue(100, "Limit must be at most 30."),
        ]),
        30,
      ),
    }),
  );

  const recipes = await prisma.recipesBySaves.findMany({
    take: limit,
  });

  return recipes;
});
