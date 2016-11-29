const path = require('path');
const fs = require('fs-extra');
const api = require('./api');

const getSessionFileFolderFromName = (sessionName) => path.resolve(process.cwd(), 'sessions', sessionName, 'files');
const fileNameFolder = (fileName, sessionName) => path.resolve(getSessionFileFolderFromName(sessionName), fileName);


const injectScriptTag = (fileContents, sessionName) => {
  return fileContents.replace('</body>', `<script src=${api.getWebpackUrl(sessionName)}></script>\n</body>`);
};

module.exports = {
  fs: fs,
  updateSessionFiles(files, sessionName) {
    return new Promise((resolve) => {
      if (!fs.existsSync(path.resolve(getSessionFileFolderFromName(sessionName)))) {
        fs.mkdirpSync(getSessionFileFolderFromName(sessionName));
      } else {
        fs.emptyDirSync(getSessionFileFolderFromName(sessionName));
      }

      files.forEach((eachFile) => {
        if (eachFile.name.split('.')[eachFile.name.split('.').length - 1] === 'html') {
          fs.writeFileSync(fileNameFolder(eachFile.name, sessionName), injectScriptTag(eachFile.content, sessionName))
        } else {
          fs.writeFileSync(fileNameFolder(eachFile.name, sessionName), eachFile.content);
        }
      });
      resolve();
    });
  }
};
