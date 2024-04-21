import { randomBytes } from "node:crypto";
import { join } from "node:path";
import { Blob } from "node:buffer";
import {
  safeParseAsync,
  string,
  objectAsync,
  toTrimmed,
  minLength,
} from "valibot";
import { getServerSession } from "#auth";
import { Prisma, RecipeState } from "@prisma/client";
import { useValidatedParams } from "h3-valibot";
import { authOptions } from "../../../auth/[...]";
import NewRecipeSchema from "~/server/schemas/NewRecipeSchema";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized.",
    });
  }

  const multipartFormData = await readMultipartFormData(event);

  if (!multipartFormData) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request.",
      data: "No data found in multipart form data.",
    });
  }

  const image = multipartFormData.find(({ name }) => name === "image");
  const json = multipartFormData.find(({ name }) => name === "json");

  if (!image || !json) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request.",
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
      statusMessage: "Bad Request.",
      data: issues,
    });
  }

  const ParametersSchema = objectAsync({
    username: string("username parameter is required.", [
      toTrimmed(),
      minLength(1, "username parameter is required."),
    ]),
    slug: string("slug parameter is required.", [
      toTrimmed(),
      minLength(1, "slug parameter is required."),
    ]),
  });

  const { slug } = await useValidatedParams(event, ParametersSchema);

  const existingRecipe = await prisma.recipe.findFirst({
    where: {
      slug,
    },
  });

  if (!existingRecipe) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recipe not found.",
    });
  }

  if (existingRecipe.authorId !== session.user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden.",
    });
  }

  if (existingRecipe.state === RecipeState.PUBLISHED) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request.",
      data: "The recipe is already published.",
    });
  }

  const {
    fileStorage: { path, secret },
  } = useRuntimeConfig();

  const recipe = await prisma.$transaction(async (tx) => {
    // Delete old image
    await fileStorage.deleteFile(join(path, existingRecipe.imageId));

    const key = randomBytes(32);

    const { image, draft, ingredients: recipeIngredients, ...rest } = output;

    const state = draft ? RecipeState.DRAFT : RecipeState.PUBLISHED;

    const recipe = await tx.recipe.update(existingRecipe.id, {
      ...rest,
      imageKey: await fileStorage.encryptKey(secret!, key),
      authorId: session.user.id,
      state,
      imageMimeType: image.type,
      recipeIngredients: recipeIngredients.map((recipeIngredient) => {
        const { ingredient, amount, unitId } = recipeIngredient;

        return {
          amount: new Prisma.Decimal(amount),
          ingredientId: "id" in ingredient ? ingredient.id : undefined,
          unitId,
          title: "title" in ingredient ? ingredient.title : undefined,
          unitTypes: ingredient.unitTypes ?? undefined,
        } satisfies RecipeIngredientInput;
      }),
    });

    await fileStorage.saveFile(join(path, recipe.imageId), image as Blob, key);

    return recipe;
  });

  return {
    username: session.user.username,
    slug: recipe.slug,
  };
});
