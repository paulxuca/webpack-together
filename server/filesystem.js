const path = require('path');
const fs = require('fs-extra');

const config = require('./config');

const getSessionFileFolderFromName = (sessionName) => path.resolve(process.cwd(), 'sessions', sessionName, 'files');
const fileNameFolder = (fileName, sessionName) => path.resolve(getSessionFileFolderFromName(sessionName), fileName);

const injectScriptTag = (fileContents, vendorHash, sessionName) => {
  return fileContents.replace('</body>',
  `<script src=${config.getVendorUrl(vendorHash)}></script>
  <script src=${config.getWebpackUrl(sessionName)}></script>
  </body>`);
};

module.exports = {
  fs: fs,
  updateSessionFiles(files, vendorHash, sessionName) {
    return new Promise((resolve) => {
      if (!fs.existsSync(getSessionFileFolderFromName(sessionName))) {
        fs.mkdirpSync(getSessionFileFolderFromName(sessionName));
      }

      files.forEach((file) => {
        if (file.name.split('.')[file.name.split('.').length - 1] === 'html') {
          fs.writeFileSync(fileNameFolder(file.name, sessionName), injectScriptTag(file.content, vendorHash, sessionName))
        } else {
          fs.writeFileSync(fileNameFolder(file.name, sessionName), file.content);
        }
      });
      resolve();
    });
  },
  getSessionFile(sessionName, fileName) {
    const filePath = fileNameFolder(fileName, sessionName);
    if (!fs.readFileSync(filePath)) {
      return null;
    }
    return fs.readFileSync(filePath).toString();
  },
  getBundleFile: sessionName => {
    const filePath = path.resolve(process.cwd(), 'api', 'sandbox', sessionName, 'bundle.js');
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath).toString();
    }
  }
};

