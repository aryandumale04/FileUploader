# 📁 File Upload Web App using AWS (Next.js + S3)

This is a simple and fully functional web application that allows users to upload files directly to an Amazon S3 bucket using a presigned URL mechanism.

## 🛠 Tech Stack

- **Frontend:** Next.js (React framework)
- **Hosting:** AWS Amplify (for the frontend)
- **Backend:** Amazon S3 (for file storage using presigned URLs)
- **Presigned URL Generator:** API route in Next.js
- **Deployment:** No EC2 used (as per requirements)

## ✅ Features

- Upload files directly to S3 using secure presigned URLs.
- Frontend hosted on AWS Amplify.
- Backend logic (presigned URL generation) implemented in serverless-friendly architecture using Next.js API route.
- Environment variables securely configured.

## 🔗 Live Demo

👉 [Click here to open the hosted app] : https://main.d3u8tj2skslkwg.amplifyapp.com/

## 🚀 How It Works

1. User selects a file from the browser.
2. The app makes a GET request to an API route to generate a presigned POST URL.
3. The frontend uploads the file directly to S3 using the provided URL and form fields.


