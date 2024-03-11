import prisma from "~/server/utils/prisma-client"

export default defineNitroPlugin(async (_) => {
  await prisma.$connect();
});
