const fs = require('fs-extra');
const path = require('path');
const detectiveES6 = require('detective-es6');
const detectiveES5 = require('detective');
const errors = require('./constants').errors;


const htmlRegex = new RegExp(/(&nbsp;|<([^>]+)>)/ig);
const walkable = ['jsx', 'js', 'tsx', 'coffee', 'ts'];

module.exports = {
  findAllModules: (currentFileState) => {
    return new Promise((resolve, reject) => {
      const modules = currentFileState
        .filter((eachFile) => {
          const extension = eachFile.name.split('/')[eachFile.name.split('/').length - 1].split('.')[1];
          return walkable.indexOf(extension) !== -1;
        })
        .reduce((allModules, eachFile) => {
          
          const detectableRows = eachFile.content.split('\n').filter((eachRow) => {
            return eachRow.includes('require', 'import');
          });

          try {
            const es5Deps = detectiveES5(detectableRows, {parse: {sourceType: 'module', ecmaVersion: 7 }});
            const es6Deps = detectiveES6(detectableRows, {parse: {sourceType: 'module', ecmaVersion: 7 }});
            return allModules.concat(es5Deps, es6Deps);
          } catch (moduleError) {
            reject(new Error(errors.WALK_ERROR));
          }
        }, [])
        .reduce((allModules, eachModule) => {

          const moduleName = eachModule.split('/')[0];
          if (allModules.indexOf(moduleName) === -1 && !eachModule.includes('./')) {
            return allModules.concat(moduleName);
          }
          return allModules;
        }, []);
      resolve(modules);
    });
  }
}