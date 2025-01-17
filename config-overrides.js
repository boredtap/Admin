const webpack = require('webpack');

module.exports = {
  // Other configurations
  resolve: {
    fallback: {
      "process": require.resolve("process/browser")
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};