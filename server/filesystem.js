const path = require('path');
const fs = require('fs-extra');

const config = require('./config');

const getSessionFileFolderFromName = (sessionName) => path.resolve(process.cwd(), 'sessions', sessionName, 'files');
const fileNameFolder = (fileName, sessionName) => path.resolve(getSessionFileFolderFromName(sessionName), fileName);


const injectScriptTag = (fileContents, sessionName) => {
  return fileContents.replace('</body>', `<script src=${config.getWebpackUrl(sessionName)}></script>\n</body>`);
};

module.exports = {
  fs: fs,
  updateSessionFiles(files, sessionName) {
    return new Promise((resolve) => {
      if (!fs.existsSync(getSessionFileFolderFromName(sessionName))) {
        fs.mkdirpSync(getSessionFileFolderFromName(sessionName));
      }

      files.forEach((file) => {
        if (file.name.split('.')[file.name.split('.').length - 1] === 'html') {
          console.log('THIS IS AN HTML FILE');
          fs.writeFileSync(fileNameFolder(file.name, sessionName), injectScriptTag(file.content, sessionName))
        } else {
          fs.writeFileSync(fileNameFolder(file.name, sessionName), file.content);
        }
      });
      resolve();
    });
  },
  getSessionFile(sessionName, fileName) {
    const path = fileNameFolder(fileName, sessionName);
    if (!fs.readFileSync(path)) {
      return null;
    }
    return fs.readFileSync(path).toString();
  }
};
