import { Visibility } from "@prisma/client";
import { useValidatedParams } from "h3-valibot";
import { string, toTrimmed, objectAsync, uuid } from "valibot";
import { getServerSession } from "#auth";
import { authOptions } from "../auth/[...]";

const ParametersSchema = objectAsync({
  id: string("id parameter is required.", [
    toTrimmed(),
    uuid("id parameter must be a valid UUID."),
  ]),
});

export default defineEventHandler(async (event) => {
  const { id } = await useValidatedParams(event, ParametersSchema);

  const list = await prisma.list.findUnique({
    where: {
      id,
    },
  });

  if (!list) {
    throw createError({
      statusCode: 404,
      statusMessage: "List not found.",
    });
  }

  if (list.visibility === Visibility.PRIVATE) {
    const session = await getServerSession(event, authOptions);

    if (!session || session.user.id !== list.authorId) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden.",
      });
    }
  }

  return list;
});
