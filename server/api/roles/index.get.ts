import { getServerSession } from "#auth";
import { authOptions } from "../auth/[...]";
import permissions from "~/utils/permissions";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);

  if (!session || !session.user.permissions.includes(permissions.RolesList)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized.",
    });
  }

  const roles = await prisma.role.findMany();

  return roles;
});
