import { join } from "node:path";
import { Blob } from "node:buffer";
import sharp from "sharp";

export default defineEventHandler(async (event) => {
  const recipeImages = await prisma.file.findMany({
    where: {
      NOT: {
        recipe: null,
      },
    },
  });

  const {
    fileStorage: { secret, path },
  } = useRuntimeConfig();

  for (const image of recipeImages) {
    const key = await fileStorage.decryptKey(secret, image.key);
    const imgPath = join(path, image.id);

    const stream = await fileStorage.readFile(imgPath, key);

    const buffer = await stream.pipe(sharp().resize(420).keepExif()).toBuffer();
    const blob = new Blob([buffer], { type: image.mimeType });

    await fileStorage.saveFile(imgPath, blob, key);
  }

  sendNoContent(event);
});
