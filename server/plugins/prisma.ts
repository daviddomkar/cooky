import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export default defineNitroPlugin(async (_) => {
  await prisma.$connect();
});
