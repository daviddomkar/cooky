import { getServerSession } from "#auth";
import { useValidatedParams } from "h3-valibot";
import { string, toTrimmed, objectAsync, uuid } from "valibot";
import { authOptions } from "../auth/[...]";

const ParametersSchema = objectAsync({
  id: string("id parameter is required.", [
    toTrimmed(),
    uuid("id parameter must be a valid UUID."),
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

  const { id } = await useValidatedParams(event, ParametersSchema);

  await prisma.$transaction(async (tx) => {
    const recipe = await tx.recipe.findUnique({
      where: {
        id,
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

    await prisma.recipe.delete({
      where: {
        id,
      },
    });
  });
});
