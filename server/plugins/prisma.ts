export default defineNitroPlugin(async (_) => {
  await prisma.$connect();
});
