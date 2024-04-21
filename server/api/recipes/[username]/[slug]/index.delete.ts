import { getServerSession } from "#auth";
import { useValidatedParams } from "h3-valibot";
import { string, toTrimmed, objectAsync, minLength } from "valibot";
import { authOptions } from "../../../auth/[...]";

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

  await prisma.$transaction(async (tx) => {
    const recipe = await tx.recipe.findFirst({
      where: {
        author: {
          username,
        },
        slug,
      },
      select: {
        authorId: true,
      },
    });

    if (!recipe) {
      throw createError({
        statusCode: 404,
        statusMessage: "Recipe not found.",
      });
    }

    if (recipe.authorId !== session.user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden.",
      });
    }

    await prisma.recipe.deleteMany({
      where: {
        author: {
          username,
        },
        slug,
      },
    });
  });
});
