const arrayContains = (array, value) => array.indexOf(value) !== -1;

module.exports = {
  createLoaders(loaders) {

    const finalLoaders = [];

    if (arrayContains(loaders, 'babel')) {
      const jsLoader = {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [],
          plugins: [],
        }
      };

      if (arrayContains(loaders, 'es2015')) {
        jsLoader.query.presets.push('es2015');
      }

      if (arrayContains(loaders, 'react')) {
        jsLoader.query.presets.push('react');
      }

      if (arrayContains(loaders, 'stage-0')) {
        jsLoader.query.presets.push('stage-0');
      }

      finalLoaders.push(jsLoader);
    }

    if (arrayContains(loaders, 'css')) {
      const cssLoader = {
        test: /\.css?$/,
        loader: 'style-loader!css-loader',
      };
      finalLoaders.push(cssLoader);
    }
    return finalLoaders;
  },
};
