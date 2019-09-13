# 2019_webpack4

## webpack基本概念
> Webpack 启动后会从Entry里配置的Module开始递归解析 Entry 依赖的所有 Module。 每找到一个 Module， 就会根据配置的Loader去找出对应的转换规则，对 Module 进行转换后，再解析出当前 Module 依赖的 Module。 这些模块会以 Entry 为单位进行分组，一个 Entry 和其所有依赖的 Module 被分到一个组也就是一个 Chunk。最后 Webpack 会把所有 Chunk 转换成文件输出。 在整个流程中 Webpack 会在恰当的时机执行 Plugin 里定义的逻辑。


- Entry：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
- Module：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
- Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
- Loader：模块转换器，用于把模块原内容按照需求转换成新内容。
- Plugin：扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。
- Output：输出结果，在 Webpack 经过一系列处理并得出最终想要的代码后输出结果。
- context: context即是项目打包的路径上下文，如果指定了context,那么entry和output都是相对于上下文路径的，contex必须是一个绝对路径 
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
      ["@babel/plugin-proposal-class-properties", { "loose" : true }],
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

## px自动转成rem
- px2rem-loader lib-flexible
```js
      {
        test: /\.css/,
        use: [
          'style-loader',
          {
            loader: 'px2rem-loader',
            options: {
              // 1rem = 75px
              remUnit: 75,
              // 8位精度
              remPrecesion: 8
            }
          }
        ]
      }
```

## DLL
- `.dll`为后缀的文件
- 动态链接库中可以包含给其他模块调用的函数和数据
- 把基础模块独立出来打包到单独的动态连接库里
- 当需要导入的模块在动态连接库里的时候，模块不能再次被打包，而是去动态连接库里获取
- DllPlugin插件： 用于打包出一个个动态连接库
- DllReferencePlugin: 在配置文件中引入DllPlugin插件打包好的动态连接库
```js
// webpack.dll.config.js
const path = require('path')
const DllPlugin = require('webpack/lib/DllPlugin')
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin')
module.exports = {
  context: __dirname,
  mode: 'development',
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
```

## Tree Shaking
- 将模块中没有用到的方法不打包,webpack默认支持
- 使用条件: 
  1. 必须是在生产模式下 
  2. 必须是es6模块化(import/export)。
    js的loader预设modules:false(不转义es6)
  3. devtool设置为nul

```js
    "presets":[
        ["@babel/preset-env",{"modules":false}],//转译 ES6 ES7
        "@babel/preset-react"//转译JSX语法
    ],
```
## Scope Hoisting
- Scope Hoisting 可以让 Webpack 打包出来的代码文件更小、运行的更快， 它又译作 "作用域提升"。webpack默认开启
- 代码在运行时因为创建的函数作用域更少了，内存开销也随之变小
- scope hoisting的原理是将所有的模块按照引用顺序放在一个函数作用域里，然后适当地重命名一些变量以防止命名冲突
- 只有es6 Moudule支持
- 在mode为production下默认开启,开发环境要用 `webpack.optimize.ModuleConcatenationPlugin`插件

```js
// 开发环境下
module.exports = {
  mode: 'development',
  resolve: {
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main']
  },
  plugins: [
    // 开启 Scope Hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
};
```

## 代码分割
### entry 
通过设置不同入口达到分割,存在的问题是: 
1. chunks之间的模块可能存在重复
2. 不够灵活
```js
entry: {
        index: "./src/index.js",
        login: "./src/login.js"
}
```
### 动态导入和懒加载
动态import并没有原生支持,需要babel
```js 
// npm i @babel/plugin-syntax-dynamic-import --save-dev
{
  plugins: [
    '@babel/plugin-syntax-dynamic-import'
  ]
}
// index.js
document.querySelector('#clickBtn').addEventListener('click',() => {
    import('./hello').then(result => {
        console.log(result.default);
    });
});
// index.html
<button id="clickBtn">点我</button>
```
### 提取公共代码
基于一下原则: 
- 新的代码块被共享或者来自node_modules文件夹
- 新的代码块大于30kb(在min+giz之前)
- 按需加载代码块的请求数量应该<=5
- 页面初始化时加载代码块的请求数量应该<=3
```js
// 默认配置
 optimization: {
    // 这里放着优化的内容
    minimizer: [
      // 表示放优化的插件
      new TerserWebpackPlugin({
               parallel:true,//开启多进程并行压缩
               cache:true//开启缓存
      }),
      new OptimizeCssAssetsWebpackPlugin({
        assetNameRegExp: /\.css$/g, // 指定要压缩的模块的正则
        // cssnano是PostCSS的CSS优化和分解插件。cssnano采用格式很好的CSS，并通过许多优化，以确保最终的生产环境尽可能小。
        cssProcessor: require('cssnano'),
      }),
    ],
    splitChunks: {
        chunks: "all",//默认作用于异步chunk，值为all/initial/async
        minSize: 30000,  //默认值是30kb,代码块的最小尺寸
        minChunks: 1,  //被多少模块共享,在分割之前模块的被引用次数
        maxAsyncRequests: 5,  //按需加载最大并行请求数量
        maxInitialRequests: 3,  //一个入口的最大并行请求数量
        name: true,  //打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔开，如vendor~
        automaticNameDelimiter:'~',//默认webpack将会使用入口名和代码块的名称生成命名,比如 'vendors~main.js'
        cacheGroups: { //设置缓存组用来抽取满足不同规则的chunk,下面以生成common为例
            vendors: {
              chunks: "initial",
              name: 'vendors',  //可以通过'name'配置项来控制切割之后代码块的命名,给多个分割之后的代码块分配相同的名称,所有的vendor 模块被放进一个共享的代码块中,不过这会导致多余的代码被下载所以并不推荐
              test: /node_modules/,//条件
              priority: -10 ///优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中,为了能够让自定义缓存组有更高的优先级(默认0),默认缓存组的priority属性为负值.
            },
             commons: {
              chunks: "initial",
              name: 'commons',
              minSize: 0,//最小提取字节数
              minChunks: 1, //最少被几个chunk引用
              priority: -20,
              reuseExistingChunk: true//    如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
            }
      }
    },
    //runtime包含:在模块交互时,连接模块所需的加载和解析逻辑。包括浏览器中的已加载模块的连接，以及懒加载模块的执行逻辑.
    //设置optimization.runtimeChunk=true ,将每一个入口添加一个只包含runtime的额外代码块.然而设置值为single,只会为所有生成的代码块创建一个共享的runtime文件.runtime:连接模块化应用程序的所有代码.
    runtimeChunk:{
        name:'manifest'
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