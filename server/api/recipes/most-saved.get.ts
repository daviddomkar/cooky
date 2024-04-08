import { useValidatedQuery } from "h3-valibot";
import {
  number,
  objectAsync,
  nullish,
  maxValue,
  minValue,
  coerce,
} from "valibot";

export default defineEventHandler(async (event) => {
  const { limit } = await useValidatedQuery(
    event,
    objectAsync({
      limit: nullish(
        coerce(
          number("Limit must be a number.", [
            minValue(1, "Limit must be at least 1."),
            maxValue(100, "Limit must be at most 30."),
          ]),
          Number,
        ),
        30,
      ),
    }),
  );

  const recipes = await prisma.recipesBySaves.findMany({
    take: limit,
  });

  return recipes;
});
