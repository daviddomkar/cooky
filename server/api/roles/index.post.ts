import { getServerSession } from "#auth";
import { useValidatedBody } from "h3-valibot";
import { authOptions } from "../auth/[...]";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);

  if (!session || !session.user.permissions.includes(permissions.RolesCreate)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized.",
    });
  }

  const { title, permissions: rolePermissions } = await useValidatedBody(
    event,
    RoleSchema,
  );

  await prisma.role.create({
    data: {
      title,
      permissions: rolePermissions,
    },
  });

  setResponseStatus(event, 201);
});
