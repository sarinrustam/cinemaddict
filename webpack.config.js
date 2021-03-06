const MomentLocalesPlugin = require(`moment-locales-webpack-plugin`);
const path = require(`path`);

module.exports = {
  mode: `development`,
  entry: `./src/main.js`,
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, `docs`)
  },
  devtool: `source-map`,
  devServer: {
    contentBase: path.join(__dirname, `docs`),
    watchContentBase: true
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, `src/components/`),
      '@src': path.resolve(__dirname, `src/`),
      '@controllers': path.resolve(__dirname, `src/controllers/`),
    }
  },
  plugins: [
    new MomentLocalesPlugin({
      localesToKeep: [`es-us`]
    })
  ]
};
