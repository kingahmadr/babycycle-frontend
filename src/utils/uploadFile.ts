import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_S3_REGION || "",
  endpoint: `https://${process.env.NEXT_PUBLIC_S3_CUSTOM_ENDPOINT}`, // Custom endpoint
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY || "",
  },
});

export const uploadFile = async (
  { fileName, file }: { fileName: string; file: File },
  enqueueSnackbar: (message: string, options?: { variant: string }) => void
): Promise<string> => {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_BUCKET, // Bucket name from environment
      Key: `img/${fileName}`, // File path within the bucket
      Body: file, // File content
      ACL: "public-read", // Make file publicly accessible (optional)
    });

    // Send the upload command
    const sendRes = await s3Client.send(command);
    console.log(sendRes);

    // Check response metadata
    const { httpStatusCode } = sendRes.$metadata;
    if (httpStatusCode !== 200) {
      enqueueSnackbar(`Error uploading file. Status: ${httpStatusCode}`, {
        variant: "error",
      });
      throw new Error(`Upload failed with HTTP status: ${httpStatusCode}`);
    }

    // Notify success
    enqueueSnackbar("File uploaded successfully!", { variant: "success" });

    // Construct and return the desired file's public URL
    return `https://${process.env.NEXT_PUBLIC_S3_CUSTOM_ENDPOINT}/${process.env.NEXT_PUBLIC_BUCKET}/img/${fileName}`;
  } catch (error) {
    console.error("Upload error:", error);
    enqueueSnackbar("Failed to upload file. Please try again.", {
      variant: "error",
    });
    throw error;
  }
};