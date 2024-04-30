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

    const user = await prisma.user.findFirst({
      where: {
        id: session.user.id,
        roles: {
          some: {
            roleId: role.id,
          },
        },
      },
    });

    if (user) {
      throw createError({
        statusCode: 403,
        statusMessage: "You cannot delete your own role.",
      });
    }

    await prisma.role.delete({
      where: {
        id,
      },
    });
  });
});
