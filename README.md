# 2019_webpack4

## webpack基本概念
## 配置开发服务器
## 加载css
  1. 三种loader写法
  2. css提取为style
  3. css提取成文件插件`mini-css-extract-plugin`
## 清理目录插件
  clean-webpack-plugin
## 产出html文件插件
  html-webpack-plugin
## 在js和css中引入图片
  ```js
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
  ```
## 压缩js和css
  ```js
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
  ```
## 处理less和sass
npm i less less-loader node-sass sass-loader -D
```js
      {
        test: /\.less$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'less-loader' ]
      },     
      {
        test: /\.scss$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
      },
```
## 处理css前缀 
npm i postcss-loader autoprefixer -D 

postcss的功能: 
1. 把css解析成javascript可以操作的抽象语法树(ast)
2. 调用插件来处理ast得到结果

## 转义es6/es7/jsx
npm i babel-loader @babel/core @babel/preset-env  @babel/preset-react  -D 
npm i @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D 

## babel runtime
* babel 在每个文件都插入了辅助代码，使代码体积过大
* babel 对一些公共方法使用了非常小的辅助代码，比如 _extend
* 默认情况下会被添加到每一个需要它的文件中。你可以引入 @babel/runtime 作为一个独立模块，来避免重复引入
* @babel/preset-env只编译es6,es7语法,但对于一些api,如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise
  需要babel-plugin-transform-runtime编译
```js
  npm install --save-dev @babel/plugin-transform-runtime
  npm install --save @babel/runtime
  // .babelrc
  {
    "presets": ["@babel/preset-env"],
    "plugins": [
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      ["@babel/plugin-proposal-class-properties", { "loose" : true }]
      [
          "@babel/plugin-transform-runtime",
          {
              "corejs": false,
              "helpers": true,
              "regenerator": true,
              "useESModules": true
          }
      ]
    ]
  }  
```

## 打包第三方类库
### 直接import引入
```js
import _ from 'lodash'
```
### 插件引入
```js
  // 自动向所有模块注入一个_变量,引用了lodash模块
  // 这种注入模式相当于向模块内部注入一个局部变量 
  new webpack.ProvidePlugin({
    _: 'lodash'
  })
```

### expose-loader
相当与配置一个全局变量
1.  require 

`let $ = require('expose-loader?$!jquery')`

2. module

```js
{
     test: /\.(jquery)$/,
     loader: 'expose-loader?$'
}
```

### externals
如果我们想引用一个库，但是又不想让webpack打包，并且又不影响我们在程序中以CMD、AMD或者window/global全局等方式进行使用，那就可以通过配置externals
```js
// js
const jQuery = require("jquery");
import jQuery from 'jquery';

// html
<script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.js"></script>

// webpack.config.js
  externals: {
    jquery: 'jquery'
  }
```

###  html-webpack-externals-plugin
自动外链第三方资源
```js
new HtmlWebpackExternalsPlugin({
  externals: [
    {
      module: 'jquery',
      entry: 'https://cdn.bootcss.com/jquery/3.4.1/core.js',
      global: 'JQuery'
    }
  ]
})
```

## resolve解析
```js
resolve: {
  // 在require或是import的时候加文件扩展名,会依次尝试添加扩展名进行匹配
  extensions: [".js",".jsx",".json",".css"],
  alias: {
    // 配置别名
    // 每当引入xxx时,相当于引入./src/../xxx, 而不会从node_modules里查找
    'xxx': './src/xxx'
  },
  // 对于直接声明依赖名的模块（如 react ），webpack 会类似 Node.js 一样进行路径搜索，搜索node_modules目录
  // 甚至还可以添加额外的目录
  modules: ['node_modules', 'zfmodules'],
  // 默认情况下package.json 文件则按照文件中 main 字段的文件名来查找文件
  // 当目录下没有 package.json 文件时，我们说会默认使用目录下的 index.js 这个文件 
  mainFields: ['module', 'index'],
  // 配置解析 loader 时的 resolve 配置
  resolveLoader: {
    modules: [ 'node_modules' ],
    extensions: [ '.js', '.json' ],
    mainFields: [ 'loader', 'main' ]
  }
},
// 不需要解析的依赖
noParse: /jquery|lodash/
```

## 区分环境变量
1. process.env.NODE_ENV
2. "dev": "webpack-dev-server --env=development --open"
3. webpack-merge拆分配置

## 对图片进行压缩和优化
`image-webpack-loader`
```js
 {
          test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
          use: [
            'file-loader',
+           {
+             loader: 'image-webpack-loader',
+             options: {
+               mozjpeg: {
+                 progressive: true,
+                 quality: 65
+               },
+               optipng: {
+                 enabled: false,
+               },
+               pngquant: {
+                 quality: '65-90',
+                 speed: 4
+               },
+               gifsicle: {
+                 interlaced: false,
+               },
+               webp: {
+                 quality: 75
+               }
+             }
+           },
          ]
        }
```

## 日志优化
```js
stats: 'verbose',
plugins: [
  new FriendlyErrorsWebpackPlugin()
]
```

## 费时分析
```js
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const smw = new SpeedMeasureWebpackPlugin();
module.exports =smw.wrap({
  // webpack配置
  ...
});
```

## 打包后分析
```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports={
  plugins: [
    new BundleAnalyzerPlugin()  // 使用默认配置
    //默认配置的具体配置项
    // new BundleAnalyzerPlugin({
    // 启动展示打包报告的http服务器,不展示为disabled
    //   analyzerMode: 'server', 
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: '8888',
    //   reportFilename: 'report.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: true,
    // 是否生成stats.json文件
    //   generateStatsFile: false,
    //   statsFilename: 'stats.json',
    //   statsOptions: null,
    //   excludeAssets: null,
    //   logLevel: info
    // })
  ]
}

// 命令
{
 "scripts": {
    "generateAnalyzFile": "webpack --profile --json > stats.json", // 生成分析文件
    "analyz": "webpack-bundle-analyzer --port 8888 ./dist/stats.json" // 启动展示打包报告的http服务器
  }
}
```
***


### 1. 当引入文件有顺序时
1. 在`entry`里按顺序放
2. plugin -> htmlwebpackplugin -> chunks

```js
    new HtmlWebpackPlugin({
      ...
      // 设置按需引入的chukn
      chunks: ['common', 'index'],
      // 对引入代码块进行排序的模式
      chunksSortMode: 'manual' 
    })
```

### 2. 三种hash
1. 一个entry产生一个chunk
2. 一个chunk包含多个模块

|  hash   | 含义  |
|  :----  | :----  |
| hash  | 每次编译产生的hash |
| chunkhash  | 每个entry都会产出一个chunk,chunk文件不改变,chunkhash不会变化 | 
| contenthash | 只有该模块内容变了,模块contenthash会改变 |