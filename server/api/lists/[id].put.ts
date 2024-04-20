import { getServerSession } from "#auth";
import { useValidatedBody, useValidatedParams } from "h3-valibot";
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
  const { title, visibility } = await useValidatedBody(event, ListSchema);

  await prisma.$transaction(async (tx) => {
    const list = await tx.list.findUnique({
      where: {
        id,
      },
      select: {
        authorId: true,
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
        statusCode: 401,
        statusMessage: "Forbidden.",
      });
    }

    await prisma.list.update({
      where: {
        id,
      },
      data: {
        title,
        visibility,
      },
    });
  });
});
