## 四种使用自定义loader的方式
1. 在module中
```js
module: {
    rules: [
        {
            test: /\.js$/,
            use: [
                {
                    loader: path.resolve(__dirname, 'loaders', 'loader1.js')
                }
            ]
        }
    ]
}
```

2. resolveLoader.modules
```js
// 配置loader的查找路径
resolveLoader: {
    // 先往node_modules中找, 再找不到往loaders里找
    modules: ['node_modules', path.resolve(__dirname, 'loaders')]
}
```
3. resolveLoader.alias
```js
resolveLoader: {
    alias: {
        'loader1': path.resolve(__dirname, 'loaders', 'loader1.js')
    }
}
```
