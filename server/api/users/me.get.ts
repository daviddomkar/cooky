import { getServerSession } from "#auth";
import { authOptions } from "../auth/[...]";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized.",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
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
      statusMessage: "User not found.",
    });
  }

  return {
    ...user,
    roles: user.roles.map((role) => role.role),
  };
});
