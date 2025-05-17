import type { NextApiRequest, NextApiResponse } from "next";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('Bucket:', process.env.MY_BUCKET_NAME);
  console.log('Region:', process.env.MY_REGION);

  const { filename, contentType } = req.query;

  if (!filename || !contentType) {
    return res.status(400).json({ error: "Missing filename or contentType" });
  }

  try {
    const key = `uploads/${Date.now()}_${filename.toString()}`;

    const client = new S3Client({
      region: process.env.MY_REGION,
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
        ["starts-with", "$Content-Type", ""]
      ],
      Fields: {
        key,
        "Content-Type": contentType.toString(),
      },
      Expires: 600,
    });

    // Use the regional endpoint instead of default returned URL
    const url = `https://nextjs-upload-bucket-12345.s3.ap-south-1.amazonaws.com`;


    return res.status(200).json({ url, fields });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return res.status(500).json({ error: "Could not generate signed URL" });
  }
};

export default handler;
