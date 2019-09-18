const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode: "development",
    entry: {
        index: './src/loader/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    // 配置loader的查找路径
    resolveLoader: {
        // 先往node_modules中找, 再找不到往loaders里找
        modules: ['node_modules', path.resolve(__dirname, 'loaders')]
    },
    module: {
        rules: [
            {
                test: /\.js/,
                use: [
                    'loader1',
                    'loader2',
                    'loader3'
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
}