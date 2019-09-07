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