const { readFile } = require('./file');
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
    region: 'eu-west-2'
});

s3 = new AWS.S3({ apiVersion: '2006-03-01' });

function uploadtoS3 (fileName, path) {
  return new Promise(async function (resolve, reject) {
    let body;
    try {
      body = await readFile(path);
    } catch (e) {
      console.error('Error retrieving file to upload to S3: ' + fileName);
      reject(e);
    }

    let uploadParams = {
      Bucket: 'arranfrance.com',
      Key: fileName,
      Body: body
    };

    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, function (err, data) {
      if (err) {
        reject(err);
      }
      if (data) {
        resolve(data.Location);
      }
    });
  });
}

module.exports = { uploadtoS3 };
