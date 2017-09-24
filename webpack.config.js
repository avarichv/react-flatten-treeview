const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader' },
            { 
                test: /\.(css|scss)$/, 
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }, 
                    { loader: "sass-loader" }
                ]
            },
            { 
                test: /\.ttf$/, 
                loader: 'url-loader?name=fonts/[name].[md5:hash:hex:7].[ext]' 
            }

        ]
    },
    devServer: {
        contentBase: './'
    }
}