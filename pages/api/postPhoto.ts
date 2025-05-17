import type { NextApiRequest, NextApiResponse } from "next";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { filename, contentType } = req.query;

  if (!filename || !contentType) {
    return res.status(400).json({ error: "Missing filename or contentType" });
  }

  try {
    const client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: filename.toString(),
      Conditions: [["starts-with", "$Content-Type", contentType.toString()]],
      Fields: {
        // acl: "public-read",  // REMOVE or COMMENT OUT this line
        "Content-Type": contentType.toString(),
      },
      Expires: 600,
    });

    return res.status(200).json({ url, fields });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not generate signed URL" });
  }
};

export default handler;
