const path = require('path');
const fs = require('fs-extra');
const walk = require('./walk');
const config = require('./config');

const getSessionFileFolderFromName = (sessionName) => path.resolve(process.cwd(), 'sessions', sessionName, 'files');
const fileNameFolder = (fileName, sessionName) => path.resolve(getSessionFileFolderFromName(sessionName), fileName);

const injectScriptTag = (fileContents, vendorHash, sessionName) => {
  return fileContents.replace('</body>',
  `<script src=${config.getToolsUrl()}></script>
  <script src=${config.getVendorUrl(vendorHash)} crossorigin="anonymous"></script>
  <script src=${config.getWebpackUrl(sessionName)} crossorigin="anonymous"></script>
  </body>`);
};

const writeFile = (fileName, fileContents) => new Promise((resolve, reject) => {
  fs.writeFile(fileName, fileContents, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});

module.exports = {
  fs: fs,
  updateSessionFiles: (files, sessionName) => {
    return new Promise(async (resolve) => {
      if (!fs.existsSync(getSessionFileFolderFromName(sessionName))) {
        fs.mkdirpSync(getSessionFileFolderFromName(sessionName));
      }

      let fileIter = 0;
      for (;fileIter < files.length; fileIter++) {
        const file = files[fileIter];
        await writeFile(fileNameFolder(file.name, sessionName), file.content);
      }
      resolve();
    });
  },
  updateIndexFile: async (sessionName, vendorHash) => {
    const indexFileContents = fs.readFileSync(fileNameFolder('index.html', sessionName), 'utf8');
    await writeFile(fileNameFolder('index.html', sessionName), injectScriptTag(
      indexFileContents,
      vendorHash,
      sessionName
    ));
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

