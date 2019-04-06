const { readFile } = require('./file');
const fs = require('fs');
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: 'eu-west-1'
});

s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const uploadtoS3 = asyncLimit(_uploadtoS3, 3);

// https://dev.to/ycmjason/limit-concurrent-asynchronous-calls-5bae
function asyncLimit(fn, n) {
  const pendingPromises = new Set();
  return async function (...args) {
    while (pendingPromises.size >= n) {
      await Promise.race(pendingPromises);
    }

    const p = fn.apply(this, args);
    const r = p.catch(() => { });
    pendingPromises.add(r);
    await r;
    pendingPromises.delete(r);
    return p;
  };
};

async function _uploadtoS3(fileName, path) {
  console.log('Uploading ' + path)
  let body;
  try {
    body = fs.createReadStream(path);
  } catch (e) {
    console.error('Error retrieving file to upload to S3: ' + fileName);
    throw e;
  }

  let uploadParams = {
    Bucket: 'arranfrance.com',
    Key: fileName,
    Body: body
  };

  // call S3 to retrieve upload file to specified bucket
  return new Promise(function (resolve, reject) {
    s3.upload(uploadParams, function (err, data) {
      if (err) {
        reject(err);
      }
      if (data) {
        console.log('Uploaded ' + data.Location)
        resolve(data.Location);
      }
    });
  });
}

module.exports = { uploadtoS3 };
