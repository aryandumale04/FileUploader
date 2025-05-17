import type { NextApiRequest, NextApiResponse } from "next";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  const { filename, contentType } = req.query;

  if (!filename || !contentType) {
    return res.status(400).json({ error: "Missing filename or contentType" });
  }

  // Optional: log env vars for debugging (disable in production)
  console.log("S3 ENV CONFIG:", {
    MY_ACCESS_KEY_ID: process.env.MY_ACCESS_KEY_ID,
    MY_SECRET_ACCESS_KEY: process.env.MY_SECRET_ACCESS_KEY ? "✅ Set" : "❌ Missing",
    MY_REGION: process.env.MY_REGION,
    MY_BUCKET_NAME: process.env.MY_BUCKET_NAME,
  });

  try {
    const key = `uploads/${Date.now()}_${filename.toString()}`;

    const client = new S3Client({
      region: process.env.MY_REGION!,
      credentials: {
        accessKeyId: process.env.MY_ACCESS_KEY_ID!,
        secretAccessKey: process.env.MY_SECRET_ACCESS_KEY!,
      },
    });

    const { fields } = await createPresignedPost(client, {
      Bucket: process.env.MY_BUCKET_NAME!,
      Key: key,
      Conditions: [
        ["starts-with", "$key", "uploads/"],
        ["starts-with", "$Content-Type", ""],
      ],
      Fields: {
        key,
        "Content-Type": contentType.toString(),
      },
      Expires: 600, // 10 minutes
    });

    const url = `https://${process.env.MY_BUCKET_NAME}.s3.${process.env.MY_REGION}.amazonaws.com`;

    return res.status(200).json({ url, fields });
  } catch (error) {
    const err = error as Error;
    console.error("❌ Error generating signed URL:", err.message);
    return res.status(500).json({
      error: "Could not generate signed URL",
      details: err.message,
    });
  }
}
