const fs = require('fs-extra');
const path = require('path');
const detectiveES6 = require('detective-es6');
const detectiveES5 = require('detective')

const htmlRegex = new RegExp(/(&nbsp;|<([^>]+)>)/ig);
const absoluteModuleRegex = new RegExp(/\W{0,}/);

module.exports = {
  findAllModules: sessionName => {
    const allFiles = fs.walkSync(path.resolve(process.cwd(), 'sessions', sessionName));
    const modules = allFiles
    .filter((eachFile) => eachFile.split('/')[eachFile.split('/').length - 1].split('.')[1] !== 'html')
    .reduce((allModules, eachFile) => {
      const data = fs.readFileSync(eachFile, 'utf8');
      const es5Deps = detectiveES5(data.replace(htmlRegex, '"'), {parse: {sourceType: 'module'}});
      const es6Deps = detectiveES6(data, {parse: {sourceType: 'module'}});
      return allModules.concat(es5Deps, es6Deps);
    }, [])
    .reduce((allDeduped, eachModule) => {
      if (allDeduped.indexOf(eachModule) === -1 && !eachModule.match(absoluteModuleRegex)[0]) {
        return allDeduped.concat(eachModule);
      }
      return allDeduped;
    }, []);
    return modules;
  }
}