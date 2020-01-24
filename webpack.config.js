const path = require('path');;
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');


const uglifyJsOptions = {

};
const minimizer = [];
if (false) {
    uglifyJsOptions.mangle = {
        properties: {
            regex: /^_.+$/
        }
    }


    minimizer.push(new TerserPlugin({
        sourceMap: true,
        minify(file, sourceMap) {
            if (sourceMap) {
                uglifyJsOptions.sourceMap = {
                    content: sourceMap,
                };
            }
            return require('uglify-js').minify(file, uglifyJsOptions);
        },
    }));
}
module.exports = {
    mode: 'production',
    entry: {
        main: './build/index.js',
        network: './build/network.js'
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    target: 'web',
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[name].js.map',
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            }
        ]
    },
    optimization: {
        minimizer: minimizer,
    },
};