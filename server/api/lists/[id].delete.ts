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
    const list = await tx.list.findUnique({
      where: {
        id,
      },
      select: {
        authorId: true,
        favoritesOfUser: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!list) {
      throw createError({
        statusCode: 404,
        statusMessage: "List not found.",
      });
    }

    if (list.authorId !== session.user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden.",
      });
    }

    if (list.favoritesOfUser?.id) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden.",
      });
    }

    await prisma.list.delete({
      where: {
        id,
      },
    });
  });
});
