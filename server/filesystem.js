const path = require('path');
const MemoryFileSystem = require('memory-fs');
const fs = new MemoryFileSystem();

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
      if (fs.existsSync(path.resolve(getSessionFileFolderFromName(sessionName)))) {
        fs.unlinkSync(getSessionFileFolderFromName(sessionName));
      }
      fs.mkdirpSync(getSessionFileFolderFromName(sessionName));

      files.forEach((file) => {
        if (file.name.split('.')[file.name.split('.').length - 1] === 'html') {
          fs.writeFileSync(fileNameFolder(file.name, sessionName), injectScriptTag(file.content, sessionName))
        } else {
          fs.writeFileSync(fileNameFolder(file.name, sessionName), file.content);
        }
      });
      resolve();
    });
  }
};
