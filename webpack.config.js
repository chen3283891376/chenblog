const path = require('path');

module.exports = {
    // 入口文件
    entry: {
        home: './pages/home.jsx',
        about: './pages/about.jsx',
        articles: './pages/articles.jsx',
        comments: './pages/comments.jsx',
        message: './pages/message.jsx'
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
