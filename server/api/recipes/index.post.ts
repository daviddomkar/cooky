import { randomBytes } from "node:crypto";
import { join } from "node:path";
import { Blob } from "node:buffer";
import { safeParseAsync } from "valibot";
import { getServerSession } from "#auth";
import { RecipeState } from "@prisma/client";
import { authOptions } from "../auth/[...]";
import NewRecipeSchema from "~/server/schemas/NewRecipeSchema";

const {
  fileStorage: { path, secret },
} = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const multipartFormData = await readMultipartFormData(event);

  if (!multipartFormData) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: "No data found in multipart form data.",
    });
  }

  const image = multipartFormData.find(({ name }) => name === "image");
  const json = multipartFormData.find(({ name }) => name === "json");

  if (!image || !json) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: "The image and JSON fields are required.",
    });
  }

  const constructedData = {
    image: new Blob([image.data], { type: image.type }),
    ...JSON.parse(json.data.toString()),
  };

  const { success, output, issues } = await safeParseAsync(
    NewRecipeSchema,
    constructedData,
  );

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: issues,
    });
  }

  if (
    output.ingredients.some(
      ({ ingredient }) => !ingredient.id && ingredient.unitTypes.length === 0,
    )
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: "All ingredients must have an ID or at least one unit type.",
    });
  }

  return prisma.$transaction(async (tx) => {
    const key = randomBytes(32);

    const { image, draft, ingredients: recipeIngredients, ...rest } = output;

    const draftState = draft ? RecipeState.DRAFT : RecipeState.PUBLISHED;

    const recipe = await tx.recipe.create({
      ...rest,
      imageKey: await fileStorage.encryptKey(secret!, key),
      authorId: session.user.id,
      state: draftState,
      imageMimeType: image.type,
      recipeIngredients: recipeIngredients.map((recipeIngredient) => {
        const { ingredient, amount, unitId } = recipeIngredient;

        return {
          amount,
          ingredientId: ingredient.id,
          unitId,
          title: ingredient.title,
          unitTypes: ingredient.unitTypes,
        };
      }),
    });

    await fileStorage.saveFile(join(path!, recipe.imageId), image as Blob, key);

    return recipe;
  });
});
