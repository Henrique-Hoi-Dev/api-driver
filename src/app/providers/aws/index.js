const AWS = require('aws-sdk');
require('dotenv/config');

const s3 = new AWS.S3({
  region: process.env.S3_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  correctClockSkew: true,
});

export const sendFile = async ({ file, body }) => {
  try {
    const { buffer: data, mimetype, name } = file;
    const { Location } = await s3
      .upload({
        Body: data,
        Key: `${body.category}/${name}`,
        ContentType: mimetype,
        ACL: 'private',
        Bucket: process.env.S3_BUCKET_NAME,
      })
      .promise();

    console.log('Integration Location:', Location);
    return Location;
  } catch (error) {
    throw error;
  }
};

export const getFile = ({ filename, category }) => {
  return s3
    .getObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${category}/${filename}`,
    })
    .promise();
};

export const deleteFile = ({ filename, category }) => {
  return s3
    .deleteObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${category}/${filename}`,
    })
    .promise();
};
