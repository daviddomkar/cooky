import { getServerSession } from "#auth";
import { authOptions } from "../auth/[...]";
import permissions from "~/utils/permissions";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);

  if (!session || !session.user.permissions.includes(permissions.UsersList)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized.",
    });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return users;
});
