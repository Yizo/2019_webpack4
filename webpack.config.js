const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'development',
  /** 
   * entry如果是一个文件就是单入口，chunk的名字是main
   * 如果多个文件就是多入口，chunk的名字就是入口的名字
   * */
  entry: {
    common: './src/common.js',
    index: './src/index.js',
    login: './src/login.js'
  },
  output: {
    path: path.join(__dirname, 'dist'), // 输出的目录, 只能是绝对目录
    filename: '[name].[hash:5].js',
    publicPath: '/' //公共资源根目录
  },
  devServer: {
    // 默认为根目录, 产出文件的根目录
    contentBase: path.join(__dirname, 'dist'),
    port: 8080,
    host: 'localhost',
    // 开发服务器启动gzip压缩
    compress: true 
  },
  module: {
    rules: [
      {
        // 如果require或import的文件是css文件
        test: /\.css$/,
        //从右往左执行，有两种写法:1.数组 2.字符串
        //use: ['style-loader','css-loader']
        // 提取css成文件
        use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
      },
      {
        test: /\.(jpg|png|bmp|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit:4096
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 产出html文件
    new HtmlWebpackPlugin({
      // 指定模版文件
      template: './src/index.html',
      // 产出文件名
      filename: 'index.html',
      // 避免缓存,在文件后面添加hash
      hash: true,
      // 设置按需引入的chukn
      chunks: ['common', 'index'],
      // 对引入代码块进行排序的模式
      chunksSortMode: 'manual' 
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // 文件名
      filename: '[name].css',  
      // 代码块名
      chunkFilename: '[id].css'
    })
  ]
}