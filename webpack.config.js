const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  mode: 'development',
  //mode: 'production',
  /** 
   * entry如果是一个文件就是单入口，chunk的名字是main
   * 如果多个文件就是多入口，chunk的名字就是入口的名字
   * */
  entry: {
    common: './src/common.js',
    index: './src/index.js',
    index1: './src/index1.js'
  },
  output: {
    path: path.join(__dirname, 'dist'), // 输出的目录, 只能是绝对目录
    filename: '[name].[hash:5].js',
    // 跟路径 在浏览器访问的时候以什么路径访问
    publicPath: '/'
  },
  devServer: {
    // 默认为根目录, 产出文件的根目录
    contentBase: path.join(__dirname, 'dist'),
    port: 8080,
    host: 'localhost',
    // 开发服务器启动gzip压缩
    compress: true 
  },
  // 做优化的参数
  optimization: {
    // 做优化的插件
    minimizer: [
      // 压缩js
      new TerserPlugin({
        // 开启多进程并行压缩
        parallel: true,
        // 压缩时开启缓存,如果文件没有变化,使用上次的结果
        cache: true,
      }),
      // 压缩css
      new OptimizeCSSAssetsPlugin({
        // 指定压缩文件的正则表达式
        assetNameRegExp: /\.css$/g,
        // cssnano是PostCSS优化和分解插件
        cssProcessor: require('cssnano')
      })
    ]
  },
  externals: {
    jquery: 'jquery'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: {
          // 使用babel-loader来使用babel
          loader: 'babel-loader',
          options: {
            /** 
             * 预设规则
             * preset-env: 以es6/es7的规则编译
             * preset-react: 以jsx的规则编译
             * */
            "presets": [
              "@babel/preset-env",
              "@babel/preset-react"
            ],
            "plugins": [
              //@babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties
            ]
          }
        }
      },
      {
        // 如果require或import的文件是css文件
        test: /\.css$/,
        //从右往左执行，有两种写法:1.数组 2.字符串
        //use: ['style-loader','css-loader']
        // 提取css成文件
        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader' ]
      },
      {
        test: /\.less$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'less-loader' ]
      },     
      {
        test: /\.scss$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
      },             
      {
        test: /\.(jpg|png|bmp|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit:4096,
              name: '[name].[contenthash:5].[ext]',
              // 把图片拷贝到images目录下
              outputPath: 'images',
              // 重写外面`publicPath`定义图片访问路径
              publicPath: '../images'
            }
          }
        ]
      },
      // 在html中使用图片
      {
        test: /.(html|htm)$/,
        loader: 'html-withimg-loader'
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
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      hash: true,
      chunks: ['common', 'index', 'index1'],
      chunksSortMode: 'manual' 
    }),    
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // 生成文件名,name为入口名
      filename: 'css/[name].[contenthash:5].css',  
      // 代码块文件名(异步加载时用)
      chunkFilename: '[id].css'
    }),
    // 自动向所有模块注入一个_变量,引用了lodash模块
    // 这种注入模式相当于向模块内部注入一个局部变量
    /**
     * 如果配置全局变量
     * 1. let $ = require('expose-loader?$!jquery')
     * 2. 
     * {
     *  test: /\.(jquery)$/,
     *  loader: 'expose-loader?$'
     * }
    */
    new webpack.ProvidePlugin({
      _: 'lodash'
    })
  ]
}