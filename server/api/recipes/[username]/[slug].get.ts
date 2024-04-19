import { useValidatedParams } from "h3-valibot";
import { string, objectAsync } from "valibot";
import { prisma } from "~/server/utils/prisma-client";

const ParametersSchema = objectAsync({
  username: string("This field is required."),
  slug: string("This field is required."),
});

export default defineEventHandler(async (event) => {
  const { username, slug } = await useValidatedParams(event, ParametersSchema);

  const recipe = await prisma.recipe.findByUsernameAndSlug(username, slug);

  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recipe not found.",
    });
  }

  const averageRating = await prisma.rating.aggregate({
    _avg: {
      numberOfStars: true,
    },
    where: {
      recipeId: recipe.id,
    },
  });

  return {
    ...recipe,
    rating: averageRating._avg.numberOfStars,
  };
});
