const fs = require('fs');
const path = require('path');
const os = require('os');

function readFile (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, 'utf8', function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

function writeFile (fileName, data, successCallback) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(fileName, data, err => {
      // throws an error, caught outside
      if (err) {
        reject(err);
      }

      // success case, the file was saved
      if (successCallback) {
        successCallback();
      }
      resolve(data);
    });
  });
}

function makeTempDirectory(prefix, successCallback) {
    return new Promise(function (resolve, reject) {
        
        fs.mkdtemp(path.join(os.tmpdir(), prefix ? prefix : 'rsto'), (err, folder) => {
            if (err) {
                reject(err);
            }
            if (successCallback){
                successCallback();
            }
            resolve(folder);
        });          
    });
}

module.exports = { makeTempDirectory, readFile, writeFile };
