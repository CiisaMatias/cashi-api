import { Context } from "hono";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

function getS3Client() {
  return new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
  });
}

export const uploadController = {
  async uploadReceipt(c: Context) {
    const formData = await c.req.formData();
    const file = formData.get("receipt") as File | null;

    if (!file) {
      return c.json({ error: 'El campo "receipt" es obligatorio' }, 400);
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return c.json({ error: "Solo se aceptan archivos JPEG, PNG o WebP" }, 400);
    }

    if (file.size > MAX_SIZE_BYTES) {
      return c.json({ error: "El archivo no puede superar los 5 MB" }, 400);
    }

    const extension = file.type.split("/")[1];
    const filename = `receipts/${randomUUID()}.${extension}`;
    const buffer = await file.arrayBuffer();
    const client = getS3Client();

    await client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: filename,
        Body: Buffer.from(buffer),
        ContentType: file.type,
      })
    );

    const receiptUrl = `${process.env.R2_PUBLIC_URL}/${filename}`;

    return c.json({ receiptUrl }, 201);
  },
};
