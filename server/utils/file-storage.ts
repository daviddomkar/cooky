import { promisify } from "node:util";
import { Blob } from "node:buffer";
import {
  createWriteStream,
  existsSync,
  statSync,
  createReadStream,
} from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { pipeline } from "node:stream/promises";
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt,
} from "node:crypto";
import { PipelineTransform, Transform } from "node:stream";

const ivLength = 12;
const keyLength = 32;
const authTagLength = 16;
const saltLength = 64;
const cipherAlgorithm = "aes-256-gcm";

class FileStorage {
  async encryptKey(secret: string, key: Buffer) {
    const iv = randomBytes(ivLength);
    const salt = randomBytes(saltLength);

    const masterKey = (await promisify(scrypt)(
      secret,
      salt,
      keyLength,
    )) as Buffer;

    const cipher = createCipheriv(cipherAlgorithm, masterKey, iv, {
      authTagLength,
    });

    const encryptedKey = Buffer.concat([cipher.update(key), cipher.final()]);

    return Buffer.concat([encryptedKey, salt, cipher.getAuthTag(), iv]);
  }

  async decryptKey(secret: string, encryptedKey: Buffer) {
    const iv = encryptedKey.subarray(
      encryptedKey.length - ivLength,
      encryptedKey.length,
    );

    const authTag = encryptedKey.subarray(
      encryptedKey.length - ivLength - authTagLength,
      encryptedKey.length - ivLength,
    );

    const salt = encryptedKey.subarray(
      encryptedKey.length - ivLength - authTagLength - saltLength,
      encryptedKey.length - ivLength - authTagLength,
    );

    const key = encryptedKey.subarray(
      0,
      encryptedKey.length - ivLength - authTagLength - saltLength,
    );

    const masterKey = (await promisify(scrypt)(
      secret,
      salt,
      keyLength,
    )) as Buffer;

    const decipher = createDecipheriv(cipherAlgorithm, masterKey, iv, {
      authTagLength,
    });
    decipher.setAuthTag(authTag);

    return Buffer.concat([decipher.update(key), decipher.final()]);
  }

  async saveFile(
    path: string,
    file: Blob,
    key: Buffer,
    transform?: PipelineTransform<any, any>,
  ) {
    if (!existsSync(path)) {
      await mkdir(dirname(path), { recursive: true });
    }

    const iv = randomBytes(ivLength);

    const cipher = createCipheriv(cipherAlgorithm, key, iv, {
      authTagLength,
    });

    const appendTransformer = new Transform({
      transform(chunk, _, callback) {
        this.push(chunk);
        callback();
      },
      final(callback) {
        this.push(cipher.getAuthTag());
        this.push(iv);
        callback();
      },
    });

    const writable = createWriteStream(path);

    if (!transform) {
      await pipeline(file.stream(), cipher, appendTransformer, writable);
    } else {
      await pipeline(
        file.stream(),
        transform,
        cipher,
        appendTransformer,
        writable,
      );
    }
  }

  async readFile(path: string, key: Buffer) {
    const fileSize = statSync(path).size;
    const dataSize = fileSize - authTagLength - ivLength;

    const trailingBytes = await this.readBytes(path, dataSize, fileSize);
    const iv = trailingBytes.subarray(trailingBytes.length - ivLength);
    const authTag = trailingBytes.subarray(0, authTagLength);

    const stream = createReadStream(path, { start: 0, end: dataSize - 1 });

    const decipher = createDecipheriv(cipherAlgorithm, key, iv, {
      authTagLength,
    });
    decipher.setAuthTag(authTag);

    return stream.pipe(decipher);
  }

  private async readBytes(path: string, start: number, end: number) {
    const chunks = [];
    for await (const chunk of createReadStream(path, {
      start,
      end: end - 1,
    })) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }
}

export const fileStorage = new FileStorage();
