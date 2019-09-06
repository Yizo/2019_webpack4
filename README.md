# 2019_webpack4

## webpack基本概念
## 配置开发服务器
## 加载css
  1. 三种loader写法
  2. css提取为style
  3. css提取成文件插件`mini-css-extract-plugin`
## 清理目录插件`clean-webpack-plugin`
## 产出html文件插件`html-webpack-plugin`
## 在js和css中引入图片
## 压缩js和css
  

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