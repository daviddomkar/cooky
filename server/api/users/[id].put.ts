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

  if (!session || !session.user.permissions.includes(permissions.UsersUpdate)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized.",
    });
  }

  const { id } = await useValidatedParams(event, ParametersSchema);
  const { name, username, email, roles } = await useValidatedBody(
    event,
    UserSchema,
  );

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: {
        id,
      },
      include: {
        roles: {
          select: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "Unit not found.",
      });
    }

    if (user.id === session.user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: "You cannot edit yourself.",
      });
    }

    const rolesToDisconnect = user.roles
      .map((role) => role.role)
      .filter((role) => !roles.includes(role.id));

    const rolesToConnect = roles.filter(
      (id) => !user.roles.map((role) => role.role.id).includes(id),
    );

    await tx.user.update({
      where: {
        id,
      },
      data: {
        name,
        username,
        email,
      },
    });

    if (rolesToDisconnect.length > 0) {
      await tx.user.update({
        where: {
          id,
        },
        data: {
          roles: {
            deleteMany: rolesToDisconnect.map((role) => {
              return {
                roleId: role.id,
              };
            }),
          },
        },
      });
    }

    await tx.user.update({
      where: {
        id,
      },
      data: {
        roles: {
          createMany: {
            data: rolesToConnect.map((id) => {
              return {
                roleId: id,
              };
            }),
          },
        },
      },
    });
  });
});
