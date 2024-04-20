import { useValidatedParams } from "h3-valibot";
import { string, objectAsync } from "valibot";
import { getServerSession } from "#auth";
import { RecipeState } from "@prisma/client";
import { authOptions } from "../../../auth/[...]";

const ParametersSchema = objectAsync({
  username: string("This field is required."),
  slug: string("This field is required."),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);
  const { username, slug } = await useValidatedParams(event, ParametersSchema);

  const recipe = await prisma.recipe.findByUsernameAndSlug(username, slug);

  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recipe not found.",
    });
  }

  if (recipe.state === RecipeState.DRAFT) {
    if (!session || session.user.id !== recipe.authorId) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden.",
      });
    }
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
