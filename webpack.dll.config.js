const path = require('path')
const DllPlugin = require('webpack/lib/DllPlugin')
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin')
module.exports = {
  context: __dirname,
  //mode: 'development',
  mode: 'production',
  entry: {
    react: ['react', 'react-dom']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].dll.js',
    libraryTarget: 'var',
    // 指定导出库的名字 _dll_react
    library: '_dll_[name]'
  },
  module: {
    rules: [
    ]
  },
  plugins: [
    new DllPlugin({
        // 必须和导出库名相同
        name: '_dll_[name]',
        path: path.resolve(__dirname, 'dist', '[name].manifest.json')
    }),
    new DllReferencePlugin({
        manifest: path.resolve(__dirname, 'dist', 'react.manifest.json')
    })
  ]
}