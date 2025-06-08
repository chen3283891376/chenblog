const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

entriesName = ['home', 'about', 'articles', 'comments','message']

let entries = {};
plugins = [new MiniCssExtractPlugin()];

for (let name of entriesName) {
    entries[name] = `./src/pages/${name}.jsx`;
}

module.exports = {
    // 入口文件
    entry: entries,
    // 插件配置
    plugins: plugins,
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
            }, 
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    // 解析配置
    resolve: {
        extensions: ['.js', '.jsx']
    },
    cache: {
        type: 'filesystem',
    }
};
