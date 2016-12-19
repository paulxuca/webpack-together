const path = require('path');
const fs = require('fs-extra');
const walk = require('./walk');
const hash = require('string-hash');
const config = require('./config');
const errors = require('./constants').errors;

const getSessionFileFolderFromName = (sessionName) => path.resolve(process.cwd(), 'sessions', sessionName, 'files');
const fileNameFolder = (fileName, sessionName) => path.resolve(getSessionFileFolderFromName(sessionName), fileName);

const injectScriptTag = (fileContents, sessionName, packageList) => {
  const vendorScripts = packageList.reduce((allScripts, eachVendor) => {
    return allScripts += `<script src=${config.getVendorUrl(String(hash(eachVendor)))} crossorigin="anonymous"></script>\n`;
  }, '');

  return fileContents.replace('</body>',
  `<script src=${config.getToolsUrl()}></script>
  ${vendorScripts}
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
  updateIndexFile: async (sessionName, packageList) => {
    return new Promise((resolve, reject) => {
      const indexFileContents = fs.readFileSync(fileNameFolder('index.html', sessionName), 'utf8');
      writeFile(fileNameFolder('index.html', sessionName), injectScriptTag(
        indexFileContents,
        sessionName,
        packageList
      ))
      .then(() => resolve())
      .catch((err) => reject(new Error(errors.SCRIPT_INJECT_ERROR)));
    });
  },
  getSessionFile(sessionName, fileName) {
    return new Promise((resolve, reject) => {
      const filePath = fileNameFolder(fileName, sessionName);
      if (!fs.existsSync(filePath)) {
        reject();
      }
      resolve(fs.readFileSync(filePath).toString());
    });
  },
  getBundleFile: sessionName => {
    const filePath = path.resolve(process.cwd(), 'api', 'sandbox', sessionName, 'bundle.js');
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath).toString();
    }
  }
};

