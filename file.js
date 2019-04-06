const fs = require('fs');
const path = require('path');
const os = require('os');


function makeTempDirectory(prefix, successCallback) {
  return new Promise(function (resolve, reject) {

    fs.mkdtemp(path.join(os.tmpdir(), prefix ? prefix : 'rsto'), (err, folder) => {
      if (err) {
        reject(err);
      }
      if (successCallback) {
        successCallback();
      }
      resolve(folder);
    });
  });
}

module.exports = { makeTempDirectory };
