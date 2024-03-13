import { createReadStream } from "node:fs";
import { join } from "node:path";
import { useValidatedParams } from "h3-valibot";
import { objectAsync, uuid, string } from "valibot";

export default defineEventHandler(async (event) => {
  const { id } = await useValidatedParams(
    event,
    objectAsync({
      id: string("This field is required", [uuid("ID string must be UUID")]),
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

  const { fileStoragePath } = useRuntimeConfig();

  const filePath = join(fileStoragePath, file.id);

  setResponseHeader(event, "Content-Type", file.mimeType);
  setResponseHeader(event, "Transfer-Encoding", "chunked");

  const stream = createReadStream(filePath);

  return sendStream(event, stream);
});
