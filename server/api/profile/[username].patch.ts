import { join } from "node:path";
import { Blob } from "node:buffer";
import { randomBytes } from "node:crypto";
import { getServerSession } from "#auth";
import {
  blob,
  maxSize,
  mimeType,
  object,
  parseAsync,
  unionAsync,
  toTrimmed,
  minLength,
  string,
  objectAsync,
  type Output,
} from "valibot";
import sharp from "sharp";
import { useValidatedParams } from "h3-valibot";
import { readBody } from "h3";
import { File } from "@prisma/client";
import { authOptions } from "../auth/[...]";

const ParametersSchema = objectAsync({
  username: string("This field is required.", [
    toTrimmed(),
    minLength(1, "This field is required."),
  ]),
});

const UnifiedSchema = unionAsync([
  object({
    name: string("This field is required.", [
      toTrimmed(),
      minLength(1, "This field is required."),
    ]),
  }),
  object({
    profileImage: blob("This field is required.", [
      mimeType(
        ["image/jpeg", "image/png", "image/gif"],
        "The file must be an image (jpeg, png or gif).",
      ),
      maxSize(5 * 1024 * 1024, "The file size must be less than 5MB."),
    ]),
  }),
  object({
    coverImage: blob("This field is required.", [
      mimeType(
        ["image/jpeg", "image/png", "image/gif"],
        "The file must be an image (jpeg, png or gif).",
      ),
      maxSize(5 * 1024 * 1024, "The file size must be less than 5MB."),
    ]),
  }),
]);

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const { username } = await useValidatedParams(event, ParametersSchema);

  if (username !== session.user.username) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  const body = await readBody(event);
  const multipartFormData = await readMultipartFormDataAsBlobs(event);

  let data: Output<typeof UnifiedSchema>;

  try {
    data = await parseAsync(UnifiedSchema, {
      ...body,
      ...multipartFormData,
    });
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: error,
    });
  }

  if ("name" in data) {
    await prisma.user.update({
      where: {
        username,
      },
      data: {
        name: data.name,
      },
    });

    return;
  }

  const {
    fileStorage: { path, secret },
  } = useRuntimeConfig();

  if ("profileImage" in data) {
    const profileImage = data.profileImage as Blob;

    let oldProfileImageFile: File | null | undefined;

    await prisma.$transaction(async (tx) => {
      oldProfileImageFile = await tx.file.findFirst({
        where: {
          profileImageUser: {
            username,
          },
        },
      });

      const key = randomBytes(32);

      const file = await tx.file.create({
        data: {
          mimeType: profileImage.type,
          key: await fileStorage.encryptKey(secret, key),
          profileImageUser: {
            connect: {
              username,
            },
          },
        },
      });

      // Save the file within the transaction to ensure that the trabnsaction is rolled back if the file save fails
      await fileStorage.saveFile(
        join(path, file.id),
        profileImage,
        key,
        sharp().resize(256, 256),
      );

      if (oldProfileImageFile) {
        await tx.file.delete({
          where: {
            id: oldProfileImageFile.id,
          },
        });
      }
    });

    // Delete the old profile image file only after the transaction is committed
    if (oldProfileImageFile) {
      await fileStorage.deleteFile(join(path, oldProfileImageFile.id));
    }
  } else if ("coverImage" in data) {
    const coverImage = data.coverImage as Blob;

    let oldCoverImageFile: { id: string } | null | undefined;

    await prisma.$transaction(async (tx) => {
      oldCoverImageFile = await tx.file.findFirst({
        where: {
          coverImageUser: {
            username,
          },
        },
      });

      const key = randomBytes(32);

      const file = await tx.file.create({
        data: {
          mimeType: coverImage.type,
          key: await fileStorage.encryptKey(secret, key),
          coverImageUser: {
            connect: {
              username,
            },
          },
        },
      });

      // Save the file within the transaction to ensure that the trabnsaction is rolled back if the file save fails
      await fileStorage.saveFile(
        join(path, file.id),
        coverImage,
        key,
        sharp().resize(undefined, 1080),
      );

      if (oldCoverImageFile) {
        await tx.file.delete({
          where: {
            id: oldCoverImageFile.id,
          },
        });
      }
    });

    // Delete the old cover image file only after the transaction is committed
    if (oldCoverImageFile) {
      await fileStorage.deleteFile(join(path, oldCoverImageFile.id));
    }
  }
});
