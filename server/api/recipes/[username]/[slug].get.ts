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
      statusMessage: "Recipe for the given parameters not found",
    });
  }

  return recipe;
});
