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

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
      read: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return notifications;
});
