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

  if (!session || !session.user.permissions.includes(permissions.RolesDelete)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized.",
    });
  }

  const { id } = await useValidatedParams(event, ParametersSchema);

  await prisma.$transaction(async (tx) => {
    const role = await tx.role.findUnique({
      where: {
        id,
      },
    });

    if (!role) {
      throw createError({
        statusCode: 404,
        statusMessage: "Role not found.",
      });
    }

    await prisma.role.delete({
      where: {
        id,
      },
    });
  });
});
