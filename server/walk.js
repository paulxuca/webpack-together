const fs = require('fs-extra');
const path = require('path');
const detectiveES6 = require('detective-es6');
const detectiveES5 = require('detective');

const htmlRegex = new RegExp(/(&nbsp;|<([^>]+)>)/ig);

module.exports = {
  findAllModules: (currentFileState) => {
    const modules = currentFileState
      .filter((eachFile) => eachFile.name.split('/')[eachFile.name.split('/').length - 1].split('.')[1] !== 'html')
      .reduce((allModules, eachFile) => {
        const es5Deps = detectiveES5(eachFile.content.replace(htmlRegex, '"'), {parse: {sourceType: 'module'}});
        const es6Deps = detectiveES6(eachFile.content, {parse: {sourceType: 'module'}});
        return allModules.concat(es5Deps, es6Deps);
      }, [])
      .reduce((allModules, eachModule) => {
        const moduleName = eachModule.split('/')[0];
        if (allModules.indexOf(moduleName) === -1 && !moduleName.includes('./')) {
          return allModules.concat(moduleName);
        }
        return allModules;
      }, []);
    return modules;
  }
}