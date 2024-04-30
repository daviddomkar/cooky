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

  const notification = await prisma.notification.findUnique({
    where: {
      id,
    },
  });

  if (!notification) {
    throw createError({
      statusCode: 404,
      statusMessage: "Notification not found.",
    });
  }

  if (notification.userId !== session.user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden.",
    });
  }

  await prisma.notification.update({
    where: {
      id,
    },
    data: {
      read: true,
    },
  });

  sendNoContent(event);
});
