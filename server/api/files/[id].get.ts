import { join } from "node:path";
import { useValidatedParams } from "h3-valibot";
import { objectAsync, uuid, string } from "valibot";

export default defineEventHandler(async (event) => {
  const { id } = await useValidatedParams(
    event,
    objectAsync({
      id: string("This field is required", [uuid("ID parameter must be UUID")]),
    }),
  );

  const file = await prisma.file.findUnique({
    where: {
      id,
    },
  });

  if (!file) {
    throw createError({
      statusCode: 404,
      statusMessage: "File not found",
    });
  }

  const {
    fileStorage: { secret, path },
  } = useRuntimeConfig();

  setResponseHeader(event, "Content-Type", file.mimeType);
  setResponseHeader(event, "Transfer-Encoding", "chunked");

  const key = await fileStorage.decryptKey(secret, file.key);
  const stream = await fileStorage.readFile(join(path, file.id), key);

  return sendStream(event, stream);
});
