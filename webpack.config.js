const path = require('path');

module.exports = {
    // 入口文件
    entry: {
        home: './src/pages/home.jsx',
        about: './src/pages/about.jsx',
        articles: './src/pages/articles.jsx',
        comments: './src/pages/comments.jsx',
        message: './src/pages/message.jsx'
    },
    // 输出配置
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    // 模块规则
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    // 解析配置
    resolve: {
        extensions: ['.js', '.jsx']
    }
};
