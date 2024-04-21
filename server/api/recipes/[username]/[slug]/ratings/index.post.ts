import { getServerSession } from "#auth";
import {
  string,
  objectAsync,
  toTrimmed,
  minLength,
  number,
  minValue,
  maxValue,
  coerce,
} from "valibot";
import { useValidatedParams, useValidatedBody } from "h3-valibot";
import { RecipeState } from "@prisma/client";
import { authOptions } from "../../../../auth/[...]";

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

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized.",
    });
  }

  const { username, slug } = await useValidatedParams(event, ParametersSchema);

  const { numberOfStars } = await useValidatedBody(
    event,
    objectAsync({
      numberOfStars: coerce(
        number("numberOfStars field is required.", [
          minValue(1, "numberOfStars must be between 1 and 5"),
          maxValue(5, "numberOfStars must be between 1 and 5"),
        ]),
        Number,
      ),
    }),
  );

  const recipe = await prisma.recipe.findByUsernameAndSlug(username, slug);

  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recipe not found.",
    });
  }

  if (recipe.state === RecipeState.DRAFT) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden.",
    });
  }

  await prisma.rating.upsert({
    where: {
      id: {
        recipeId: recipe.id,
        authorId: session.user.id,
      },
    },
    update: {
      numberOfStars,
    },
    create: {
      numberOfStars,
      recipe: {
        connect: {
          id: recipe.id,
        },
      },
      author: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });
});
