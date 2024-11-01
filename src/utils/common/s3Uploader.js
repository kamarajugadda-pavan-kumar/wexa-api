const AWS = require("aws-sdk");
require("dotenv").config();

// Initialize S3 client
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
});

/**
 * Uploads a single file to S3 and returns the uploaded file's metadata.
 * @param {Object} file - The file to upload
 * @param {string} folderPath - The folder path within the bucket
 * @returns {Object} - The uploaded file's metadata including media type and URL
 */
async function uploadFileToS3(file, folderPath = "uploads") {
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${folderPath}/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const s3Response = await s3.upload(s3Params).promise();

  return {
    mediaType: file.mimetype.startsWith("image/") ? "image" : "video",
    mediaUrl: s3Response.Location,
  };
}

/**
 * Uploads multiple files to S3 and returns metadata for each uploaded file.
 * @param {Array} files - The files to upload
 * @param {string} folderPath - The folder path within the bucket
 * @returns {Array} - An array of metadata objects for each uploaded file
 */
async function uploadFilesToS3(files, folderPath = "uploads") {
  return Promise.all(files.map((file) => uploadFileToS3(file, folderPath)));
}

module.exports = {
  uploadFileToS3,
  uploadFilesToS3,
};
