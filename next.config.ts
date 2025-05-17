import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    MY_ACCESS_KEY_ID: process.env.MY_ACCESS_KEY_ID,
    MY_SECRET_ACCESS_KEY: process.env.MY_SECRET_ACCESS_KEY,
    MY_REGION: process.env.MY_REGION?.trim(), 
    MY_BUCKET_NAME: process.env.MY_BUCKET_NAME,
  },
};

export default nextConfig;
